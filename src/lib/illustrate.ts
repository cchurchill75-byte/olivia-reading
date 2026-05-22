// Client helper for the AI-illustrated panel pipeline.
// Only characters with a committed reference image under public/refs/ get
// illustrated panels; everyone else falls back to the SVG comic scenes.

const REFERENCES: Record<string, string> = {
  rocky: '/refs/rocky.png',
  // mainecoon: '/refs/mainecoon.png',  // add as references are created
  // bunniforous: '/refs/bunniforous.png',
};

export function characterSupportsIllustration(id?: string | null): boolean {
  return !!(id && REFERENCES[id]);
}

function referenceUrlFor(id?: string | null): string | undefined {
  if (!id || !REFERENCES[id]) return undefined;
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return base + REFERENCES[id];
}

/** Generate (or fetch a cached) illustrated panel. Returns an image URL, or null on failure. */
export async function illustratePanel(characterId: string | null | undefined, prompt: string): Promise<string | null> {
  try {
    const r = await fetch('/api/illustrate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ characterId, referenceUrl: referenceUrlFor(characterId), prompt }),
    });
    if (!r.ok) return null;
    const { url } = await r.json();
    return (url as string) || null;
  } catch {
    return null;
  }
}
