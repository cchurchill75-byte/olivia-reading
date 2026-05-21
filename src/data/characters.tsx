import type { Character } from '../types';

/* ============================================================
   SHARED — manga halftone pattern as <defs>
============================================================ */
export function MangaDefs() {
  return (
    <defs>
      <pattern id="halftoneSm" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1" fill="#0c0a14" />
      </pattern>
      <pattern id="halftoneMd" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="1.5" fill="#0c0a14" />
      </pattern>
      <pattern id="halftoneLg" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="2.2" fill="#0c0a14" />
      </pattern>
      <pattern id="screentone" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="5" stroke="#0c0a14" strokeWidth="1.2" />
      </pattern>
      <radialGradient id="crystalGlow" cx="0.5" cy="0.5">
        <stop offset="0" stopColor="#ffe9a5" />
        <stop offset="0.45" stopColor="#ff9d4a" />
        <stop offset="1" stopColor="#c5223a" />
      </radialGradient>
    </defs>
  );
}

/* ============================================================
   ROCKY
============================================================ */
export function RockyArt({ pose = 'portrait', className = '' }: { pose?: string; className?: string }) {
  if (pose === 'scene') {
    return (
      <svg viewBox="0 0 600 360" className={className} xmlns="http://www.w3.org/2000/svg">
        <MangaDefs />
        <g opacity="0.5" className="spd-rot-slow" style={{ transformOrigin: '300px 200px' }}>
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return <line key={i} x1={300 + Math.cos(a) * 80} y1={200 + Math.sin(a) * 60} x2={300 + Math.cos(a) * 360} y2={200 + Math.sin(a) * 260} stroke="#0c0a14" strokeWidth="1.5" />;
          })}
        </g>
        <ellipse cx="300" cy="320" rx="180" ry="14" fill="#0c0a14" opacity="0.32" />
        <g className="rk-bob">
          <g><path d="M230,210 Q170,165 105,135" stroke="#7a2a1f" strokeWidth="30" fill="none" strokeLinecap="round" /><path d="M230,210 Q170,165 105,135" stroke="#0c0a14" strokeWidth="4" fill="none" strokeLinecap="round" /><ellipse cx="105" cy="135" rx="24" ry="18" fill="#7a2a1f" stroke="#0c0a14" strokeWidth="4" /></g>
          <g><path d="M370,210 Q430,170 500,150" stroke="#7a2a1f" strokeWidth="30" fill="none" strokeLinecap="round" /><path d="M370,210 Q430,170 500,150" stroke="#0c0a14" strokeWidth="4" fill="none" strokeLinecap="round" /><ellipse cx="500" cy="150" rx="24" ry="18" fill="#7a2a1f" stroke="#0c0a14" strokeWidth="4" /></g>
          <ellipse cx="300" cy="220" rx="150" ry="80" fill="#c4683a" stroke="#0c0a14" strokeWidth="5" />
          <path d="M150,220 Q300,310 450,220 Q300,275 150,220 Z" fill="#6b2317" opacity="0.75" />
          <g className="rk-crystal" transform="translate(300,170)">
            <ellipse cx="0" cy="0" rx="48" ry="9" fill="#0c0a14" />
            <ellipse cx="0" cy="-1" rx="44" ry="6" fill="url(#crystalGlow)" />
            <ellipse cx="0" cy="-2" rx="34" ry="3" fill="#ffe9a5" opacity="0.85" />
          </g>
          <g fill="#0c0a14"><circle cx="240" cy="215" r="4" /><circle cx="360" cy="215" r="4" /></g>
          <g><path d="M225,260 Q175,290 130,310" stroke="#a8512a" strokeWidth="36" fill="none" strokeLinecap="round" /><path d="M225,260 Q175,290 130,310" stroke="#0c0a14" strokeWidth="4.5" fill="none" strokeLinecap="round" /><ellipse cx="130" cy="310" rx="30" ry="20" fill="#a8512a" stroke="#0c0a14" strokeWidth="4.5" /></g>
          <g><path d="M375,260 Q425,290 470,310" stroke="#a8512a" strokeWidth="36" fill="none" strokeLinecap="round" /><path d="M375,260 Q425,290 470,310" stroke="#0c0a14" strokeWidth="4.5" fill="none" strokeLinecap="round" /><ellipse cx="470" cy="310" rx="30" ry="20" fill="#a8512a" stroke="#0c0a14" strokeWidth="4.5" /></g>
          <g><path d="M300,275 Q310,310 295,335" stroke="#a8512a" strokeWidth="40" fill="none" strokeLinecap="round" /><path d="M300,275 Q310,310 295,335" stroke="#0c0a14" strokeWidth="4.5" fill="none" strokeLinecap="round" /><ellipse cx="293" cy="335" rx="32" ry="18" fill="#a8512a" stroke="#0c0a14" strokeWidth="4.5" /></g>
        </g>
        <text x="60" y="80" fontFamily="Bangers, Impact" fontSize="48" fill="#ffb02e" stroke="#0c0a14" strokeWidth="3" transform="rotate(-12 60 80)">TON!</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
      <MangaDefs />
      <rect x="0" y="0" width="400" height="400" fill="url(#halftoneMd)" opacity="0.35" />
      <g opacity="0.55" className="spd-rot" style={{ transformOrigin: '200px 230px' }}>
        {Array.from({ length: 26 }).map((_, i) => {
          const a = (i / 26) * Math.PI * 2;
          return <line key={i} x1={200 + Math.cos(a) * 130} y1={230 + Math.sin(a) * 130} x2={200 + Math.cos(a) * 240} y2={230 + Math.sin(a) * 240} stroke="#0c0a14" strokeWidth="1.5" />;
        })}
      </g>
      <ellipse cx="200" cy="370" rx="170" ry="14" fill="#0c0a14" opacity="0.32" />
      <g className="rk-bob">
        <g><path d="M150,205 Q105,160 70,100" stroke="#7a2a1f" strokeWidth="30" fill="none" strokeLinecap="round" /><path d="M150,205 Q105,160 70,100" stroke="#0c0a14" strokeWidth="4" fill="none" strokeLinecap="round" /><ellipse cx="70" cy="100" rx="24" ry="20" fill="#7a2a1f" stroke="#0c0a14" strokeWidth="4" /></g>
        <g><path d="M250,205 Q295,160 330,100" stroke="#7a2a1f" strokeWidth="30" fill="none" strokeLinecap="round" /><path d="M250,205 Q295,160 330,100" stroke="#0c0a14" strokeWidth="4" fill="none" strokeLinecap="round" /><ellipse cx="330" cy="100" rx="24" ry="20" fill="#7a2a1f" stroke="#0c0a14" strokeWidth="4" /></g>
        <ellipse cx="200" cy="235" rx="135" ry="80" fill="#c4683a" stroke="#0c0a14" strokeWidth="5" />
        <path d="M65,235 Q200,325 335,235 Q200,290 65,235 Z" fill="#6b2317" opacity="0.78" />
        <path d="M85,210 Q200,160 315,210" stroke="#e89556" strokeWidth="12" fill="none" opacity="0.6" strokeLinecap="round" />
        <g stroke="#0c0a14" strokeWidth="2.5" opacity="0.6" fill="none">
          <path d="M200,235 L70,240" /><path d="M200,235 L330,240" /><path d="M200,235 L138,310" /><path d="M200,235 L262,310" /><path d="M200,235 L200,160" />
        </g>
        <g className="rk-crystal" transform="translate(200,185)">
          <ellipse cx="0" cy="0" rx="48" ry="11" fill="#0c0a14" />
          <ellipse cx="0" cy="-1" rx="44" ry="7" fill="url(#crystalGlow)" />
          <ellipse cx="0" cy="-2" rx="32" ry="3.5" fill="#ffe9a5" opacity="0.9" />
          <ellipse cx="-14" cy="-2" rx="5" ry="1.6" fill="#fff" />
        </g>
        <g fill="#0c0a14"><circle cx="135" cy="232" r="4" /><circle cx="265" cy="232" r="4" /><circle cx="170" cy="278" r="3.5" /><circle cx="230" cy="278" r="3.5" /><circle cx="200" cy="295" r="3" /></g>
        <g><path d="M140,280 Q105,335 80,378" stroke="#a8512a" strokeWidth="38" fill="none" strokeLinecap="round" /><path d="M140,280 Q105,335 80,378" stroke="#0c0a14" strokeWidth="4.5" fill="none" strokeLinecap="round" /><ellipse cx="80" cy="378" rx="32" ry="18" fill="#a8512a" stroke="#0c0a14" strokeWidth="4.5" /></g>
        <g><path d="M260,280 Q295,335 320,378" stroke="#a8512a" strokeWidth="38" fill="none" strokeLinecap="round" /><path d="M260,280 Q295,335 320,378" stroke="#0c0a14" strokeWidth="4.5" fill="none" strokeLinecap="round" /><ellipse cx="320" cy="378" rx="32" ry="18" fill="#a8512a" stroke="#0c0a14" strokeWidth="4.5" /></g>
        <g><path d="M200,300 Q205,335 200,365" stroke="#a8512a" strokeWidth="42" fill="none" strokeLinecap="round" /><path d="M200,300 Q205,335 200,365" stroke="#0c0a14" strokeWidth="4.5" fill="none" strokeLinecap="round" /><ellipse cx="200" cy="365" rx="34" ry="18" fill="#a8512a" stroke="#0c0a14" strokeWidth="4.5" /></g>
      </g>
      <text x="280" y="58" fontFamily="Bangers, Impact" fontSize="42" fill="#ffb02e" stroke="#0c0a14" strokeWidth="3" transform="rotate(8 280 58)">CHIME</text>
      <text x="22" y="380" fontFamily="Bangers, Impact" fontSize="30" fill="#e53b50" stroke="#0c0a14" strokeWidth="2.5" transform="rotate(-6 22 380)">TON!</text>
    </svg>
  );
}

/* ============================================================
   MAINE COON — simplified portrait (keeping key visual elements)
============================================================ */
export function MaineCoonArt({ pose = 'portrait', className = '' }: { pose?: string; className?: string }) {
  const BROWN = '#8a5a36';
  const BROWN_DARK = '#3d2716';
  const CREAM = '#ecdab2';
  const PINK = '#d4838f';
  const EYE = '#7da55e';

  return (
    <svg viewBox="0 0 400 400" className={className} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <MangaDefs />
      <rect x="0" y="0" width="400" height="400" fill="url(#halftoneMd)" opacity="0.3" />
      <g opacity="0.5" className="spd-rot-slow" style={{ transformOrigin: '200px 230px' }}>
        {Array.from({ length: 22 }).map((_, i) => {
          const a = (i / 22) * Math.PI * 2;
          return <line key={i} x1={200 + Math.cos(a) * 150} y1={230 + Math.sin(a) * 150} x2={200 + Math.cos(a) * 240} y2={230 + Math.sin(a) * 240} stroke="#0c0a14" strokeWidth="1.4" />;
        })}
      </g>
      <ellipse cx="200" cy="385" rx="160" ry="11" fill="#0c0a14" opacity="0.28" />
      <g className="rk-bob">
        {/* tail */}
        <path d="M312,308 Q386,266 366,182 Q350,132 322,148 Q340,170 340,202 Q335,240 308,278 Z" fill={BROWN} stroke="#0c0a14" strokeWidth="5" strokeLinejoin="round" />
        {/* paws */}
        <ellipse cx="146" cy="370" rx="44" ry="22" fill={BROWN} stroke="#0c0a14" strokeWidth="5" />
        <ellipse cx="254" cy="370" rx="44" ry="22" fill={BROWN} stroke="#0c0a14" strokeWidth="5" />
        {/* body */}
        <ellipse cx="200" cy="308" rx="118" ry="82" fill={BROWN} stroke="#0c0a14" strokeWidth="5" />
        <ellipse cx="200" cy="338" rx="72" ry="42" fill={CREAM} stroke="#0c0a14" strokeWidth="3.5" />
        {/* ruff */}
        <path d="M110,232 Q116,196 142,204 Q152,178 172,200 Q200,168 228,200 Q248,178 258,204 Q284,196 290,232 Q298,260 268,274 Q236,290 200,290 Q164,290 132,274 Q102,260 110,232 Z" fill={CREAM} stroke="#0c0a14" strokeWidth="5" strokeLinejoin="round" />
        {/* head */}
        <path d="M122,198 Q116,138 154,116 Q176,96 200,96 Q224,96 246,116 Q284,138 278,198 Q260,234 200,238 Q140,234 122,198 Z" fill={BROWN} stroke="#0c0a14" strokeWidth="5" strokeLinejoin="round" />
        {/* ears */}
        <path d="M142,148 L116,60 L172,116 Z" fill={BROWN} stroke="#0c0a14" strokeWidth="5" strokeLinejoin="round" />
        <path d="M148,138 L132,86 L162,118 Z" fill={PINK} opacity="0.55" />
        <path d="M258,148 L284,60 L228,116 Z" fill={BROWN} stroke="#0c0a14" strokeWidth="5" strokeLinejoin="round" />
        <path d="M252,138 L268,86 L238,118 Z" fill={PINK} opacity="0.55" />
        {/* eyes */}
        <ellipse cx="172" cy="180" rx="17" ry="14.5" fill="#fff" stroke="#0c0a14" strokeWidth="4" />
        <ellipse cx="228" cy="180" rx="17" ry="14.5" fill="#fff" stroke="#0c0a14" strokeWidth="4" />
        <circle cx="172" cy="180" r="10" fill={EYE} />
        <circle cx="228" cy="180" r="10" fill={EYE} />
        <ellipse cx="172" cy="180" rx="3.2" ry="9.5" fill="#0c0a14" />
        <ellipse cx="228" cy="180" rx="3.2" ry="9.5" fill="#0c0a14" />
        <circle cx="175.5" cy="176" r="2.4" fill="#fff" />
        <circle cx="231.5" cy="176" r="2.4" fill="#fff" />
        {/* nose + mouth */}
        <path d="M191,206 L209,206 L200,217 Z" fill={PINK} stroke="#0c0a14" strokeWidth="3" strokeLinejoin="round" />
        <path d="M200,217 L200,224" stroke="#0c0a14" strokeWidth="3" strokeLinecap="round" />
        <path d="M200,224 Q189,234 180,229" stroke="#0c0a14" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M200,224 Q211,234 220,229" stroke="#0c0a14" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {/* whiskers */}
        <g stroke="#0c0a14" strokeWidth="2" strokeLinecap="round" opacity="0.9" fill="none">
          <path d="M148,212 Q116,210 88,206" /><path d="M148,219 Q116,224 86,228" />
          <path d="M252,212 Q284,210 312,206" /><path d="M252,219 Q284,224 314,228" />
        </g>
      </g>
      <text x="262" y="58" fontFamily="Bangers, Impact" fontSize="40" fill="#ffb02e" stroke="#0c0a14" strokeWidth="2.8" transform="rotate(8 262 58)">PURRR!</text>
    </svg>
  );
}

/* ============================================================
   BUNNIFOROUS — uses actual photos
============================================================ */
export function BunniforousArt({ pose = 'portrait', className = '' }: { pose?: string; className?: string }) {
  const src = pose === 'scene' ? '/assets/bunniforous-3.png' : '/assets/bunniforous-1.png';
  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <img src={src} alt="Bunniforous"
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          filter: 'contrast(1.22) saturate(0.78) brightness(1.02)',
          mixBlendMode: 'multiply',
        }} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <MangaDefs />
        <rect x="0" y="0" width="100" height="100" fill="url(#halftoneSm)" opacity="0.18" />
      </svg>
      <div style={{
        position: 'absolute', top: 8, right: 8,
        fontFamily: 'Bangers, Impact',
        color: '#ffb02e',
        WebkitTextStroke: '2px #0c0a14',
        textShadow: '3px 3px 0 #0c0a14',
        fontSize: 28,
        letterSpacing: '0.02em',
        transform: 'rotate(8deg)',
        pointerEvents: 'none',
      }}>FWUMP!</div>
    </div>
  );
}

/* ============================================================
   CHARACTER CHIP
============================================================ */
export function CharacterChip({ id, size = 48 }: { id: string; size?: number }) {
  const wrapStyle: React.CSSProperties = {
    width: size, height: size, overflow: 'hidden',
    border: '3px solid #0c0a14', background: '#ecdfc4',
    position: 'relative', boxShadow: '3px 3px 0 #0c0a14',
  };

  if (id === 'rocky') return <div style={wrapStyle}><RockyArt pose="portrait" /></div>;
  if (id === 'mainecoon') return <div style={wrapStyle}><MaineCoonArt pose="portrait" /></div>;
  if (id === 'bunniforous') {
    return (
      <div style={wrapStyle}>
        <img src="/assets/bunniforous-1.png" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.2) saturate(0.8)' }} alt="" />
      </div>
    );
  }

  // For custom heroes, we just show a generic chip — the full art requires heroData which creates a circular dep
  return <div style={wrapStyle}><RockyArt pose="portrait" /></div>;
}

/* ============================================================
   CHARACTERS ARRAY
============================================================ */
export const CHARACTERS: Character[] = [
  {
    id: 'rocky',
    name: 'Rocky',
    pronounce: '/ rock-ee /',
    tagline: "A five-limbed crystal-rock alien who travels the stars collecting glowing minerals. Brave, gentle, doesn't speak our language — he chimes and clicks. Built for space.",
    traits: ['Brave', '5 Limbs', 'Crystal Core', 'Loyal'],
    art: 'rocky',
  },
  {
    id: 'mainecoon',
    name: 'Sir Biscuit',
    pronounce: '/ bis-kit / \u00B7 Maine Coon',
    tagline: 'A gentle giant of a cat — the size of a small lion and twice as snuggly. Fluffy mane, lynx-tufted ears, and a tail like a feather boa. He purrs in three octaves.',
    traits: ['Gigantic', 'Gentle', 'Fluffy', 'Purrs'],
    art: 'mainecoon',
  },
  {
    id: 'bunniforous',
    name: 'Bunniforous',
    pronounce: '/ bun-ee-FOR-us /',
    tagline: 'A floppy-eared captain who hopped into the stars after a carrot patch grew sideways. Soft, sneaky, and the bravest pilot in three solar systems.',
    traits: ['Sneaky', 'Pilot', 'Lightning Fast', 'Fluffy'],
    art: 'bunny',
  },
];

// Break circular dependency: heroData imports from characters, so we can't import heroData at top level.
// Instead, getAllCharacters accepts an optional heroes array, or reads localStorage directly.
export function getAllCharacters(): Character[] {
  try {
    const raw = localStorage.getItem('olivia.customHeroes');
    const custom: Character[] = raw ? JSON.parse(raw) : [];
    return [...CHARACTERS, ...custom];
  } catch {
    return CHARACTERS;
  }
}
