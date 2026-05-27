import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/* Dev-only middleware so `npm run dev` serves the serverless API routes
   (/api/complete, /api/illustrate) locally, reading keys from .env.local.
   Mirrors api/*.ts; production still uses the real Vercel functions.
   No Blob token needed in dev — illustrate returns an inline data URL. */

const CLAUDE_MODEL = 'claude-haiku-4-5'
const IMAGE_MODEL = 'gemini-2.5-flash-image'
let devImagesGenerated = 0

const STYLE =
  "Bright, friendly children's storybook comic-panel illustration. Bold clean " +
  'outlines, flat cel shading, warm palette, soft cinematic lighting. A single ' +
  'comic panel. No text, no words, no speech bubbles, no captions, no watermark.'

const ANATOMY: Record<string, string> = {
  rocky:
    'Rocky is a gentle alien made of living stone, drawn EXACTLY like the attached ' +
    'reference image: one domed faceted rock carapace shell on top and EXACTLY FIVE ' +
    'straight jointed stone legs, each ending in three small triangular fingers. NO ' +
    'head, NO eyes, NO face, NO mouth, NOT a turtle. Grey and warm-brown stone with ' +
    'faint carved chevron markings.',
}

async function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = []
  for await (const c of req) chunks.push(c as Buffer)
  if (!chunks.length) return {}
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return {} }
}

function devApi() {
  return {
    name: 'dev-api',
    configureServer(server: { middlewares: { use: (fn: unknown) => void } }) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = (req.url || '').split('?')[0]
        if (req.method !== 'POST' || !url.startsWith('/api/')) return next()
        const body = await readBody(req)
        const send = (code: number, obj: unknown) => {
          res.statusCode = code
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(obj))
        }
        try {
          if (url === '/api/complete') {
            const key = process.env.ANTHROPIC_API_KEY
            if (!key) return send(500, { error: 'ANTHROPIC_API_KEY not set' })
            const r = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
              body: JSON.stringify({
                model: CLAUDE_MODEL,
                max_tokens: 1024,
                messages: (body.messages as unknown[]) ?? [{ role: 'user', content: body.prompt }],
              }),
            })
            const data = await r.json() as { content?: { text?: string }[] }
            if (!r.ok) return send(r.status, { error: JSON.stringify(data).slice(0, 400) })
            return send(200, { text: data?.content?.[0]?.text ?? '' })
          }
          if (url === '/api/illustrate') {
            const key = process.env.GEMINI_API_KEY
            if (!key) return send(500, { error: 'GEMINI_API_KEY not set' })
            const characterId = body.characterId as string | undefined
            const referenceUrl = body.referenceUrl as string | undefined
            const sceneRefUrl = body.sceneRefUrl as string | undefined
            const anatomy = (characterId && ANATOMY[characterId]) || ''
            const refNote = referenceUrl && sceneRefUrl
              ? ' Keep the character identical to the FIRST reference image; match the spaceship/workshop interior to the SECOND reference image.'
              : referenceUrl ? " Keep the character's anatomy identical to the reference image." : ''
            const fullPrompt = `${anatomy} Scene: ${body.prompt as string}.${refNote} ${STYLE}`
            const parts: unknown[] = [{ text: fullPrompt }]
            const pushRef = async (u: string) => {
              const rr = await fetch(u)
              if (!rr.ok) return
              const buf = Buffer.from(await rr.arrayBuffer())
              parts.push({ inlineData: { mimeType: rr.headers.get('content-type') || 'image/png', data: buf.toString('base64') } })
            }
            if (referenceUrl) await pushRef(referenceUrl)
            if (sceneRefUrl) await pushRef(sceneRefUrl)
            const gr = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent`, {
              method: 'POST',
              headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
              body: JSON.stringify({ contents: [{ parts }] }),
            })
            if (!gr.ok) return send(gr.status, { error: (await gr.text()).slice(0, 400) })
            const gj = await gr.json() as { candidates?: { content?: { parts?: Record<string, { data?: string; mimeType?: string; mime_type?: string }>[] } }[] }
            const found = (gj?.candidates?.[0]?.content?.parts || []).find((p) => (p.inlineData || p.inline_data)?.data)
            const inline = found && (found.inlineData || found.inline_data)
            if (!inline?.data) return send(502, { error: 'no image returned' })
            devImagesGenerated++
            console.log(`[illustrate] MISS char=${characterId || 'none'} | generated=${devImagesGenerated} ~$${(devImagesGenerated * 0.04).toFixed(2)}`)
            return send(200, { url: `data:${inline.mimeType || inline.mime_type || 'image/png'};base64,${inline.data}` })
          }
          return next()
        } catch (e) {
          return send(500, { error: String(e) })
        }
      })
    },
  }
}

// Read .env.local directly and OVERRIDE process.env for these keys. (The launching
// shell may pre-set an empty ANTHROPIC_API_KEY, which dotenv/loadEnv won't override.)
function loadLocalEnv() {
  const file = join(process.cwd(), '.env.local')
  if (!existsSync(file)) return
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

// https://vite.dev/config/
export default defineConfig(() => {
  loadLocalEnv()
  return { plugins: [react(), devApi()] }
})
