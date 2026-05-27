// Client helper for the AI-illustrated panel pipeline.
// Only characters with a committed reference image under public/refs/ get
// illustrated panels; everyone else falls back to the SVG comic scenes.

const REFERENCES: Record<string, string> = {
  rocky: '/refs/rocky.png',
  bunniforous: '/refs/bunniforous.png',
  // mainecoon: '/refs/mainecoon.png',  // add as references are created
};

export function characterSupportsIllustration(id?: string | null): boolean {
  return !!(id && REFERENCES[id]);
}

// Recurring "set" references (environments), passed alongside the character.
const SCENE_REFERENCES = {
  ship: '/refs/spaceship.png', // Rocky's canonical workshop-spaceship interior
};

function absUrl(path: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return base + path;
}

function referenceUrlFor(id?: string | null): string | undefined {
  if (!id || !REFERENCES[id]) return undefined;
  return absUrl(REFERENCES[id]);
}

/** If a panel is set aboard Rocky's ship/workshop, return the ship scene reference URL. */
export function shipSceneRef(characterId: string | null | undefined, prompt: string, setting?: string): string | undefined {
  if (characterId !== 'rocky') return undefined;
  const txt = `${prompt} ${setting || ''}`.toLowerCase();
  if (/\b(ship|workshop|cockpit|cabin|space ?station|on ?board|aboard|control room|lab|engine room)\b/.test(txt)) {
    return absUrl(SCENE_REFERENCES.ship);
  }
  return undefined;
}

/** Generate (or fetch a cached) illustrated panel. Returns an image URL, or null on failure. */
export async function illustratePanel(
  characterId: string | null | undefined,
  prompt: string,
  sceneRefUrl?: string,
): Promise<string | null> {
  try {
    const r = await fetch('/api/illustrate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ characterId, referenceUrl: referenceUrlFor(characterId), sceneRefUrl, prompt }),
    });
    if (!r.ok) return null;
    const { url } = await r.json();
    return (url as string) || null;
  } catch {
    return null;
  }
}
