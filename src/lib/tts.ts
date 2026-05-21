export function speakWord(text: string, onEnd?: () => void): void {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  u.pitch = 1.05;
  u.onend = () => onEnd?.();
  window.speechSynthesis.speak(u);
}
