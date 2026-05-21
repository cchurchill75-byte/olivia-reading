import type { Token } from '../types';

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const regex = /([A-Za-z]+(?:[-'][A-Za-z]+)?)|(\s+)|([^A-Za-z\s]+)/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    if (m[1]) tokens.push({ kind: 'word', text: m[1] });
    else if (m[2]) tokens.push({ kind: 'space', text: m[2] });
    else if (m[3]) tokens.push({ kind: 'punct', text: m[3] });
  }
  return tokens;
}

export function syllabify(word: string): string {
  const w = word.toLowerCase();
  const matches = w.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/g);
  return matches ? matches.join(' \u2022 ') : word;
}
