import { useState, useEffect, useMemo } from 'react';

interface LoadingProps {
  characterId: string | null;
  message: string;
}

export default function Loading({ characterId, message }: LoadingProps) {
  const lines = useMemo(() => ([
    message || 'Mixing your story…',
    'Inking the panels…',
    'Drawing speed lines…',
    'Sprinkling sparkles…',
    'Asking the stars for ideas…',
  ]), [message]);

  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % lines.length), 1800);
    return () => clearInterval(t);
  }, [lines]);

  return (
    <div className="loading">
      <div className="speed-lines-bg"></div>
      <div className="orb"></div>
      <h2>{lines[i]}</h2>
      <p>Claude is writing this chapter — usually a few seconds.</p>
    </div>
  );
}
