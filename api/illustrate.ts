import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';
import { list, put } from '@vercel/blob';

export const config = { maxDuration: 30 };

const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
const STYLE_VERSION = 'v1';
const EST_COST_PER_IMAGE = 0.04; // USD, rough

// In-memory usage tally (per warm instance; resets on cold start).
const usage = { generated: 0, cacheHits: 0 };
function logUsage(kind: 'HIT' | 'MISS', characterId: string | undefined, ms: number) {
  if (kind === 'HIT') usage.cacheHits++; else usage.generated++;
  const est = (usage.generated * EST_COST_PER_IMAGE).toFixed(2);
  console.log(`[illustrate] ${kind} char=${characterId || 'none'} ${ms}ms | generated=${usage.generated} cacheHits=${usage.cacheHits} ~$${est}`);
}

// Locked illustration style so every panel reads as the same children's comic.
const STYLE =
  "Bright, friendly children's storybook comic-panel illustration. Bold clean " +
  'outlines, flat cel shading, warm palette, soft cinematic lighting. A single ' +
  'comic panel. No text, no words, no letters, no speech bubbles, no captions, ' +
  'no watermark, no signature.';

// Per-character anatomy locks. The reference image is the source of truth; this
// text reinforces it so the model never drifts off-model.
const ANATOMY: Record<string, string> = {
  rocky:
    'Rocky is a gentle alien made of living stone, drawn EXACTLY like the ' +
    'attached reference image: one domed faceted rock carapace shell on top and ' +
    'EXACTLY FIVE straight jointed stone legs, each ending in three small ' +
    'triangular stone fingers. He has NO head, NO neck, NO eyes, NO face, NO ' +
    'mouth, and is NOT a turtle. Grey and warm-brown stone with faint carved ' +
    'chevron markings.',
  mainecoon:
    'Sir Biscuit is a big fluffy brown tabby Maine Coon cat, drawn like the ' +
    'attached reference image: lynx-tufted ears, a cream ruff and belly, ringed ' +
    'tail, green almond eyes, and a gentle friendly face.',
  bunniforous:
    'Bunniforous is a soft floppy-eared bunny captain, drawn like the attached ' +
    'reference image: gentle and brave, big ears, fluffy fur.',
};

function extractImage(data: unknown): { b64: string; mime: string } | null {
  const parts =
    (data as { candidates?: { content?: { parts?: unknown[] } }[] })?.candidates?.[0]?.content?.parts || [];
  for (const p of parts as Record<string, { data?: string; mimeType?: string; mime_type?: string }>[]) {
    const inline = p.inlineData || p.inline_data;
    if (inline?.data) return { b64: inline.data, mime: inline.mimeType || inline.mime_type || 'image/png' };
  }
  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set' });

  const { characterId, referenceUrl, sceneRefUrl, prompt } = (req.body ?? {}) as {
    characterId?: string;
    referenceUrl?: string;
    sceneRefUrl?: string;
    prompt?: string;
  };
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  const anatomy = (characterId && ANATOMY[characterId]) || '';
  const refNote = referenceUrl && sceneRefUrl
    ? ' Keep the character identical to the FIRST reference image; match the spaceship/workshop interior to the SECOND reference image.'
    : referenceUrl
      ? " Keep the character's anatomy identical to the reference image."
      : '';
  const fullPrompt = `${anatomy} Scene: ${prompt}.${refNote} ${STYLE}`;

  // Cache key: same character + scene + style + prompt => same image.
  const hash = createHash('sha256')
    .update(`${characterId || 'none'}|${sceneRefUrl || ''}|${STYLE_VERSION}|${MODEL}|${fullPrompt}`)
    .digest('hex')
    .slice(0, 32);
  const pathname = `panels/${characterId || 'none'}/${STYLE_VERSION}-${hash}.png`;
  const haveBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
  const t0 = Date.now();

  try {
    // 1) Cache hit?
    if (haveBlob) {
      const { blobs } = await list({ prefix: pathname, limit: 1 });
      const hit = blobs.find((b) => b.pathname === pathname);
      if (hit) {
        logUsage('HIT', characterId, Date.now() - t0);
        return res.status(200).json({ url: hit.url, cached: true });
      }
    }

    // 2) Build the request parts (text + character ref + optional scene ref).
    const parts: unknown[] = [{ text: fullPrompt }];
    const pushRef = async (url: string) => {
      const r = await fetch(url);
      if (!r.ok) return;
      const buf = Buffer.from(await r.arrayBuffer());
      parts.push({ inlineData: { mimeType: r.headers.get('content-type') || 'image/png', data: buf.toString('base64') } });
    };
    if (referenceUrl) await pushRef(referenceUrl);
    if (sceneRefUrl) await pushRef(sceneRefUrl);

    // 3) Generate.
    const gen = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({ contents: [{ parts }] }),
    });
    if (!gen.ok) {
      const text = await gen.text();
      return res.status(gen.status).json({ error: text.slice(0, 600) });
    }
    const img = extractImage(await gen.json());
    if (!img) return res.status(502).json({ error: 'no image returned from model' });

    // 4) Store (Blob) or return inline. If Blob fails (e.g. private store,
    //    quota), fall back to an inline data URL so the panel still renders.
    logUsage('MISS', characterId, Date.now() - t0);
    const dataUrl = `data:${img.mime};base64,${img.b64}`;
    if (haveBlob) {
      try {
        const buffer = Buffer.from(img.b64, 'base64');
        const { url } = await put(pathname, buffer, {
          access: 'public',
          contentType: 'image/png',
          addRandomSuffix: false,
        });
        return res.status(200).json({ url, cached: false });
      } catch (blobErr) {
        console.warn('[illustrate] blob put failed, serving inline:', blobErr instanceof Error ? blobErr.message : blobErr);
        return res.status(200).json({ url: dataUrl, cached: false, blobError: true });
      }
    }
    return res.status(200).json({ url: dataUrl, cached: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return res.status(500).json({ error: message });
  }
}
