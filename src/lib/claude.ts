export async function claudeComplete(prompt: string): Promise<string> {
  const r = await fetch('/api/complete', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!r.ok) throw new Error(`complete failed: ${r.status}`);
  const { text } = await r.json();
  return text as string;
}
