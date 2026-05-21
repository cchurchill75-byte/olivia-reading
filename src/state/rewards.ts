export const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000, 5000];

export function levelFromXp(xp: number): number {
  let lvl = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) lvl = i + 1;
  }
  return lvl;
}

export function xpProgress(xp: number) {
  const lvl = levelFromXp(xp);
  const base = LEVEL_THRESHOLDS[lvl - 1] || 0;
  const next = LEVEL_THRESHOLDS[lvl] || (base + 1000);
  return {
    lvl,
    pct: Math.min(100, Math.round(((xp - base) / (next - base)) * 100)),
    inLevel: xp - base,
    span: next - base,
  };
}
