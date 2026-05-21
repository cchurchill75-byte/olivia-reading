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
      {/* shading gradients for the more-realistic figures */}
      <radialGradient id="stoneSheen" cx="0.38" cy="0.28" r="0.85">
        <stop offset="0" stopColor="#cdc9c3" stopOpacity="0.85" />
        <stop offset="0.45" stopColor="#9c9792" stopOpacity="0.25" />
        <stop offset="1" stopColor="#3a352f" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="furBody" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="#9c6539" />
        <stop offset="0.55" stopColor="#754a29" />
        <stop offset="1" stopColor="#492c16" />
      </linearGradient>
      <radialGradient id="furHead" cx="0.5" cy="0.4" r="0.66">
        <stop offset="0" stopColor="#a36e40" />
        <stop offset="0.68" stopColor="#754a29" />
        <stop offset="1" stopColor="#583620" />
      </radialGradient>
      <linearGradient id="furCream" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="#f1e3c2" />
        <stop offset="1" stopColor="#d8c19a" />
      </linearGradient>
      <radialGradient id="irisGrad" cx="0.5" cy="0.38" r="0.62">
        <stop offset="0" stopColor="#bfe08f" />
        <stop offset="0.6" stopColor="#83a85f" />
        <stop offset="1" stopColor="#4d7136" />
      </radialGradient>
    </defs>
  );
}

/* ============================================================
   ROCKY
============================================================ */
/* Movie-accurate Rocky (Project Hail Mary): eyeless, faceless, five-legged
   rock-spider with a faceted stone carapace and three triangular fingers per
   limb. Stone palette + manga halftone styling to match the rest of the app. */
const STONE = {
  hi: '#b9b4ae',
  lt: '#9c9792',
  md: '#6f6862',
  br: '#7a6750',
  dk: '#453f3a',
  edge: '#1c1916',
};

/* One articulated leg: two bold stone segments, a faceted knee node, and three
   triangular fingers fanning out from the foot (last point of `pts`). */
function RockyLeg({ pts }: { pts: [number, number][] }) {
  const d = 'M' + pts.map((p) => p.join(',')).join(' L');
  const [kx, ky] = pts[pts.length - 2];
  const [fx, fy] = pts[pts.length - 1];
  const dir = Math.atan2(fy - ky, fx - kx);
  const fingers = [-0.6, 0, 0.6].map((off) => {
    const a = dir + off;
    const tx = fx + Math.cos(a) * 22;
    const ty = fy + Math.sin(a) * 22;
    const p = a + Math.PI / 2;
    const w = 5.5;
    return `M${(fx + Math.cos(p) * w).toFixed(1)},${(fy + Math.sin(p) * w).toFixed(1)} L${tx.toFixed(1)},${ty.toFixed(1)} L${(fx - Math.cos(p) * w).toFixed(1)},${(fy - Math.sin(p) * w).toFixed(1)} Z`;
  });
  return (
    <g>
      <path d={d} fill="none" stroke={STONE.edge} strokeWidth={21} strokeLinejoin="round" strokeLinecap="round" />
      <path d={d} fill="none" stroke={STONE.md} strokeWidth={15} strokeLinejoin="round" strokeLinecap="round" />
      <path d={d} fill="none" stroke={STONE.dk} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" opacity={0.4} />
      <path d={d} fill="none" stroke={STONE.hi} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" opacity={0.32} />
      {pts.slice(1, -1).map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={9.5} fill={STONE.lt} stroke={STONE.edge} strokeWidth={2.6} />
          <circle cx={p[0] - 2.5} cy={p[1] - 2.5} r={3} fill={STONE.hi} opacity={0.7} />
        </g>
      ))}
      {fingers.map((fd, i) => (
        <path key={i} d={fd} fill={STONE.md} stroke={STONE.edge} strokeWidth={2.4} strokeLinejoin="round" />
      ))}
    </g>
  );
}

/* Faceted boulder carapace, centered on the local origin. */
function RockyBody() {
  const V: [number, number][] = [
    [-130, 25], [-80, -50], [0, -85], [80, -50], [130, 25], [55, 53], [0, 60], [-55, 53],
  ];
  const M: [number, number] = [0, -12];
  const shades = [STONE.md, STONE.lt, STONE.hi, STONE.br, STONE.md, STONE.dk, STONE.dk, STONE.lt];
  const sil = 'M' + V.map((p) => p.join(',')).join(' L') + ' Z';
  return (
    <g>
      <path d={sil} fill={STONE.md} stroke={STONE.edge} strokeWidth={4.5} strokeLinejoin="round" />
      {V.map((v, i) => {
        const v2 = V[(i + 1) % V.length];
        return (
          <path key={i} d={`M${M.join(',')} L${v.join(',')} L${v2.join(',')} Z`}
            fill={shades[i]} stroke={STONE.edge} strokeWidth={0.9} strokeOpacity={0.55} strokeLinejoin="round" />
        );
      })}
      {/* soft directional light across the carapace */}
      <path d={sil} fill="url(#stoneSheen)" />
      {/* screentone shadow across the lower-right facets */}
      <path d={`M${M.join(',')} L${V[4].join(',')} L${V[5].join(',')} L${V[6].join(',')} Z`} fill="url(#halftoneMd)" opacity={0.32} />
      {/* fracture lines / weathering for stone texture */}
      <g stroke={STONE.edge} strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.45}>
        <path d="M-66,-26 L-28,-6 L-36,30" />
        <path d="M44,-40 L58,-2 L34,42" />
        <path d="M-8,-14 L18,16 L8,46" />
        <path d="M-96,18 L-58,22" />
      </g>
      {/* crisp outline on top */}
      <path d={sil} fill="none" stroke={STONE.edge} strokeWidth={4.5} strokeLinejoin="round" />
      {/* incised alien carvings near the crown */}
      <g stroke={STONE.hi} strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.55}>
        <path d="M-26,-54 L0,-68 L26,-54" />
        <path d="M-16,-42 L0,-50 L16,-42" />
      </g>
      <g stroke={STONE.edge} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.85}>
        <path d="M-26,-52 L0,-66 L26,-52" />
        <path d="M-16,-40 L0,-48 L16,-40" />
        <circle cx="0" cy="-26" r="2.6" fill={STONE.edge} stroke="none" />
      </g>
    </g>
  );
}

export function RockyArt({ pose = 'portrait', className = '' }: { pose?: string; className?: string }) {
  if (pose === 'scene') {
    return (
      <svg viewBox="0 0 600 360" className={className} xmlns="http://www.w3.org/2000/svg">
        <MangaDefs />
        <g opacity="0.28" className="spd-rot-slow" style={{ transformOrigin: '300px 200px' }}>
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return <line key={i} x1={300 + Math.cos(a) * 80} y1={200 + Math.sin(a) * 60} x2={300 + Math.cos(a) * 360} y2={200 + Math.sin(a) * 260} stroke="#0c0a14" strokeWidth="1.5" />;
          })}
        </g>
        <ellipse cx="300" cy="322" rx="180" ry="14" fill="#0c0a14" opacity="0.32" />
        <g className="rk-bob">
          <g transform="translate(300,175) scale(0.9)">
            <RockyLeg pts={[[-95, -15], [-150, -78], [-188, -126]]} />
            <RockyLeg pts={[[95, -15], [150, -78], [188, -126]]} />
            <RockyBody />
            <RockyLeg pts={[[-80, 45], [-120, 110], [-150, 160]]} />
            <RockyLeg pts={[[80, 45], [120, 110], [150, 160]]} />
            <RockyLeg pts={[[0, 58], [0, 118], [0, 165]]} />
          </g>
        </g>
        <text x="60" y="80" fontFamily="Bangers, Impact" fontSize="48" fill="#ffb02e" stroke="#0c0a14" strokeWidth="3" transform="rotate(-12 60 80)">TON!</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg">
      <MangaDefs />
      <rect x="0" y="0" width="400" height="400" fill="url(#halftoneMd)" opacity="0.35" />
      <g opacity="0.3" className="spd-rot" style={{ transformOrigin: '200px 230px' }}>
        {Array.from({ length: 26 }).map((_, i) => {
          const a = (i / 26) * Math.PI * 2;
          return <line key={i} x1={200 + Math.cos(a) * 130} y1={230 + Math.sin(a) * 130} x2={200 + Math.cos(a) * 240} y2={230 + Math.sin(a) * 240} stroke="#0c0a14" strokeWidth="1.5" />;
        })}
      </g>
      <ellipse cx="200" cy="374" rx="160" ry="13" fill="#0c0a14" opacity="0.32" />
      <g className="rk-bob">
        <g transform="translate(200,212) scale(0.92)">
          <RockyLeg pts={[[-95, -15], [-150, -78], [-188, -126]]} />
          <RockyLeg pts={[[95, -15], [150, -78], [188, -126]]} />
          <RockyBody />
          <RockyLeg pts={[[-80, 45], [-120, 110], [-150, 160]]} />
          <RockyLeg pts={[[80, 45], [120, 110], [150, 160]]} />
          <RockyLeg pts={[[0, 58], [0, 118], [0, 165]]} />
        </g>
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
  const OUT = '#2a1a0c';
  const STRIPE = '#36210f';
  const DARK = '#3d2716';
  const PINK = '#cf8b93';

  return (
    <svg viewBox="0 0 400 400" className={className} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <MangaDefs />
      <rect x="0" y="0" width="400" height="400" fill="url(#halftoneMd)" opacity="0.3" />
      <g opacity="0.3" className="spd-rot-slow" style={{ transformOrigin: '200px 230px' }}>
        {Array.from({ length: 22 }).map((_, i) => {
          const a = (i / 22) * Math.PI * 2;
          return <line key={i} x1={200 + Math.cos(a) * 150} y1={230 + Math.sin(a) * 150} x2={200 + Math.cos(a) * 240} y2={230 + Math.sin(a) * 240} stroke="#0c0a14" strokeWidth="1.4" />;
        })}
      </g>
      <ellipse cx="200" cy="385" rx="160" ry="11" fill="#0c0a14" opacity="0.28" />
      <g className="rk-bob">
        {/* tail with rings */}
        <path d="M312,308 Q386,266 366,182 Q350,132 322,148 Q340,170 340,202 Q335,240 308,278 Z" fill="url(#furBody)" stroke={OUT} strokeWidth="3.5" strokeLinejoin="round" />
        <g stroke={STRIPE} strokeWidth="7" fill="none" opacity="0.5" strokeLinecap="round">
          <path d="M349,170 Q360,176 364,188" />
          <path d="M342,208 Q356,212 360,224" />
          <path d="M326,248 Q340,252 344,262" />
        </g>
        {/* paws */}
        <ellipse cx="146" cy="370" rx="44" ry="22" fill="url(#furBody)" stroke={OUT} strokeWidth="3.5" />
        <ellipse cx="254" cy="370" rx="44" ry="22" fill="url(#furBody)" stroke={OUT} strokeWidth="3.5" />
        <g stroke={OUT} strokeWidth="1.8" opacity="0.55" strokeLinecap="round">
          <path d="M134,360 L134,382" /><path d="M150,358 L150,384" /><path d="M166,360 L166,382" />
          <path d="M242,360 L242,382" /><path d="M258,358 L258,384" /><path d="M274,360 L274,382" />
        </g>
        {/* body */}
        <ellipse cx="200" cy="308" rx="118" ry="82" fill="url(#furBody)" stroke={OUT} strokeWidth="3.5" />
        {/* tabby body stripes (covered at center by chest/ruff) */}
        <g stroke={STRIPE} strokeWidth="6" fill="none" opacity="0.4" strokeLinecap="round">
          <path d="M118,278 Q130,312 124,348" /><path d="M150,266 Q160,306 156,350" />
          <path d="M282,278 Q270,312 276,348" /><path d="M250,266 Q240,306 244,350" />
        </g>
        <ellipse cx="200" cy="338" rx="72" ry="44" fill="url(#furCream)" stroke={OUT} strokeWidth="2.6" />
        {/* ruff */}
        <path d="M110,232 Q116,196 142,204 Q152,178 172,200 Q200,168 228,200 Q248,178 258,204 Q284,196 290,232 Q298,260 268,274 Q236,290 200,290 Q164,290 132,274 Q102,260 110,232 Z" fill="url(#furCream)" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
        <g stroke={DARK} strokeWidth="1.4" fill="none" opacity="0.35" strokeLinecap="round">
          <path d="M130,236 Q138,256 134,272" /><path d="M158,232 Q164,256 160,278" />
          <path d="M242,232 Q236,256 240,278" /><path d="M270,236 Q262,256 266,272" />
        </g>
        {/* head */}
        <path d="M122,198 Q116,138 154,116 Q176,96 200,96 Q224,96 246,116 Q284,138 278,198 Q260,234 200,238 Q140,234 122,198 Z" fill="url(#furHead)" stroke={OUT} strokeWidth="3.5" strokeLinejoin="round" />
        {/* ears + lynx tufts */}
        <path d="M142,148 L116,60 L172,116 Z" fill="url(#furHead)" stroke={OUT} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M148,138 L132,86 L162,118 Z" fill={PINK} opacity="0.5" />
        <path d="M258,148 L284,60 L228,116 Z" fill="url(#furHead)" stroke={OUT} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M252,138 L268,86 L238,118 Z" fill={PINK} opacity="0.5" />
        <g stroke={DARK} strokeWidth="2" strokeLinecap="round" opacity="0.75" fill="none">
          <path d="M116,60 L106,38" /><path d="M116,60 L122,36" /><path d="M122,68 L114,46" />
          <path d="M284,60 L294,38" /><path d="M284,60 L278,36" /><path d="M278,68 L286,46" />
        </g>
        {/* forehead tabby 'M' */}
        <g stroke={STRIPE} strokeWidth="3.6" fill="none" strokeLinecap="round" opacity="0.7">
          <path d="M200,150 L200,118" />
          <path d="M188,150 Q183,130 174,116" /><path d="M212,150 Q217,130 226,116" />
          <path d="M176,152 Q166,136 152,128" /><path d="M224,152 Q234,136 248,128" />
        </g>
        {/* cheek/fur texture on head sides */}
        <g stroke={DARK} strokeWidth="1.3" fill="none" opacity="0.35" strokeLinecap="round">
          <path d="M126,184 Q140,196 146,214" /><path d="M132,206 Q146,214 150,226" />
          <path d="M274,184 Q260,196 254,214" /><path d="M268,206 Q254,214 250,226" />
        </g>
        {/* eyes — almond, slit pupil */}
        {[173, 227].map((cx, i) => (
          <g key={i}>
            <path d={`M${cx - 17},182 Q${cx - 2},169 ${cx + 17},181 Q${cx + 2},196 ${cx - 17},182 Z`} fill="#f4efe6" stroke={OUT} strokeWidth="2.4" strokeLinejoin="round" />
            <circle cx={cx} cy={183} r={9.2} fill="url(#irisGrad)" />
            <ellipse cx={cx} cy={183} rx={2.4} ry={8} fill="#140d05" />
            <circle cx={cx - 3} cy={179} r={1.9} fill="#fff" opacity={0.92} />
            <path d={`M${cx - 17},180 Q${cx - 2},166 ${cx + 17},179`} fill="none" stroke={OUT} strokeWidth="2.6" strokeLinecap="round" />
          </g>
        ))}
        {/* nose + mouth */}
        <path d="M192,206 Q200,202 208,206 Q204,214 200,216 Q196,214 192,206 Z" fill={PINK} stroke={OUT} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M200,216 L200,223" stroke={OUT} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M200,223 Q190,232 181,227" stroke={OUT} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M200,223 Q210,232 219,227" stroke={OUT} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {/* whiskers */}
        <g stroke={OUT} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" fill="none">
          <path d="M150,210 Q116,206 84,200" /><path d="M150,217 Q116,220 82,224" /><path d="M150,224 Q118,232 88,242" />
          <path d="M250,210 Q284,206 316,200" /><path d="M250,217 Q284,220 318,224" /><path d="M250,224 Q282,232 312,242" />
        </g>
      </g>
      <text x="262" y="58" fontFamily="Bangers, Impact" fontSize="40" fill="#ffb02e" stroke="#0c0a14" strokeWidth="2.8" transform="rotate(8 262 58)" opacity="0.92">PURRR!</text>
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
    tagline: "A faceless, five-legged rock alien about the size of a big dog — built from living stone. Brave, gentle, and clever; he doesn't speak our language, he chimes and clicks in music.",
    traits: ['Brave', '5 Legs', 'Stone Body', 'Loyal'],
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
