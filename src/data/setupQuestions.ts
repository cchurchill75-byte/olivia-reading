import type { SetupOption, SetupQuestion } from '../types';

/* Setup option pools.
 *
 * Each option may carry a `for: [characterId, ...]` tag — if present, the option
 * is only offered when one of those characters is the selected hero. Options
 * without `for` are universal. At session time we filter the pool to options
 * that match the chosen hero (plus universal ones) and sample N of them.
 *
 * Per-character flavor:
 *   rocky        -> outer-space adventures, planet Erid, fellow Eridians
 *   bunniforous  -> mischief / messy household & neighborhood mayhem
 *   mainecoon    -> cozy detective mysteries
 */
const SETUP_QUESTIONS_POOL: Omit<SetupQuestion, 'options'>[] = [
  {
    id: 'setting',
    q: 'Where does it begin?',
    hint: 'Pick the place your adventure starts.',
    pool: [
      // Rocky — space
      { v: 'asteroid_field', label: 'Asteroid Field', sub: 'Big floating space rocks', icon: '\u{1FAA8}', for: ['rocky'] },
      { v: 'crystal_caves', label: 'Crystal Caves', sub: 'A moon made of glass', icon: '\u{1F48E}', for: ['rocky'] },
      { v: 'nebula_garden', label: 'Nebula Garden', sub: 'Pink clouds, glowing flowers', icon: '\u{1F338}', for: ['rocky'] },
      { v: 'moon_meadow', label: 'Moon Meadow', sub: 'Bouncy grass, two moons', icon: '\u{1F315}', for: ['rocky'] },
      { v: 'space_station', label: 'Old Space Station', sub: 'Hallways, beeping doors', icon: '\u{1F6F0}️', for: ['rocky'] },
      { v: 'icy_comet', label: 'Icy Comet', sub: 'Ride it through the dark', icon: '☄️', for: ['rocky'] },
      { v: 'deep_ocean', label: 'Ocean Moon', sub: 'Glowing fish, dark water', icon: '\u{1F420}', for: ['rocky'] },
      { v: 'star_train', label: 'Starlight Train', sub: 'Hops planet to planet', icon: '\u{1F682}', for: ['rocky'] },
      { v: 'planet_erid', label: 'Planet Erid', sub: "Rocky's rocky home world", icon: '\u{1FAA8}', for: ['rocky'] },
      { v: 'eridian_canyon', label: 'Eridian Canyon', sub: 'Cliffs of singing stone', icon: '\u{1F3DC}️', for: ['rocky'] },
      { v: 'ringed_planet', label: 'Ringed Planet', sub: 'Surf the bright rings', icon: '\u{1FA90}', for: ['rocky'] },
      { v: 'eridian_market', label: 'Eridian Market', sub: 'Stalls of glowing crystals', icon: '\u{1F3EA}', for: ['rocky'] },

      // Bunniforous — household / neighborhood mischief
      { v: 'sunny_kitchen', label: 'Sunny Kitchen', sub: 'Jars, flour, and trouble', icon: '\u{1F373}', for: ['bunniforous'] },
      { v: 'backyard_garden', label: 'Backyard Garden', sub: 'Carrots and mud puddles', icon: '\u{1F955}', for: ['bunniforous'] },
      { v: 'treehouse_loft', label: 'Treehouse Loft', sub: 'Secret hideout up high', icon: '\u{1F3E1}', for: ['bunniforous'] },
      { v: 'dusty_attic', label: 'Dusty Attic', sub: 'Old trunks and cobwebs', icon: '\u{1F4E6}', for: ['bunniforous'] },
      { v: 'neighborhood_park', label: 'Neighborhood Park', sub: 'Slides, sand, swings', icon: '\u{1F3DE}️', for: ['bunniforous'] },
      { v: 'farmers_barn', label: "Farmer's Barn", sub: 'Hay bales and animals', icon: '\u{1F69C}', for: ['bunniforous'] },
      { v: 'birthday_party', label: 'Birthday Party', sub: 'Cake! balloons!', icon: '\u{1F382}', for: ['bunniforous'] },
      { v: 'school_classroom', label: 'School Classroom', sub: 'Quiet… for now', icon: '\u{1F3EB}', for: ['bunniforous'] },
      { v: 'corner_bakery', label: 'Corner Bakery', sub: 'Warm pies, open windows', icon: '\u{1F950}', for: ['bunniforous'] },

      // Biscuits (mainecoon) — detective places
      { v: 'village_square', label: 'Cozy Village Square', sub: 'Stalls and gossip', icon: '\u{1F3D8}️', for: ['mainecoon'] },
      { v: 'old_library', label: 'Old Library', sub: 'Clues hidden in books', icon: '\u{1F4DA}', for: ['mainecoon'] },
      { v: 'foggy_harbor', label: 'Foggy Harbor', sub: 'Boats vanish in mist', icon: '⛵', for: ['mainecoon'] },
      { v: 'grand_manor', label: 'Grand Manor', sub: 'Long halls and secrets', icon: '\u{1F3DB}️', for: ['mainecoon'] },
      { v: 'bakery_dawn', label: 'Bakery at Dawn', sub: 'Warm bread, missing pies', icon: '\u{1F950}', for: ['mainecoon'] },
      { v: 'antique_shop', label: 'Antique Shop', sub: 'Old things, older secrets', icon: '\u{1F570}️', for: ['mainecoon'] },
      { v: 'rainy_alley', label: 'Rainy Alley', sub: 'Glistening clues underfoot', icon: '\u{1F327}️', for: ['mainecoon'] },
      { v: 'museum_hall', label: 'Quiet Museum', sub: 'A display case is empty…', icon: '\u{1F5FF}', for: ['mainecoon'] },

      // Universal (whimsy any hero can drop into)
      { v: 'jelly_jungle', label: 'Jelly Jungle', sub: 'Wiggly trees, soft floor', icon: '\u{1F333}' },
      { v: 'thunder_world', label: 'Thunder World', sub: 'Sky-cracking storms', icon: '⚡' },
      { v: 'candy_planet', label: 'Candy Planet', sub: 'Sugar rivers, gumdrop hills', icon: '\u{1F36D}' },
      { v: 'rainbow_reef', label: 'Rainbow Reef', sub: 'Coral that glows', icon: '\u{1F308}' },
    ],
  },
  {
    id: 'problem',
    q: 'What is the problem?',
    hint: 'Every adventure needs trouble. Pick yours.',
    pool: [
      // Rocky — space-y trouble
      { v: 'broken_ship', label: 'The ship is broken', sub: 'Fix it fast', icon: '\u{1F527}', for: ['rocky'] },
      { v: 'mystery_signal', label: 'A mystery signal', sub: "Who's calling us?", icon: '\u{1F4E1}', for: ['rocky'] },
      { v: 'wrong_planet', label: 'Wrong planet', sub: 'How do we get home?', icon: '\u{1F30D}', for: ['rocky'] },
      { v: 'space_distress', label: 'Distress Signal', sub: 'A friend needs help out there', icon: '\u{1F198}', for: ['rocky'] },
      { v: 'asteroid_shower', label: 'Asteroid Shower', sub: 'Big rocks, fast!', icon: '☄️', for: ['rocky'] },
      { v: 'lost_eridian', label: 'Lost Eridian', sub: 'A young Eridian wandered off', icon: '\u{1FAA8}', for: ['rocky'] },

      // Bunny — mischief / mess problems
      { v: 'spilled_paint', label: 'Spilled Paint', sub: 'A rainbow on the floor!', icon: '\u{1F3A8}', for: ['bunniforous'] },
      { v: 'jar_avalanche', label: 'Jar Avalanche', sub: 'The whole shelf came down', icon: '\u{1FAD9}', for: ['bunniforous'] },
      { v: 'mud_tracks', label: 'Mud Tracks', sub: 'Footprints everywhere!', icon: '\u{1F43E}', for: ['bunniforous'] },
      { v: 'cake_disaster', label: 'Cake Disaster', sub: 'Frosting EVERYWHERE', icon: '\u{1F9C1}', for: ['bunniforous'] },
      { v: 'bubbles_loose', label: 'Bubbles Loose', sub: 'The bath got everyone', icon: '\u{1FAE7}', for: ['bunniforous'] },
      { v: 'carrot_heist', label: 'The Carrot Heist', sub: 'Who took ALL the carrots?', icon: '\u{1F955}', for: ['bunniforous'] },

      // Biscuits — detective cases
      { v: 'missing_heirloom', label: 'Missing Heirloom', sub: 'A precious locket vanished', icon: '\u{1F50D}', for: ['mainecoon'] },
      { v: 'mysterious_note', label: 'Mysterious Note', sub: 'Slipped under the door', icon: '✉️', for: ['mainecoon'] },
      { v: 'locked_room', label: 'Locked-Room Puzzle', sub: 'How did it happen?', icon: '\u{1F5DD}️', for: ['mainecoon'] },
      { v: 'phantom_pawprints', label: 'Phantom Paw-prints', sub: 'Who walked here last night?', icon: '\u{1F43E}', for: ['mainecoon'] },
      { v: 'bakery_riddle', label: 'Bakery Riddle', sub: 'The pies keep vanishing', icon: '\u{1F967}', for: ['mainecoon'] },
      { v: 'missing_neighbor', label: 'Missing Neighbor', sub: "No one's seen them all day", icon: '\u{1F6AA}', for: ['mainecoon'] },

      // Universal trouble
      { v: 'lost_friend', label: 'A friend is lost', sub: 'Find them before dark', icon: '\u{1F52D}' },
      { v: 'scary_creature', label: 'A scary creature', sub: '(maybe just lonely?)', icon: '\u{1F47E}' },
      { v: 'trapped', label: 'Trapped somewhere', sub: 'Find the way out', icon: '\u{1F6AA}' },
      { v: 'weird_weather', label: 'Weird weather', sub: 'Sky doing strange things', icon: '\u{1F32A}️' },
      { v: 'missing_pet', label: 'Pet ran off', sub: 'Help it find its way', icon: '\u{1F43E}' },
      { v: 'puzzle_door', label: 'A puzzle door', sub: 'Crack the code', icon: '\u{1F9E9}' },
      { v: 'secret_map', label: 'A secret map', sub: 'Where does it lead?', icon: '\u{1F5FA}️' },
    ],
  },
  {
    id: 'item',
    q: 'What do you bring?',
    hint: 'Pick one cool thing for your pack.',
    pool: [
      // Rocky
      { v: 'whistle', label: 'Space whistle', sub: 'Calls friendly aliens', icon: '\u{1FA88}', for: ['rocky'] },
      { v: 'shrink_ray', label: 'Shrink-ray watch', sub: 'Tiny for 30 seconds', icon: '⌚', for: ['rocky'] },
      { v: 'jet_boots', label: 'Jet boots', sub: 'Float and zoom', icon: '\u{1F97E}', for: ['rocky'] },
      { v: 'robot_buddy', label: 'Pocket robot', sub: 'Beeps and helps', icon: '\u{1F916}', for: ['rocky'] },
      { v: 'star_chart', label: 'Star chart', sub: 'Maps every system', icon: '✨', for: ['rocky'] },
      { v: 'erid_shard', label: 'Erid Shard', sub: 'Glows near Eridians', icon: '\u{1FAA8}', for: ['rocky'] },

      // Bunny
      { v: 'mop_bucket', label: 'Mop & Bucket', sub: 'For after the mess', icon: '\u{1F9F9}', for: ['bunniforous'] },
      { v: 'paint_jar', label: 'Big Paint Jar', sub: "Tip it… or don't", icon: '\u{1F3A8}', for: ['bunniforous'] },
      { v: 'big_basket', label: 'Big Basket', sub: 'Holds anything', icon: '\u{1F9FA}', for: ['bunniforous'] },
      { v: 'sticky_tape', label: 'Sticky Tape', sub: 'Fixes most things', icon: '\u{1F4CE}', for: ['bunniforous'] },
      { v: 'bubble_wand', label: 'Bubble Wand', sub: 'Lots of bubbles', icon: '\u{1FAE7}', for: ['bunniforous'] },
      { v: 'snack_pack', label: 'Endless snack pack', sub: 'Never goes empty', icon: '\u{1F955}', for: ['bunniforous'] },

      // Biscuits
      { v: 'magnifier', label: 'Magnifying Glass', sub: 'Find every clue', icon: '\u{1F50E}', for: ['mainecoon'] },
      { v: 'tiny_camera', label: 'Tiny camera', sub: 'Records secret clues', icon: '\u{1F4F7}', for: ['mainecoon'] },
      { v: 'notebook', label: 'Pocket Notebook', sub: 'Write the clues down', icon: '\u{1F4D3}', for: ['mainecoon'] },
      { v: 'detective_hat', label: 'Detective Hat', sub: 'Looks the part', icon: '\u{1F3A9}', for: ['mainecoon'] },
      { v: 'lantern', label: 'Old Lantern', sub: 'For dim corners', icon: '\u{1F3EE}', for: ['mainecoon'] },
      { v: 'glow_map', label: 'Glowing map', sub: 'Shows hidden places', icon: '\u{1F5FA}️', for: ['mainecoon'] },

      // Universal
      { v: 'lucky_coin', label: 'Lucky coin', sub: 'Always lands heads', icon: '\u{1FA99}' },
      { v: 'umbrella', label: 'Sky umbrella', sub: 'Floats anywhere', icon: '☂️' },
      { v: 'torch', label: 'Storm torch', sub: 'Cuts through dark', icon: '\u{1F526}' },
      { v: 'music_box', label: 'Music box', sub: 'Calms wild creatures', icon: '\u{1F3B5}' },
      { v: 'soft_cape', label: 'Soft cape', sub: 'Warm and waterproof', icon: '\u{1F9E3}' },
    ],
  },
  {
    id: 'mood',
    q: 'What kind of story?',
    hint: 'This sets the whole vibe.',
    pool: [
      { v: 'funny', label: 'Silly & funny', sub: 'Lots of jokes', icon: '\u{1F606}' },
      { v: 'brave', label: 'Brave & bold', sub: 'Big adventure', icon: '\u{1F5E1}️' },
      { v: 'cozy', label: 'Cozy & kind', sub: 'Warm and gentle', icon: '\u{1FAD6}' },
      { v: 'mystery', label: 'Spooky mystery', sub: '(not too scary)', icon: '\u{1F319}' },
      { v: 'magic', label: 'Magic-feel', sub: 'Wonder & sparkles', icon: '✨' },
      { v: 'team', label: 'Team-up story', sub: 'Friends help each other', icon: '\u{1F91D}' },
      { v: 'puzzle', label: 'Brain puzzle', sub: 'Lots to figure out', icon: '\u{1F9E0}' },
      { v: 'racing', label: 'Fast & racing', sub: 'Zoom zoom!', icon: '\u{1F3CE}️' },
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

function fitsCharacter(opt: SetupOption, characterId?: string | null): boolean {
  if (!opt.for || opt.for.length === 0) return true; // universal
  return !!(characterId && opt.for.includes(characterId));
}

/**
 * Build the per-session setup questions, filtered/biased to the chosen hero.
 * Options without a `for` tag are universal; tagged options only appear when
 * their character is picked. If the filtered pool can't fill the requested
 * count, the remaining slots are back-filled from the rest of the pool.
 */
export function getSessionSetupQuestions(characterId?: string | null): SetupQuestion[] {
  const counts: Record<string, number> = { setting: 6, problem: 6, item: 6, mood: 5 };
  return SETUP_QUESTIONS_POOL.map((q) => {
    const fits = q.pool.filter((o) => fitsCharacter(o, characterId));
    const target = counts[q.id] || 6;
    const picked = fits.length >= target
      ? fits
      : [...fits, ...q.pool.filter((o) => !fits.includes(o))];
    return { ...q, options: shuffleArray(picked).slice(0, target) };
  });
}

export const SETUP_QUESTIONS: SetupQuestion[] = SETUP_QUESTIONS_POOL.map((q) => ({ ...q, options: q.pool }));
