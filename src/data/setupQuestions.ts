import type { SetupOption, SetupQuestion } from '../types';

const SETUP_QUESTIONS_POOL: Omit<SetupQuestion, 'options'>[] = [
  {
    id: 'setting',
    q: 'Where does it begin?',
    hint: 'Pick the place your adventure starts.',
    pool: [
      { v: 'asteroid_field', label: 'Asteroid Field', sub: 'Big floating space rocks', icon: '\u{1FAA8}' },
      { v: 'crystal_caves', label: 'Crystal Caves', sub: 'A moon made of glass', icon: '\u{1F48E}' },
      { v: 'nebula_garden', label: 'Nebula Garden', sub: 'Pink clouds, glowing flowers', icon: '\u{1F338}' },
      { v: 'moon_meadow', label: 'Moon Meadow', sub: 'Bouncy grass, two moons', icon: '\u{1F315}' },
      { v: 'space_station', label: 'Old Space Station', sub: 'Hallways, beeping doors', icon: '\u{1F6F0}\uFE0F' },
      { v: 'icy_comet', label: 'Icy Comet', sub: 'Ride it through the dark', icon: '\u2604\uFE0F' },
      { v: 'jelly_jungle', label: 'Jelly Jungle', sub: 'Wiggly trees, soft floor', icon: '\u{1F333}' },
      { v: 'thunder_world', label: 'Thunder World', sub: 'Sky-cracking storms', icon: '\u26A1' },
      { v: 'candy_planet', label: 'Candy Planet', sub: 'Sugar rivers, gumdrop hills', icon: '\u{1F36D}' },
      { v: 'deep_ocean', label: 'Ocean Moon', sub: 'Glowing fish, dark water', icon: '\u{1F420}' },
      { v: 'star_train', label: 'Starlight Train', sub: 'Hops planet to planet', icon: '\u{1F682}' },
      { v: 'rainbow_reef', label: 'Rainbow Reef', sub: 'Coral that glows', icon: '\u{1F308}' },
    ],
  },
  {
    id: 'problem',
    q: 'What is the problem?',
    hint: 'Every adventure needs trouble. Pick yours.',
    pool: [
      { v: 'lost_friend', label: 'A friend is lost', sub: 'Find them before dark', icon: '\u{1F52D}' },
      { v: 'stolen_thing', label: 'Something got stolen', sub: 'Solve the mystery', icon: '\u{1F575}\uFE0F' },
      { v: 'broken_ship', label: 'The ship is broken', sub: 'Fix it fast', icon: '\u{1F527}' },
      { v: 'mystery_signal', label: 'A mystery signal', sub: "Who's calling us?", icon: '\u{1F4E1}' },
      { v: 'scary_creature', label: 'A scary creature', sub: '(maybe just lonely?)', icon: '\u{1F47E}' },
      { v: 'race_home', label: 'Racing home', sub: 'Before the stars fade', icon: '\u{1F3C1}' },
      { v: 'trapped', label: 'Trapped somewhere', sub: 'Find the way out', icon: '\u{1F6AA}' },
      { v: 'puzzle_door', label: 'A puzzle door', sub: 'Crack the code', icon: '\u{1F9E9}' },
      { v: 'weird_weather', label: 'Weird weather', sub: 'Sky doing strange things', icon: '\u{1F32A}\uFE0F' },
      { v: 'missing_pet', label: 'Pet ran off', sub: 'Help it find its way', icon: '\u{1F43E}' },
      { v: 'secret_map', label: 'A secret map', sub: 'Where does it lead?', icon: '\u{1F5FA}\uFE0F' },
      { v: 'wrong_planet', label: 'Wrong planet', sub: 'How do we get home?', icon: '\u{1F30D}' },
    ],
  },
  {
    id: 'item',
    q: 'What do you bring?',
    hint: 'Pick one cool thing for your pack.',
    pool: [
      { v: 'glow_map', label: 'Glowing map', sub: 'Shows hidden places', icon: '\u{1F5FA}\uFE0F' },
      { v: 'snack_pack', label: 'Endless snack pack', sub: 'Never goes empty', icon: '\u{1F955}' },
      { v: 'whistle', label: 'Space whistle', sub: 'Calls friendly aliens', icon: '\u{1FA88}' },
      { v: 'shrink_ray', label: 'Shrink-ray watch', sub: 'Tiny for 30 seconds', icon: '\u231A' },
      { v: 'jet_boots', label: 'Jet boots', sub: 'Float and zoom', icon: '\u{1F97E}' },
      { v: 'robot_buddy', label: 'Pocket robot', sub: 'Beeps and helps', icon: '\u{1F916}' },
      { v: 'lucky_coin', label: 'Lucky coin', sub: 'Always lands heads', icon: '\u{1FA99}' },
      { v: 'umbrella', label: 'Sky umbrella', sub: 'Floats anywhere', icon: '\u2602\uFE0F' },
      { v: 'torch', label: 'Storm torch', sub: 'Cuts through dark', icon: '\u{1F526}' },
      { v: 'music_box', label: 'Music box', sub: 'Calms wild creatures', icon: '\u{1F3B5}' },
      { v: 'tiny_camera', label: 'Tiny camera', sub: 'Records secret clues', icon: '\u{1F4F7}' },
      { v: 'soft_cape', label: 'Soft cape', sub: 'Warm and waterproof', icon: '\u{1F9E3}' },
    ],
  },
  {
    id: 'mood',
    q: 'What kind of story?',
    hint: 'This sets the whole vibe.',
    pool: [
      { v: 'funny', label: 'Silly & funny', sub: 'Lots of jokes', icon: '\u{1F606}' },
      { v: 'brave', label: 'Brave & bold', sub: 'Big adventure', icon: '\u{1F5E1}\uFE0F' },
      { v: 'cozy', label: 'Cozy & kind', sub: 'Warm and gentle', icon: '\u{1FAD6}' },
      { v: 'mystery', label: 'Spooky mystery', sub: '(not too scary)', icon: '\u{1F319}' },
      { v: 'magic', label: 'Magic-feel', sub: 'Wonder & sparkles', icon: '\u2728' },
      { v: 'team', label: 'Team-up story', sub: 'Friends help each other', icon: '\u{1F91D}' },
      { v: 'puzzle', label: 'Brain puzzle', sub: 'Lots to figure out', icon: '\u{1F9E0}' },
      { v: 'racing', label: 'Fast & racing', sub: 'Zoom zoom!', icon: '\u{1F3CE}\uFE0F' },
    ],
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getSessionSetupQuestions(): SetupQuestion[] {
  const counts: Record<string, number> = { setting: 6, problem: 6, item: 6, mood: 5 };
  return SETUP_QUESTIONS_POOL.map((q) => ({
    ...q,
    options: shuffleArray(q.pool).slice(0, counts[q.id] || 6),
  }));
}

export const SETUP_QUESTIONS: SetupQuestion[] = SETUP_QUESTIONS_POOL.map((q) => ({
  ...q,
  options: q.pool,
}));
