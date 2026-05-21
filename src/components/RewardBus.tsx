import { useEffect } from 'react';

declare global {
  interface Window {
    __rewards?: {
      fly: (opts: { x: number; y: number; text: string; kind?: string }) => void;
      sfx: (text: string, kind?: string) => void;
      achievement: (icon: string, label: string, title: string) => void;
    };
  }
}

export default function RewardBus() {
  useEffect(() => {
    if (window.__rewards) return;

    const layer = document.createElement('div');
    layer.id = 'reward-layer';
    Object.assign(layer.style, {
      position: 'fixed',
      inset: '0',
      pointerEvents: 'none',
      zIndex: '200',
    });
    document.body.appendChild(layer);

    const fly = ({ x, y, text, kind = 'xp' }: { x: number; y: number; text: string; kind?: string }) => {
      const el = document.createElement('div');
      el.className = `reward-fly ${kind}`;
      el.textContent = text;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      layer.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    };

    const sfx = (text: string, kind = 'gold') => {
      const el = document.createElement('div');
      el.className = `sfx-burst ${kind}`;
      el.textContent = text;
      layer.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    };

    const achievement = (icon: string, label: string, title: string) => {
      const el = document.createElement('div');
      el.className = 'achievement';
      el.innerHTML = `<div class="ach-icon">${icon}</div><div class="ach-text"><div class="lbl">${label}</div><div class="title">${title}</div></div>`;
      layer.appendChild(el);
      setTimeout(() => el.remove(), 3300);
    };

    window.__rewards = { fly, sfx, achievement };
  }, []);

  return null;
}
