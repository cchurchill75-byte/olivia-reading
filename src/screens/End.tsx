import type { Chapter, SessionStats } from '../types';
import { CHARACTERS } from '../data/characters';
import { CharacterChip } from '../data/characters';

export const SETTING_LABEL: Record<string, string> = {
  asteroid_field: 'Asteroid Field',
  crystal_caves: 'Crystal Caves',
  nebula_garden: 'Nebula Garden',
  moon_meadow: 'Moon Meadow',
  space_station: 'Space Station',
  icy_comet: 'Icy Comet',
  jelly_jungle: 'Jelly Jungle',
  thunder_world: 'Thunder World',
  candy_planet: 'Candy Planet',
  deep_ocean: 'Ocean Moon',
  star_train: 'Starlight Train',
  rainbow_reef: 'Rainbow Reef',
};

interface EndSession {
  characterId: string | null;
  setting: string;
  problem: string;
  item: string;
  mood: string;
  chapters: Chapter[];
  stats: SessionStats;
  newSticker?: string;
}

interface EndProps {
  session: EndSession;
  onAgain: () => void;
  onHome: () => void;
}

export default function End({ session, onAgain, onHome }: EndProps) {
  const { characterId, setting, chapters, stats, newSticker } = session;
  const charName = CHARACTERS.find((c) => c.id === characterId)?.name || 'Friend';

  const stickerLibrary = [
    { id: 'first-flight', glyph: '🚀', label: 'First Flight' },
    { id: 'asteroid_field', glyph: '🪨', label: 'Asteroid' },
    { id: 'crystal_caves', glyph: '💎', label: 'Crystal' },
    { id: 'nebula_garden', glyph: '🌸', label: 'Nebula' },
    { id: 'moon_meadow', glyph: '🌕', label: 'Moon' },
    { id: 'space_station', glyph: '🛰️', label: 'Station' },
    { id: 'icy_comet', glyph: '☄️', label: 'Comet' },
    { id: 'word-wizard', glyph: '📖', label: 'Word Wizard' },
  ];

  const earnedSet = new Set(stats.earnedStickers || []);

  return (
    <div className="end-screen">
      <div className="section-head">
        <div>
          <div className="step-tag">★ THE END — FOR NOW</div>
          <h2><span className="stroke">You</span> Did It.</h2>
        </div>
        <div className="row-gap-md">
          <CharacterChip id={characterId || 'rocky'} size={64} />
        </div>
      </div>

      <div className="end-card">
        <div className="ja-stamp">★ THE END ★</div>
        <h2>The {SETTING_LABEL[setting] || 'Adventure'} of {charName}</h2>
        <p className="summary">
          You read {chapters.length} chapters, explored {stats.wordsTapped} words, and got
          {' '}{stats.quizCorrect} of {stats.quizTotal} comprehension questions right.{' '}
          {stats.quizCorrect === stats.quizTotal ? '★ Perfect score!' : 'Great reading.'}
        </p>

        <div className="end-stats">
          <div className="end-stat"><div className="num">{stats.wordCount}</div><div className="lbl">WORDS READ</div></div>
          <div className="end-stat"><div className="num">{stats.timeMins}m</div><div className="lbl">TIME READING</div></div>
          <div className="end-stat"><div className="num">{stats.quizCorrect}/{stats.quizTotal}</div><div className="lbl">CORRECT</div></div>
          <div className="end-stat"><div className="num">+{stats.xpGained}</div><div className="lbl">XP EARNED</div></div>
        </div>

        <div className="sticker-shelf">
          <h4>STICKER SHELF</h4>
          <div className="sticker-row">
            {stickerLibrary.map((s) => {
              const earned = earnedSet.has(s.id);
              const isNew = s.id === newSticker;
              return (
                <div
                  key={s.id}
                  className={`sticker ${earned ? '' : 'locked'} ${isNew ? 'new' : ''}`}
                  title={s.label}
                >
                  {s.glyph}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mini-book">
          <div className="mb-title">{`The ${SETTING_LABEL[setting] || 'Adventure'} of ${charName}`}</div>
          <div className="mb-by">a story by Olivia</div>
          <p className="mb-snip">{chapters[0]?.text?.slice(0, 200) || ''}…</p>
        </div>

        <div className="end-cta">
          <button className="btn gold lg" onClick={onAgain}>★ NEW STORY</button>
          <button className="btn ghost" onClick={onHome}>HOME</button>
          <button className="btn ghost" onClick={() => window.print()}>PRINT 📄</button>
        </div>
      </div>
    </div>
  );
}
