export function loadInt(key: string, fallback = 0): number {
  return parseInt(localStorage.getItem(key) || String(fallback), 10);
}

export function loadJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export function saveInt(key: string, value: number): void {
  localStorage.setItem(key, String(value));
}

export function saveJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}
