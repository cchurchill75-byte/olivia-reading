import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list } from '@vercel/blob';

export const config = { maxDuration: 30 };

// Rough per-image cost for Gemini 2.5 Flash Image ("Nano Banana"). Override via env.
const RATE = Number(process.env.IMAGE_COST_USD || '0.04');

/**
 * Nano Banana usage = the generated panels stored in Vercel Blob. Each blob is
 * one paid image generation (cache hits create no blob), and carries an
 * uploadedAt timestamp — so grouping blobs by day gives spend per day.
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({ rate: RATE, totalCount: 0, totalCost: 0, days: [], note: 'No Blob store configured.' });
  }
  try {
    const counts: Record<string, number> = {};
    let total = 0;
    let cursor: string | undefined;
    let hasMore = true;
    while (hasMore) {
      const out = await list({ prefix: 'panels/', cursor, limit: 1000 });
      for (const b of out.blobs) {
        const key = new Date(b.uploadedAt).toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
        counts[key] = (counts[key] || 0) + 1;
        total++;
      }
      cursor = out.cursor;
      hasMore = out.hasMore;
    }
    const days = Object.entries(counts)
      .map(([date, count]) => ({ date, count, cost: +(count * RATE).toFixed(2) }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    return res.status(200).json({ rate: RATE, totalCount: total, totalCost: +(total * RATE).toFixed(2), days });
  } catch (err: unknown) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'usage failed' });
  }
}
