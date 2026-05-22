/**
 * POC: AI-illustrated comic panels via Gemini 2.5 Flash Image ("Nano Banana").
 *
 * Goal: validate CHARACTER CONSISTENCY. We generate one Rocky "reference sheet",
 * then feed that image back in to generate 3 story panels, and eyeball whether
 * Rocky looks like the same character across all of them.
 *
 * Run:  npm run poc:illustrate
 * Needs: GEMINI_API_KEY in olivias-comics/.env.local
 * Output: olivias-comics/poc-output/*.png  (gitignored)
 *
 * This script is standalone — it does NOT touch the app. Safe to delete.
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'poc-output');

const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// Locked style so every panel reads as the same children's comic.
const STYLE =
  'Bright, friendly children\'s storybook comic-panel illustration. Bold clean ' +
  'outlines, flat cel shading, warm palette, soft lighting. Single panel, no text, ' +
  'no words, no speech bubbles, no captions, no signature.';

// Movie-accurate-but-kid-friendly Rocky (Project Hail Mary Eridian).
const ROCKY =
  'Rocky, a gentle alien from a kids\' comic: a faceless, eyeless rock creature ' +
  'about the size of a big dog. Domed faceted stone carapace in grey and warm ' +
  'brown tones, five articulated stone legs, each leg ending in three triangular ' +
  'stone fingers, small carved markings on his shell. He has no face and no eyes.';

const PANELS = [
  {
    name: '01-cave',
    prompt: `${ROCKY} Scene: Rocky stands on the glowing floor of a crystal cave, ` +
      `curiously reaching one front leg toward a floating glowing mineral. Same ` +
      `character design as the reference image. ${STYLE}`,
  },
  {
    name: '02-desert',
    prompt: `${ROCKY} Scene: Rocky scuttles quickly across a starlit alien desert ` +
      `at night under two moons, a sense of motion. Same character design as the ` +
      `reference image. ${STYLE}`,
  },
  {
    name: '03-friend',
    prompt: `${ROCKY} Scene: Rocky stands beside a friendly young human child in a ` +
      `spacesuit; together they look up at a glowing star-map hologram. Same ` +
      `character design as the reference image. ${STYLE}`,
  },
];

// --- tiny .env.local loader (so we don't need a dep or a node flag) ---
async function loadEnv() {
  if (process.env.GEMINI_API_KEY) return;
  const envPath = join(ROOT, '.env.local');
  if (!existsSync(envPath)) return;
  const txt = await readFile(envPath, 'utf8');
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

function extractImage(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    const inline = p.inlineData || p.inline_data;
    if (inline?.data) return { b64: inline.data, mime: inline.mimeType || inline.mime_type || 'image/png' };
  }
  return null;
}

async function generate({ prompt, refB64 }) {
  const parts = [{ text: prompt }];
  if (refB64) parts.push({ inlineData: { mimeType: 'image/png', data: refB64 } });
  const t0 = Date.now();
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ parts }] }),
  });
  const ms = Date.now() - t0;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status} (${ms}ms): ${body.slice(0, 600)}`);
  }
  const json = await res.json();
  const img = extractImage(json);
  if (!img) {
    const reason = JSON.stringify(json?.candidates?.[0]?.finishReason || json?.promptFeedback || json).slice(0, 600);
    throw new Error(`No image returned (${ms}ms). Detail: ${reason}`);
  }
  return { ...img, ms };
}

async function main() {
  await loadEnv();
  if (!process.env.GEMINI_API_KEY) {
    console.error('\n  GEMINI_API_KEY not set. Add it to olivias-comics/.env.local:\n    GEMINI_API_KEY=your-key-here\n');
    process.exit(1);
  }
  await mkdir(OUT, { recursive: true });

  console.log(`Model: ${MODEL}\nOutput: ${OUT}\n`);

  // 1) Reference sheet (text -> image)
  console.log('Generating Rocky reference sheet…');
  const ref = await generate({
    prompt: `Character reference sheet, full body, centered, plain neutral ` +
      `background. ${ROCKY} ${STYLE}`,
  });
  await writeFile(join(OUT, '00-reference.png'), Buffer.from(ref.b64, 'base64'));
  console.log(`  saved 00-reference.png  (${ref.ms}ms)\n`);

  // 2) Panels (reference image + text -> image)
  let total = ref.ms;
  for (const panel of PANELS) {
    console.log(`Generating panel ${panel.name}…`);
    const out = await generate({ prompt: panel.prompt, refB64: ref.b64 });
    await writeFile(join(OUT, `${panel.name}.png`), Buffer.from(out.b64, 'base64'));
    total += out.ms;
    console.log(`  saved ${panel.name}.png  (${out.ms}ms)`);
  }

  console.log(`\nDone. ${PANELS.length + 1} images, ~${(total / 1000).toFixed(1)}s total.`);
  console.log('Open poc-output/ and judge: does Rocky look like the SAME character in every panel?');
}

main().catch((e) => { console.error('\nPOC failed:\n', e.message, '\n'); process.exit(1); });
