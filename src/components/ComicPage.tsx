import { useMemo } from 'react';
import type { Chapter, ChapterPanel } from '../types';
import { RockyArt, MaineCoonArt, MangaDefs, getAllCharacters } from '../data/characters';
import { CustomHeroArt } from '../data/heroData';
import { characterSupportsIllustration } from '../lib/illustrate';

const SETTING_BG: Record<string, string> = {
  asteroid_field: 'bg-7', crystal_caves: 'bg-6', nebula_garden: 'bg-5',
  moon_meadow: 'bg-4', space_station: 'bg-8', icy_comet: 'bg-2',
  jelly_jungle: 'bg-4', thunder_world: 'bg-3', candy_planet: 'bg-5',
  deep_ocean: 'bg-9', star_train: 'bg-9', rainbow_reef: 'bg-2',
};

const CHAR_NAMES: Record<string, string> = {
  rocky: 'Rocky', mainecoon: 'Sir Biscuit', bunniforous: 'Bunniforous',
};

interface PanelSpec {
  kind: string;
  bg: string;
  scene: string;
  caption: string;
  bubble: { text: string; style?: string; pos?: string } | null;
  sfx: string | null;
  cover: { by?: string; row1: string; and?: string; row2?: string; sub?: string } | null;
}

export default function ComicPage({ chapter, characterId, setting, chapterIdx, totalChapters }: {
  chapter: Chapter; characterId: string; setting: string; chapterIdx: number; totalChapters: number;
}) {
  // Always call hooks in the same order regardless of render path.
  const panels = useMemo(
    () => buildPanelPlan(chapter, characterId, setting, chapterIdx, totalChapters),
    [chapter, characterId, setting, chapterIdx, totalChapters],
  );

  // Illustrated path: characters with a reference image get AI-drawn panels.
  const illPanels = (chapter.panels || []).filter((p) => p.imagePrompt);
  if (characterSupportsIllustration(characterId) && illPanels.length > 0) {
    return <IllustratedComic panels={illPanels} />;
  }

  const layoutCls = panels.length <= 4 ? 'comic-4' : panels.length === 5 ? 'comic-5' : 'comic-6';
  return (
    <div className={`manga-panels ${layoutCls}`}>
      {panels.map((p, i) => (
        <ComicPanel key={i} spec={p} characterId={characterId} setting={setting} />
      ))}
    </div>
  );
}

/* ---- Illustrated comic (AI-generated panels) ---- */
function IllustratedComic({ panels }: { panels: ChapterPanel[] }) {
  const cls = panels.length <= 2 ? 'comic-ill-2' : 'comic-ill-3';
  return (
    <div className={`manga-panels ${cls}`}>
      {panels.map((p, i) => (
        <div key={i} className="manga-panel ill">
          {p.imageUrl
            ? <img className="ill-img" src={p.imageUrl} alt={p.caption || ''} />
            : <div className="ill-blank"></div>}
          <div className="pn-halftone"></div>
          {p.caption ? <div className="cm-caption">{p.caption}</div> : null}
          {p.dialogue ? <PanelBubble bubble={{ text: p.dialogue }} /> : null}
        </div>
      ))}
    </div>
  );
}

function buildPanelPlan(chapter: Chapter, characterId: string, setting: string, idx: number, total: number): PanelSpec[] {
  const isFirst = idx === 0;
  const isLast = idx === total - 1;
  const settingBg = SETTING_BG[setting] || 'bg-7';

  let kinds: string[];
  if (isFirst) kinds = ['cover', 'setting', 'char-close', 'alert', 'action', 'detail'];
  else if (isLast) kinds = ['setting', 'char-close', 'action', 'dialog', 'ending'];
  else kinds = ['setting', 'char-close', 'action', 'dialog', 'alert', 'detail'];

  const fromClaude = Array.isArray(chapter.panels) ? chapter.panels : [];
  const count = Math.min(6, Math.max(4, fromClaude.length || kinds.length));
  kinds = kinds.slice(0, count);

  const map: Record<string, { bg: string; scene: string }> = {
    cover: { bg: 'bg-1', scene: 'cover' },
    setting: { bg: settingBg, scene: 'setting' },
    'char-close': { bg: 'bg-2', scene: 'char' },
    dialog: { bg: 'bg-4', scene: 'char' },
    action: { bg: 'bg-5', scene: 'action' },
    alert: { bg: 'bg-3', scene: 'alert' },
    detail: { bg: 'bg-6', scene: 'detail' },
    ending: { bg: 'bg-9', scene: 'ending' },
  };

  return kinds.map((kind, i) => {
    const base = map[kind] || { bg: 'bg-1', scene: 'setting' };
    const claudePanel = fromClaude[i] || {};
    return {
      kind,
      bg: claudePanel.bg || base.bg,
      scene: base.scene,
      caption: claudePanel.caption || defaultCaption(kind, idx),
      bubble: claudePanel.bubble || defaultBubble(kind, idx, characterId),
      sfx: claudePanel.sfx || defaultSfx(kind),
      cover: kind === 'cover' ? buildCover(characterId, chapter, idx, total) :
             kind === 'ending' ? { row1: 'THE END', and: isLast ? 'to be continued!' : 'next page →' } : null,
    };
  });
}

function buildCover(characterId: string, chapter: Chapter, idx: number, total: number) {
  const name = CHAR_NAMES[characterId] || 'Our Hero';
  const t = (chapter.title || 'Adventure').toString();
  const chapWord = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'][idx] || `${idx + 1}`;
  return { by: 'By Olivia', row1: name.toUpperCase(), and: '—  in  —', row2: t.toUpperCase(), sub: `Chapter ${chapWord} of ${total}` };
}

function defaultCaption(kind: string, idx: number): string {
  if (kind === 'setting') {
    if (idx === 0) return 'Meanwhile, in deep space…';
    return ['Later…', 'A few moments later…', 'Up ahead…', 'Soon…'][idx % 4];
  }
  if (kind === 'detail') return 'Look at THAT.';
  return '';
}

function defaultBubble(kind: string, idx: number, characterId: string) {
  if (kind === 'char-close') {
    if (characterId === 'rocky') return { text: '♪ click-CLICK ♪', style: 'thought' };
    if (idx === 0) return { text: 'Hmm?', style: 'thought' };
    return { text: 'Hold on…', style: '' };
  }
  if (kind === 'dialog') {
    if (characterId === 'rocky') return { text: '♪ ding-ding ♪', style: 'thought' };
    return { text: "Let's GO!", style: '' };
  }
  if (kind === 'action' && idx === 0) return { text: 'Here we GO!', style: 'yell' };
  return null;
}

function defaultSfx(kind: string): string | null {
  if (kind === 'alert') return 'BWEEP!';
  if (kind === 'action') return ['DASH!', 'WHIZ!', 'ZOOM!', 'DOSH!'][Math.floor(Math.random() * 4)];
  if (kind === 'detail') return ['TWINK', 'SHINE', 'GLEAM'][Math.floor(Math.random() * 3)];
  return null;
}

/* ---- ComicPanel ---- */
function ComicPanel({ spec, characterId, setting }: { spec: PanelSpec; characterId: string; setting: string }) {
  return (
    <div className={`manga-panel ${spec.bg || 'bg-1'}`}>
      <PanelScene scene={spec.scene} characterId={characterId} setting={setting} cover={spec.cover} />
      <div className="pn-halftone"></div>
      {spec.caption ? <div className={`cm-caption ${spec.cover ? 'br' : ''}`}>{spec.caption}</div> : null}
      {spec.bubble ? <PanelBubble bubble={spec.bubble} /> : null}
      {spec.sfx ? <PanelSfx text={spec.sfx} /> : null}
    </div>
  );
}

function PanelBubble({ bubble }: { bubble: { text: string; style?: string; pos?: string } }) {
  const cls = `cm-bubble ${bubble.pos || 'tr'} ${bubble.style || ''}`;
  const speak = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(bubble.text.replace(/[^\w\s,.!?'\u2014\-]/g, ''));
      u.rate = 0.9; u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  };
  if (bubble.style === 'yell') {
    return <div className={cls} onClick={speak} role="button" aria-label={bubble.text}><span className="yell-bg">{bubble.text}</span></div>;
  }
  return <div className={cls} onClick={speak} role="button" aria-label={bubble.text}><span className="tail"></span>{bubble.text}</div>;
}

function PanelSfx({ text }: { text: string }) {
  const seed = text.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const xPct = 20 + (seed % 35);
  const yPct = 30 + (seed % 40);
  const rot = (seed % 2 === 0 ? -1 : 1) * (4 + (seed % 8));
  return <div className="cm-sfx" style={{ left: xPct + '%', top: yPct + '%', transform: `rotate(${rot}deg)` }}>{text}</div>;
}

/* ---- Panel Scenes ---- */
function PanelScene({ scene, characterId, setting, cover }: { scene: string; characterId: string; setting: string; cover: PanelSpec['cover'] }) {
  if (scene === 'cover' && cover) return <CoverScene cover={cover} characterId={characterId} />;
  if (scene === 'ending' && cover) return <EndingScene cover={cover} />;
  if (scene === 'setting') return <SettingScene setting={setting} />;
  if (scene === 'char') return <CharacterScene characterId={characterId} />;
  if (scene === 'action') return <ActionScene characterId={characterId} />;
  if (scene === 'alert') return <AlertScene />;
  if (scene === 'detail') return <DetailScene setting={setting} />;
  return null;
}

function CoverScene({ cover, characterId }: { cover: NonNullable<PanelSpec['cover']>; characterId: string }) {
  return (
    <div className="panel-scene" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg className="cm-burst" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
        <defs><pattern id="cv-dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.2" fill="#1a1410" opacity="0.4" /></pattern></defs>
        <g transform="translate(200 140)">
          {Array.from({ length: 20 }).map((_, i) => {
            const a = (i / 20) * Math.PI * 2;
            return <polygon key={i} points={`${Math.cos(a) * 30},${Math.sin(a) * 30} ${Math.cos(a + 0.04) * 280},${Math.sin(a + 0.04) * 280} ${Math.cos(a - 0.04) * 280},${Math.sin(a - 0.04) * 280}`} fill={i % 2 ? '#ff6b4a' : '#ffd84d'} opacity="0.85" />;
          })}
        </g>
        <rect width="400" height="280" fill="url(#cv-dots)" opacity="0.12" />
      </svg>
      <div className="cm-cover">
        <div className="by">{cover.by}</div>
        <div className="big-title">
          <span className="row">{cover.row1}</span>
          {cover.and ? <span className="and">{cover.and}</span> : null}
          {cover.row2 ? <span className="row alt">{cover.row2}</span> : null}
        </div>
        {cover.sub ? <div className="sub">{cover.sub}</div> : null}
      </div>
      <div style={{ position: 'absolute', right: 6, bottom: 6, width: 90, height: 90, borderRadius: 8, overflow: 'hidden', border: '3px solid #1a1410', boxShadow: '2px 2px 0 #1a1410', background: '#fffaef', zIndex: 3 }}>
        <CharacterPortrait characterId={characterId} />
      </div>
    </div>
  );
}

function EndingScene({ cover }: { cover: NonNullable<PanelSpec['cover']> }) {
  return (
    <div className="panel-scene" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <rect width="400" height="280" fill="#2a2440" />
        <g fill="#ffd84d">
          <circle cx="40" cy="40" r="1.5" /><circle cx="120" cy="80" r="2" /><circle cx="220" cy="50" r="1.8" />
          <circle cx="320" cy="40" r="2" /><circle cx="380" cy="120" r="1.6" />
          <path d="M 140 130 L 144 142 L 156 146 L 144 150 L 140 162 L 136 150 L 124 146 L 136 142 Z" />
          <path d="M 290 100 L 294 112 L 306 116 L 294 120 L 290 132 L 286 120 L 274 116 L 286 112 Z" />
        </g>
      </svg>
      <div className="cm-cover">
        <div className="big-title">
          <span className="row">{cover.row1}</span>
          {cover.and ? <span className="and">{cover.and}</span> : null}
        </div>
      </div>
    </div>
  );
}

function SettingScene({ setting }: { setting: string }) {
  return (
    <div className="panel-scene">
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <SettingArt setting={setting} />
      </svg>
    </div>
  );
}

function SettingArt({ setting }: { setting: string }) {
  const INK = '#1a1410';
  switch (setting) {
    case 'asteroid_field':
      return (<g><circle cx="120" cy="160" r="58" fill="#8a6745" stroke={INK} strokeWidth="4" /><circle cx="290" cy="80" r="36" fill="#a07852" stroke={INK} strokeWidth="4" /><circle cx="340" cy="200" r="26" fill="#7a5a3e" stroke={INK} strokeWidth="3.5" /></g>);
    case 'crystal_caves':
      return (<g><polygon points="40,280 110,80 180,280" fill="#fffaef" stroke={INK} strokeWidth="4" /><polygon points="240,280 320,40 400,280" fill="#fffaef" stroke={INK} strokeWidth="4" /><line x1="110" y1="80" x2="110" y2="280" stroke={INK} strokeWidth="2" /><line x1="320" y1="40" x2="320" y2="280" stroke={INK} strokeWidth="2" /></g>);
    case 'nebula_garden':
      return (<g><ellipse cx="120" cy="110" rx="80" ry="48" fill="#fffaef" stroke={INK} strokeWidth="4" /><ellipse cx="290" cy="80" rx="90" ry="42" fill="#fffaef" stroke={INK} strokeWidth="4" /><ellipse cx="210" cy="210" rx="120" ry="48" fill="#fffaef" stroke={INK} strokeWidth="4" /></g>);
    case 'moon_meadow':
      return (<g><circle cx="310" cy="80" r="50" fill="#fffaef" stroke={INK} strokeWidth="4" /><circle cx="100" cy="50" r="28" fill="#fffaef" stroke={INK} strokeWidth="4" /></g>);
    case 'space_station':
      return (<g><rect x="160" y="100" width="100" height="50" fill="#fffaef" stroke={INK} strokeWidth="4" /><circle cx="210" cy="125" r="10" fill={INK} /><rect x="60" y="115" width="100" height="18" fill="#fffaef" stroke={INK} strokeWidth="4" /><rect x="260" y="115" width="100" height="18" fill="#fffaef" stroke={INK} strokeWidth="4" /></g>);
    case 'icy_comet':
      return (<g><ellipse cx="120" cy="140" rx="58" ry="42" fill="#fffaef" stroke={INK} strokeWidth="4" /><g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none"><path d="M178,140 Q260,150 380,180" /><path d="M178,160 Q260,180 380,220" strokeWidth="3.5" /></g></g>);
    default:
      return (<g><circle cx="200" cy="140" r="60" fill="#fffaef" stroke={INK} strokeWidth="4" /><g fill={INK}><circle cx="60" cy="60" r="2" /><circle cx="340" cy="50" r="2" /></g></g>);
  }
}

function CharacterPortrait({ characterId }: { characterId: string }) {
  const heroes = getAllCharacters();
  const hero = heroes.find((h) => h.id === characterId);
  if (hero?.art === 'custom') return <CustomHeroArt hero={hero} withFx={false} />;
  if (characterId === 'rocky') return <RockyArt pose="portrait" />;
  if (characterId === 'mainecoon') return <MaineCoonArt pose="portrait" />;
  if (characterId === 'bunniforous') {
    return <img src="/assets/bunniforous-1.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.18) saturate(0.85)' }} />;
  }
  return null;
}

function CharacterScene({ characterId }: { characterId: string }) {
  const heroes = getAllCharacters();
  const hero = heroes.find((h) => h.id === characterId);
  if (hero?.art === 'custom') return <div className="panel-scene" style={{ position: 'absolute', inset: 0 }}><CustomHeroArt hero={hero} withFx={false} /></div>;
  if (characterId === 'rocky') return <div className="panel-scene" style={{ position: 'absolute', inset: 0 }}><RockyArt pose="portrait" /></div>;
  if (characterId === 'mainecoon') return <div className="panel-scene" style={{ position: 'absolute', inset: 0 }}><MaineCoonArt pose="portrait" /></div>;
  return (
    <div className="panel-scene" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <img src="/assets/bunniforous-2.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.18) saturate(0.85) brightness(1.02)', mixBlendMode: 'multiply' }} />
    </div>
  );
}

function ActionScene({ characterId }: { characterId: string }) {
  return (
    <div className="panel-scene" style={{ position: 'absolute', inset: 0 }}>
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g opacity="0.55" stroke="#1a1410" fill="none" strokeWidth="2.5">
          <path d="M 0 30 L 130 60" /><path d="M 0 130 L 130 130" /><path d="M 0 230 L 130 205" />
          <path d="M 400 30 L 270 60" /><path d="M 400 130 L 270 130" /><path d="M 400 230 L 270 205" />
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: '10% 25%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 50, overflow: 'hidden' }}>
          <CharacterPortrait characterId={characterId} />
        </div>
      </div>
    </div>
  );
}

function AlertScene() {
  return (
    <div className="panel-scene" style={{ position: 'absolute', inset: 0 }}>
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <rect width="400" height="280" fill="#ff6b4a" />
        <g opacity="0.7" stroke="#1a1410" strokeWidth="2.2">
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return <line key={i} x1={200 + Math.cos(a) * 30} y1={140 + Math.sin(a) * 30} x2={200 + Math.cos(a) * 300} y2={140 + Math.sin(a) * 280} />;
          })}
        </g>
        <circle cx="200" cy="140" r="44" fill="#ffd84d" stroke="#1a1410" strokeWidth="5" />
        <text x="200" y="160" textAnchor="middle" fontFamily="Bowlby One, Bangers, Impact" fontSize="56" fill="#1a1410">!</text>
      </svg>
    </div>
  );
}

function DetailScene({ setting }: { setting: string }) {
  const items: Record<string, string> = {
    asteroid_field: '💎', crystal_caves: '✨', nebula_garden: '🌸', moon_meadow: '🌕',
    space_station: '🛰️', icy_comet: '❄️', jelly_jungle: '🌿', thunder_world: '⚡',
    candy_planet: '🍭', deep_ocean: '🐠', star_train: '🚂', rainbow_reef: '🪸',
  };
  const glyph = items[setting] || '✨';
  return (
    <div className="panel-scene" style={{ position: 'absolute', inset: 0 }}>
      <svg viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g opacity="0.6" stroke="#1a1410" strokeWidth="2" fill="none">
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <line key={i} x1={200 + Math.cos(a) * 50} y1={140 + Math.sin(a) * 50} x2={200 + Math.cos(a) * 300} y2={140 + Math.sin(a) * 240} />;
          })}
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110, filter: 'drop-shadow(3px 3px 0 #1a1410)' }}>
        {glyph}
      </div>
    </div>
  );
}
