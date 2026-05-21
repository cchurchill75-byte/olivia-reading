import { useState, useMemo } from 'react';
import { MangaDefs } from './characters';
import type { Character } from '../types';

/* =============================================================
   HERO STYLE CATALOG
============================================================= */
export const HERO_PALETTES = [
  { id: 'amber', body: '#e89556', accent: '#7a2a1f', name: 'Amber' },
  { id: 'mint', body: '#7dc99e', accent: '#1f5a3a', name: 'Mint' },
  { id: 'sky', body: '#7db8e8', accent: '#1f3a7a', name: 'Sky' },
  { id: 'rose', body: '#e89db5', accent: '#7a1f4a', name: 'Rose' },
  { id: 'lilac', body: '#b07de8', accent: '#3a1f7a', name: 'Lilac' },
  { id: 'sun', body: '#ffd66b', accent: '#7a5a1f', name: 'Sun' },
  { id: 'moss', body: '#9fae5a', accent: '#3d4520', name: 'Moss' },
  { id: 'cocoa', body: '#a07854', accent: '#3d2515', name: 'Cocoa' },
];

export const HERO_ACCENTS = [
  { id: 'gold', glow: '#ffd66b' },
  { id: 'red', glow: '#ff7a4a' },
  { id: 'cyan', glow: '#7df5e8' },
  { id: 'green', glow: '#7df57a' },
  { id: 'pink', glow: '#ff8fc4' },
  { id: 'blue', glow: '#8fa8ff' },
];

export const HERO_SHAPES_LIST = [
  { id: 'buddy', label: 'Buddy', hint: 'Like a person' },
  { id: 'bunny', label: 'Bunny', hint: 'Long ears, fluffy' },
  { id: 'kitten', label: 'Kitten', hint: 'Pointy ears, tail' },
  { id: 'pup', label: 'Pup', hint: 'Floppy ears, waggy' },
  { id: 'birdy', label: 'Birdy', hint: 'Wings, beak, hops' },
  { id: 'dragonling', label: 'Dragonling', hint: 'Tiny but mighty' },
];

export const HERO_EYE_STYLES = [
  { id: 'round', label: 'Round' },
  { id: 'sleepy', label: 'Sleepy' },
  { id: 'sparkly', label: 'Sparkly' },
];

export const HERO_TRAITS_LIST = [
  'Brave', 'Kind', 'Silly', 'Sneaky', 'Strong', 'Smart',
  'Fast', 'Curious', 'Loyal', 'Mighty', 'Tiny', 'Glowy',
  'Fluffy', 'Spiky', 'Bouncy', 'Wise',
];

/* =============================================================
   Persistence
============================================================= */
export function loadHeroes(): Character[] {
  try { return JSON.parse(localStorage.getItem('olivia.customHeroes') || '[]'); }
  catch { return []; }
}

export function saveHero(hero: Character): Character[] {
  const heroes = loadHeroes();
  const idx = heroes.findIndex((h) => h.id === hero.id);
  if (idx >= 0) heroes[idx] = hero;
  else heroes.push(hero);
  localStorage.setItem('olivia.customHeroes', JSON.stringify(heroes));
  return heroes;
}

export function deleteHero(id: string): Character[] {
  const heroes = loadHeroes().filter((h) => h.id !== id);
  localStorage.setItem('olivia.customHeroes', JSON.stringify(heroes));
  return heroes;
}

/* =============================================================
   Eye helper
============================================================= */
interface Palette { body: string; accent: string }
interface Accent { glow: string }

function HeroEyes({ cx, cy, gap = 50, size = 14, style = 'round' }: { cx: number; cy: number; gap?: number; size?: number; style?: string }) {
  const lx = cx - gap / 2;
  const rx = cx + gap / 2;
  if (style === 'sleepy') {
    return (
      <g stroke="#0c0a14" strokeWidth={Math.max(3, size / 3)} fill="none" strokeLinecap="round">
        <path d={`M${lx - size},${cy} Q${lx},${cy + size * 0.7} ${lx + size},${cy}`} />
        <path d={`M${rx - size},${cy} Q${rx},${cy + size * 0.7} ${rx + size},${cy}`} />
      </g>
    );
  }
  if (style === 'sparkly') {
    return (
      <g fill="#0c0a14">
        <path d={`M${lx},${cy - size} L${lx + size * 0.45},${cy} L${lx},${cy + size} L${lx - size * 0.45},${cy} Z`} />
        <path d={`M${rx},${cy - size} L${rx + size * 0.45},${cy} L${rx},${cy + size} L${rx - size * 0.45},${cy} Z`} />
        <circle cx={lx - size * 0.18} cy={cy - size * 0.32} r={size * 0.22} fill="#fff" />
        <circle cx={rx - size * 0.18} cy={cy - size * 0.32} r={size * 0.22} fill="#fff" />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx={lx} cy={cy} rx={size * 0.55} ry={size * 0.95} fill="#0c0a14" />
      <ellipse cx={rx} cy={cy} rx={size * 0.55} ry={size * 0.95} fill="#0c0a14" />
      <circle cx={lx + size * 0.22} cy={cy - size * 0.4} r={size * 0.28} fill="#fff" />
      <circle cx={rx + size * 0.22} cy={cy - size * 0.4} r={size * 0.28} fill="#fff" />
    </g>
  );
}

/* =============================================================
   Shape components
============================================================= */
function BuddyHero({ palette, accent, eyes }: { palette: Palette; accent: Accent; eyes: string }) {
  return (
    <g>
      <ellipse cx="172" cy="358" rx="20" ry="32" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <ellipse cx="228" cy="358" rx="20" ry="32" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <ellipse cx="172" cy="385" rx="24" ry="11" fill={palette.accent} stroke="#0c0a14" strokeWidth="4" />
      <ellipse cx="228" cy="385" rx="24" ry="11" fill={palette.accent} stroke="#0c0a14" strokeWidth="4" />
      <path d="M138,210 Q108,250 118,300" stroke={palette.body} strokeWidth="32" fill="none" strokeLinecap="round" />
      <path d="M138,210 Q108,250 118,300" stroke="#0c0a14" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M262,210 Q292,250 282,300" stroke={palette.body} strokeWidth="32" fill="none" strokeLinecap="round" />
      <path d="M262,210 Q292,250 282,300" stroke="#0c0a14" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <circle cx="118" cy="305" r="18" fill={palette.body} stroke="#0c0a14" strokeWidth="4" />
      <circle cx="282" cy="305" r="18" fill={palette.body} stroke="#0c0a14" strokeWidth="4" />
      <path d="M150,210 Q150,330 200,335 Q250,330 250,210 L210,200 L190,200 Z" fill={palette.body} stroke="#0c0a14" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="200" cy="155" r="68" fill={palette.body} stroke="#0c0a14" strokeWidth="5" />
      <path d="M152,108 Q170,72 192,86 Q200,76 210,86 Q230,72 248,108 Q232,122 200,122 Q168,122 152,108 Z" fill={palette.accent} stroke="#0c0a14" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="158" cy="172" r="11" fill={accent.glow} opacity="0.6" />
      <circle cx="242" cy="172" r="11" fill={accent.glow} opacity="0.6" />
      <HeroEyes cx={200} cy={150} gap={42} size={13} style={eyes} />
      <path d="M184,182 Q200,196 216,182" stroke="#0c0a14" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g className="rk-crystal" transform="translate(200,265)">
        <path d="M0,12 Q-16,-2 -10,-14 Q-2,-15 0,-6 Q2,-15 10,-14 Q16,-2 0,12 Z" fill={accent.glow} stroke="#0c0a14" strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    </g>
  );
}

function BunnyHero({ palette, accent, eyes }: { palette: Palette; accent: Accent; eyes: string }) {
  return (
    <g>
      <ellipse cx="158" cy="376" rx="32" ry="16" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <ellipse cx="242" cy="376" rx="32" ry="16" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <ellipse cx="200" cy="305" rx="92" ry="70" fill={palette.body} stroke="#0c0a14" strokeWidth="5" />
      <circle cx="288" cy="320" r="16" fill={palette.body} stroke="#0c0a14" strokeWidth="3.5" />
      <ellipse cx="200" cy="215" rx="80" ry="68" fill={palette.body} stroke="#0c0a14" strokeWidth="5" />
      <ellipse cx="170" cy="105" rx="19" ry="58" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <ellipse cx="170" cy="115" rx="9" ry="42" fill={accent.glow} opacity="0.55" />
      <ellipse cx="230" cy="105" rx="19" ry="58" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <ellipse cx="230" cy="115" rx="9" ry="42" fill={accent.glow} opacity="0.55" />
      <circle cx="156" cy="230" r="11" fill={accent.glow} opacity="0.55" />
      <circle cx="244" cy="230" r="11" fill={accent.glow} opacity="0.55" />
      <HeroEyes cx={200} cy={205} gap={50} size={14} style={eyes} />
      <path d="M193,233 L207,233 L200,242 Z" fill="#0c0a14" />
      <path d="M200,242 Q190,256 184,250" stroke="#0c0a14" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M200,242 Q210,256 216,250" stroke="#0c0a14" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function KittenHero({ palette, accent, eyes }: { palette: Palette; accent: Accent; eyes: string }) {
  return (
    <g>
      <path d="M285,305 Q335,275 320,225 Q314,215 304,222" stroke={palette.body} strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d="M285,305 Q335,275 320,225 Q314,215 304,222" stroke="#0c0a14" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="165" cy="376" rx="28" ry="15" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <ellipse cx="235" cy="376" rx="28" ry="15" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <ellipse cx="200" cy="305" rx="92" ry="70" fill={palette.body} stroke="#0c0a14" strokeWidth="5" />
      <ellipse cx="200" cy="215" rx="82" ry="72" fill={palette.body} stroke="#0c0a14" strokeWidth="5" />
      <path d="M138,170 L130,98 L188,148 Z" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M150,150 L142,118 L178,143 Z" fill={accent.glow} opacity="0.6" />
      <path d="M262,170 L270,98 L212,148 Z" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M250,150 L258,118 L222,143 Z" fill={accent.glow} opacity="0.6" />
      <HeroEyes cx={200} cy={210} gap={52} size={14} style={eyes} />
      <path d="M193,242 L207,242 L200,252 Z" fill="#0c0a14" />
      <path d="M200,252 Q192,264 186,259" stroke="#0c0a14" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M200,252 Q208,264 214,259" stroke="#0c0a14" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function PupHero({ palette, accent, eyes }: { palette: Palette; accent: Accent; eyes: string }) {
  return (
    <g>
      <path d="M290,295 Q340,275 332,250" stroke={palette.body} strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d="M290,295 Q340,275 332,250" stroke="#0c0a14" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="162" cy="376" rx="30" ry="16" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <ellipse cx="238" cy="376" rx="30" ry="16" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <ellipse cx="200" cy="305" rx="94" ry="70" fill={palette.body} stroke="#0c0a14" strokeWidth="5" />
      <ellipse cx="200" cy="205" rx="80" ry="76" fill={palette.body} stroke="#0c0a14" strokeWidth="5" />
      <ellipse cx="130" cy="210" rx="24" ry="56" fill={palette.accent} stroke="#0c0a14" strokeWidth="4.5" transform="rotate(-18 130 210)" />
      <ellipse cx="270" cy="210" rx="24" ry="56" fill={palette.accent} stroke="#0c0a14" strokeWidth="4.5" transform="rotate(18 270 210)" />
      <ellipse cx="200" cy="240" rx="44" ry="30" fill={palette.body} stroke="#0c0a14" strokeWidth="4" />
      <HeroEyes cx={200} cy={188} gap={48} size={13} style={eyes} />
      <ellipse cx="200" cy="228" rx="11" ry="8" fill="#0c0a14" />
      <path d="M200,238 Q186,260 178,250" stroke="#0c0a14" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M200,238 Q214,260 222,250" stroke="#0c0a14" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function BirdyHero({ palette, accent, eyes }: { palette: Palette; accent: Accent; eyes: string }) {
  return (
    <g>
      <line x1="180" y1="350" x2="180" y2="385" stroke="#0c0a14" strokeWidth="6" strokeLinecap="round" />
      <line x1="220" y1="350" x2="220" y2="385" stroke="#0c0a14" strokeWidth="6" strokeLinecap="round" />
      <path d="M255,310 Q310,295 318,335 Q300,338 280,335 Z" fill={palette.accent} stroke="#0c0a14" strokeWidth="4" strokeLinejoin="round" />
      <path d="M200,80 Q120,140 130,300 Q150,360 200,360 Q250,360 270,300 Q280,140 200,80 Z" fill={palette.body} stroke="#0c0a14" strokeWidth="5" strokeLinejoin="round" />
      <path d="M158,200 Q132,250 162,308 Q200,300 200,235 Q188,205 158,200 Z" fill={palette.accent} stroke="#0c0a14" strokeWidth="4.5" strokeLinejoin="round" />
      <HeroEyes cx={200} cy={152} gap={42} size={13} style={eyes} />
      <path d="M190,178 L210,178 L200,202 Z" fill={accent.glow} stroke="#0c0a14" strokeWidth="3" strokeLinejoin="round" />
      <path d="M183,85 Q193,55 200,78 Q207,55 217,85" stroke="#0c0a14" strokeWidth="4" fill={palette.accent} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function DragonlingHero({ palette, accent, eyes }: { palette: Palette; accent: Accent; eyes: string }) {
  return (
    <g>
      <path d="M252,328 Q316,340 320,288 Q322,262 308,256" stroke={palette.body} strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d="M252,328 Q316,340 320,288 Q322,262 308,256" stroke="#0c0a14" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M315,266 L330,248 L304,254 Z" fill={accent.glow} stroke="#0c0a14" strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="160" cy="370" rx="30" ry="16" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <ellipse cx="240" cy="370" rx="30" ry="16" fill={palette.body} stroke="#0c0a14" strokeWidth="4.5" />
      <path d="M150,260 Q88,194 96,278 Q120,278 152,265 Z" fill={accent.glow} stroke="#0c0a14" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M250,260 Q312,194 304,278 Q280,278 248,265 Z" fill={accent.glow} stroke="#0c0a14" strokeWidth="4.5" strokeLinejoin="round" />
      <ellipse cx="200" cy="305" rx="86" ry="66" fill={palette.body} stroke="#0c0a14" strokeWidth="5" />
      <ellipse cx="200" cy="212" rx="66" ry="56" fill={palette.body} stroke="#0c0a14" strokeWidth="5" />
      <ellipse cx="200" cy="244" rx="42" ry="22" fill={palette.body} stroke="#0c0a14" strokeWidth="4" />
      <path d="M168,170 L156,136 L184,166 Z" fill={palette.accent} stroke="#0c0a14" strokeWidth="4" strokeLinejoin="round" />
      <path d="M232,170 L244,136 L216,166 Z" fill={palette.accent} stroke="#0c0a14" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="192" cy="244" r="3" fill="#0c0a14" />
      <circle cx="208" cy="244" r="3" fill="#0c0a14" />
      <HeroEyes cx={200} cy={207} gap={42} size={12} style={eyes} />
      <path d="M186,253 Q200,260 214,253" stroke="#0c0a14" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SHAPE_COMPS: Record<string, React.FC<any>> = {
  buddy: BuddyHero, bunny: BunnyHero, kitten: KittenHero,
  pup: PupHero, birdy: BirdyHero, dragonling: DragonlingHero,
};

/* =============================================================
   CustomHeroArt
============================================================= */
export function CustomHeroArt({ hero, withFx = true }: { hero: Character; withFx?: boolean }) {
  const palette = HERO_PALETTES.find((p) => p.id === hero.bodyPalette) || HERO_PALETTES[0];
  const accent = HERO_ACCENTS.find((a) => a.id === hero.accentPalette) || HERO_ACCENTS[0];
  const eyes = hero.eyes || 'round';
  const Comp = SHAPE_COMPS[hero.shape || 'buddy'] || BuddyHero;

  return (
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
      <MangaDefs />
      <rect width="400" height="400" fill="url(#halftoneMd)" opacity="0.30" />
      {withFx && (
        <g opacity="0.5" className="spd-rot-slow" style={{ transformOrigin: '200px 230px' }}>
          {Array.from({ length: 22 }).map((_, i) => {
            const a = (i / 22) * Math.PI * 2;
            return <line key={i} x1={200 + Math.cos(a) * 150} y1={230 + Math.sin(a) * 150} x2={200 + Math.cos(a) * 240} y2={230 + Math.sin(a) * 240} stroke="#0c0a14" strokeWidth="1.4" />;
          })}
        </g>
      )}
      <ellipse cx="200" cy="380" rx="150" ry="12" fill="#0c0a14" opacity="0.28" />
      <g className="rk-bob">
        <Comp palette={palette} accent={accent} eyes={eyes} />
      </g>
    </svg>
  );
}

/* =============================================================
   Default hero factory
============================================================= */
function makeDefaultHero(): Character {
  return {
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: '',
    pronounce: '',
    shape: 'buddy',
    bodyPalette: 'amber',
    accentPalette: 'gold',
    eyes: 'round',
    traits: [],
    tagline: '',
    art: 'custom',
  };
}

function pickRandom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const HERO_EXAMPLES = [
  'A shy cloud who can talk to shooting stars',
  'A spiky red crystal that loves to tell jokes',
  'A bouncy mint pebble who\'s the fastest in the galaxy',
  'A wise old star that has met every alien in space',
  'A sleepy purple blob with a giant heart',
  'A glowy yellow hero who\'s scared of the dark but does it anyway',
];

/* =============================================================
   HeroBuilder
============================================================= */
interface HeroBuilderProps {
  existing: Character | null;
  onSave: (hero: Character) => void;
  onCancel: () => void;
  claudeCall: ((prompt: string, schema: string) => Promise<Record<string, unknown> | null>) | null;
}

export function HeroBuilder({ existing, onSave, onCancel, claudeCall }: HeroBuilderProps) {
  const [phase, setPhase] = useState(existing ? 'build' : 'describe');
  const [hero, setHero] = useState<Character>(() => existing ? { ...existing } : makeDefaultHero());
  const [describeText, setDescribeText] = useState('');
  const [busy, setBusy] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const set = (k: string, v: unknown) => setHero((h) => ({ ...h, [k]: v }));

  const toggleTrait = (t: string) => {
    setHero((h) => {
      if (h.traits.includes(t)) return { ...h, traits: h.traits.filter((x) => x !== t) };
      if (h.traits.length >= 3) return h;
      return { ...h, traits: [...h.traits, t] };
    });
  };

  const generateFromDescription = async () => {
    const text = describeText.trim();
    if (!text) return;
    setGenError(null);

    if (!claudeCall) {
      const lc = text.toLowerCase();
      const guess: Partial<Character> = {
        shape: lc.includes('bunny') ? 'bunny' : lc.includes('cat') || lc.includes('kitten') ? 'kitten' : lc.includes('dog') || lc.includes('pup') ? 'pup' : lc.includes('bird') ? 'birdy' : lc.includes('dragon') ? 'dragonling' : 'buddy',
        bodyPalette: lc.includes('mint') || lc.includes('green') ? 'mint' : lc.includes('blue') ? 'sky' : lc.includes('pink') ? 'rose' : lc.includes('purple') ? 'lilac' : lc.includes('yellow') ? 'sun' : 'amber',
        accentPalette: 'gold',
        eyes: lc.includes('sleepy') ? 'sleepy' : lc.includes('sparkly') ? 'sparkly' : 'round',
        traits: ['Brave', 'Kind'],
        name: 'Hero',
        tagline: text,
      };
      setHero((h) => ({ ...h, ...guess }));
      setPhase('build');
      return;
    }

    setBusy(true);
    try {
      const prompt = `The user wants to create a custom hero for a kid's space adventure reading game. Based on their description, choose values for each field.

DESCRIPTION: "${text}"

FIELD CHOICES:
- shape: "buddy"|"bunny"|"kitten"|"pup"|"birdy"|"dragonling"
- bodyPalette: "amber"|"mint"|"sky"|"rose"|"lilac"|"sun"|"moss"|"cocoa"
- accentPalette: "gold"|"red"|"cyan"|"green"|"pink"|"blue"
- eyes: "round"|"sleepy"|"sparkly"
- traits: pick 2-3 from: ${HERO_TRAITS_LIST.join(', ')}
- name: fun name (1-2 words, max 18 chars)
- pronounce: optional pronunciation hint
- tagline: ONE warm sentence (15-25 words) for a 10-year-old reader`;

      const schema = `{"name":"...","pronounce":"...","shape":"...","bodyPalette":"...","accentPalette":"...","eyes":"...","traits":["..."],"tagline":"..."}`;
      const result = await claudeCall(prompt, schema);
      if (!result || !result.name) throw new Error('No result');

      setHero((h) => ({
        ...h,
        name: String(result.name || '').slice(0, 20),
        pronounce: String(result.pronounce || '').slice(0, 30),
        shape: HERO_SHAPES_LIST.find((s) => s.id === result.shape) ? String(result.shape) : 'buddy',
        bodyPalette: HERO_PALETTES.find((p) => p.id === result.bodyPalette) ? String(result.bodyPalette) : 'amber',
        accentPalette: HERO_ACCENTS.find((a) => a.id === result.accentPalette) ? String(result.accentPalette) : 'gold',
        eyes: HERO_EYE_STYLES.find((e) => e.id === result.eyes) ? String(result.eyes) : 'round',
        traits: Array.isArray(result.traits) ? (result.traits as string[]).filter((t) => HERO_TRAITS_LIST.includes(t)).slice(0, 3) : ['Brave', 'Kind'],
        tagline: String(result.tagline || ''),
      }));
      setPhase('build');
    } catch (e) {
      console.error('Hero generation failed:', e);
      setGenError('Hmm, something went wrong. Try again or build manually.');
    }
    setBusy(false);
  };

  const randomize = () => {
    const traits: string[] = [];
    const pool = [...HERO_TRAITS_LIST];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      traits.push(pool.splice(idx, 1)[0]);
    }
    setHero((h) => ({
      ...h,
      shape: pickRandom(HERO_SHAPES_LIST).id,
      bodyPalette: pickRandom(HERO_PALETTES).id,
      accentPalette: pickRandom(HERO_ACCENTS).id,
      eyes: pickRandom(HERO_EYE_STYLES).id,
      traits,
    }));
  };

  const surpriseTagline = async () => {
    const traitStr = hero.traits.length ? hero.traits.join(', ').toLowerCase() : 'brave, kind';
    if (!hero.name.trim() || !claudeCall) {
      set('tagline', `${hero.name || 'This hero'} is ${traitStr}, and ready for any adventure among the stars.`);
      return;
    }
    setBusy(true);
    try {
      const result = await claudeCall(
        `Write ONE warm, vivid sentence (15-25 words) describing a space adventure hero named "${hero.name}" for a 10-year-old reader. Traits: ${traitStr}. Mention the stars or space.`,
        `{"tagline":"one sentence"}`,
      );
      if (result?.tagline) set('tagline', result.tagline);
    } catch {}
    setBusy(false);
  };

  const palette = HERO_PALETTES.find((p) => p.id === hero.bodyPalette) || HERO_PALETTES[0];
  const accent = HERO_ACCENTS.find((a) => a.id === hero.accentPalette) || HERO_ACCENTS[0];
  const canSave = hero.name.trim().length >= 1 && hero.traits.length > 0;

  /* ---------- DESCRIBE PHASE ---------- */
  if (phase === 'describe') {
    return (
      <div>
        <div className="section-head">
          <div>
            <div className="step-tag">★ CREATE YOUR HERO</div>
            <h2><span className="stroke">Describe</span> Your Hero.</h2>
            <div className="sub">Tell me what they're like in a sentence or two. I'll bring them to life — then you can change anything.</div>
          </div>
          <div className="row-gap-md">
            <button className="btn ghost" onClick={onCancel}>← BACK</button>
          </div>
        </div>
        <div className="hb-describe-card">
          <label className="hb-label hb-describe-heading">★ What's your hero like?</label>
          <textarea className="hb-input hb-describe-input" rows={5} maxLength={500} value={describeText} onChange={(e) => { setDescribeText(e.target.value); setGenError(null); }} placeholder="A bouncy mint cloud who loves jokes and is best friends with shooting stars…" autoFocus />
          <div className="hb-describe-meta">
            <span className="hb-describe-count">{describeText.length} / 500</span>
            {genError && <span className="hb-describe-error">{genError}</span>}
          </div>
          <div className="hb-describe-examples">
            <span className="hb-describe-label">✨ OR TRY ONE OF THESE</span>
            <div className="hb-example-row">
              {HERO_EXAMPLES.map((ex) => (
                <button key={ex} className="hb-example-chip" onClick={() => { setDescribeText(ex); setGenError(null); }}>{ex}</button>
              ))}
            </div>
          </div>
          <div className="hb-describe-actions">
            <button className="btn ghost" onClick={() => setPhase('build')}>SKIP — BUILD MANUALLY</button>
            <button className="btn gold lg" disabled={!describeText.trim() || busy} onClick={generateFromDescription}>{busy ? '✨ GENERATING…' : '✨ GENERATE MY HERO →'}</button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- BUILD PHASE ---------- */
  return (
    <div>
      <div className="section-head">
        <div>
          <div className="step-tag">★ {existing ? 'EDIT HERO' : 'CREATE YOUR HERO'}</div>
          <h2><span className="stroke">Build a</span> Hero.</h2>
          <div className="sub">Mix a shape, colors, and traits. Your hero will be saved for future adventures.</div>
        </div>
        <div className="row-gap-md">
          <button className="btn ghost" onClick={onCancel}>← BACK</button>
          {!existing && <button className="btn ghost" onClick={() => setPhase('describe')}>📝 RE-DESCRIBE</button>}
          <button className="btn" onClick={randomize}>🎲 SURPRISE</button>
        </div>
      </div>

      <div className="hb-grid">
        <div className="hb-preview-col">
          <div className="char-card selected hb-preview">
            <div className="portrait">
              <div className="halftone-bg"></div>
              <div className="speed"></div>
              <CustomHeroArt hero={hero} />
              <div className="name-stamp">{(hero.name || 'NEW HERO').toUpperCase()}</div>
            </div>
            <h3>{hero.name || 'Your Hero'}{hero.pronounce && <span className="pronounce">{hero.pronounce}</span>}</h3>
            <p className="tagline">{hero.tagline || "Your hero's story starts here…"}</p>
            <div className="traits">
              {hero.traits.length === 0
                ? <span className="trait" style={{ opacity: 0.4 }}>PICK TRAITS</span>
                : hero.traits.map((t) => <span key={t} className="trait">{t}</span>)}
            </div>
          </div>
        </div>

        <div className="hb-form">
          <div className="hb-section">
            <label className="hb-label">★ Name</label>
            <input className="hb-input" maxLength={20} value={hero.name} onChange={(e) => set('name', e.target.value)} placeholder="Type a hero name…" />
            <input className="hb-input" maxLength={28} value={hero.pronounce} onChange={(e) => set('pronounce', e.target.value)} placeholder="How do you say it? (optional)" />
          </div>

          <div className="hb-section">
            <label className="hb-label">★ Body shape</label>
            <div className="hb-shape-grid">
              {HERO_SHAPES_LIST.map((s) => {
                const ShapeComp = SHAPE_COMPS[s.id] || BuddyHero;
                return (
                  <button key={s.id} className={`hb-shape ${hero.shape === s.id ? 'on' : ''}`} onClick={() => set('shape', s.id)}>
                    <div className="hb-shape-mini">
                      <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', display: 'block' }}>
                        <MangaDefs />
                        <ShapeComp palette={palette} accent={accent} eyes={hero.eyes || 'round'} />
                      </svg>
                    </div>
                    <span className="hb-shape-label">{s.label}</span>
                    <span className="hb-shape-sub">{s.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hb-section">
            <label className="hb-label">★ Body color</label>
            <div className="hb-swatches">
              {HERO_PALETTES.map((p) => (
                <button key={p.id} title={p.name} className={`hb-swatch ${hero.bodyPalette === p.id ? 'on' : ''}`} style={{ background: p.body }} onClick={() => set('bodyPalette', p.id)} />
              ))}
            </div>
          </div>

          <div className="hb-section">
            <label className="hb-label">★ Glow color</label>
            <div className="hb-swatches">
              {HERO_ACCENTS.map((a) => (
                <button key={a.id} className={`hb-swatch ${hero.accentPalette === a.id ? 'on' : ''}`} style={{ background: a.glow }} onClick={() => set('accentPalette', a.id)} />
              ))}
            </div>
          </div>

          <div className="hb-section">
            <label className="hb-label">★ Eyes</label>
            <div className="hb-eye-row">
              {HERO_EYE_STYLES.map((e) => (
                <button key={e.id} className={`hb-eye ${hero.eyes === e.id ? 'on' : ''}`} onClick={() => set('eyes', e.id)}>
                  <svg viewBox="0 0 80 40" style={{ width: 70, height: 32 }}>
                    <HeroEyes cx={40} cy={20} gap={28} size={12} style={e.id} />
                  </svg>
                  <span>{e.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="hb-section">
            <label className="hb-label">★ Traits <span className="hb-sub-inline">(pick 1-3)</span></label>
            <div className="hb-traits">
              {HERO_TRAITS_LIST.map((t) => (
                <button key={t} className={`hb-trait-chip ${hero.traits.includes(t) ? 'on' : ''}`} onClick={() => toggleTrait(t)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="hb-section">
            <label className="hb-label">★ Tagline</label>
            <textarea className="hb-input hb-textarea" maxLength={180} value={hero.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="What is your hero like? Write a sentence or tap Surprise Me…" />
            <button className="btn ghost hb-surprise" onClick={surpriseTagline} disabled={busy}>{busy ? '✨ Thinking…' : '✨ SURPRISE ME'}</button>
          </div>
        </div>
      </div>

      <div className="setup-nav hb-nav">
        <span className="step-label">★ {canSave ? 'READY TO SAVE' : 'NEEDS A NAME + 1 TRAIT'}</span>
        <button className="btn gold" disabled={!canSave} onClick={() => onSave(hero)}>SAVE HERO →</button>
      </div>
    </div>
  );
}
