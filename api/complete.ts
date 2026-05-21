import type { VercelRequest, VercelResponse } from '@vercel/node';

const MODEL = 'claude-haiku-4-5';
const MAX_TOKENS = 1024;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { prompt, messages } = req.body ?? {};
  if (!prompt && !messages) return res.status(400).json({ error: 'prompt or messages required' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const body = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: messages ?? [{ role: 'user', content: prompt }],
  };

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: text });
    }
    const data = await r.json();
    const text = data?.content?.[0]?.text ?? '';
    return res.status(200).json({ text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return res.status(500).json({ error: message });
  }
}
