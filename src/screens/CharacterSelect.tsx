import type { Character } from '../types';
import { RockyArt, MaineCoonArt, BunniforousArt } from '../data/characters';
import { CustomHeroArt } from '../data/heroData';
import { pickerPortrait } from '../lib/illustrate';

interface CharacterSelectProps {
  value: string | null;
  onChange: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  characters: Character[];
  onCreateNew: () => void;
  onEditHero: (hero: Character) => void;
  onDeleteHero: (id: string) => void;
}

export default function CharacterSelect({
  value, onChange, onNext, onBack, characters, onCreateNew, onEditHero, onDeleteHero,
}: CharacterSelectProps) {
  return (
    <div>
      <div className="section-head">
        <div>
          <div className="step-tag">★ CHAPTER ONE — CHOOSE YOUR HERO</div>
          <h2><span className="stroke">Pick Your</span> Hero.</h2>
          <div className="sub">Who's leading the adventure today? Tap a hero to choose, or build your own.</div>
        </div>
        <div className="row-gap-md">
          <button className="btn ghost" onClick={onBack}>← Home</button>
        </div>
      </div>

      <div className="char-grid">
        {characters.map((c) => (
          <button key={c.id} className={`char-card ${value === c.id ? 'selected' : ''}`} onClick={() => onChange(c.id)}>
            <div className="check">✓</div>
            <div className="portrait">
              <div className="halftone-bg"></div>
              <div className="speed"></div>
              {pickerPortrait(c.id)
                ? <img className="portrait-img" src={pickerPortrait(c.id)} alt={c.name} />
                : c.art === 'rocky' ? <RockyArt pose="portrait" />
                : c.art === 'mainecoon' ? <MaineCoonArt pose="portrait" />
                : c.art === 'bunny' ? <div className="photo-frame"><BunniforousArt pose="portrait" /></div>
                : c.art === 'custom' ? <CustomHeroArt hero={c} />
                : null}
              <div className="name-stamp">{c.name.toUpperCase()}</div>
            </div>
            <h3>{c.name}<span className="pronounce">{c.pronounce}</span></h3>
            <p className="tagline">{c.tagline}</p>
            <div className="traits">
              {(c.traits || []).map((t) => <span key={t} className="trait">{t}</span>)}
            </div>
            {c.art === 'custom' && (
              <div className="card-actions">
                <button className="card-mini-btn" onClick={(e) => { e.stopPropagation(); onEditHero(c); }}>✎ edit</button>
                <button className="card-mini-btn danger" onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Remove ${c.name}?`)) onDeleteHero(c.id);
                }}>✕ remove</button>
              </div>
            )}
          </button>
        ))}
        <button className="char-card create-tile" onClick={onCreateNew}>
          <div className="portrait create-portrait">
            <div className="halftone-bg"></div>
            <div className="speed"></div>
            <div className="big-plus">+</div>
          </div>
          <h3>Build a Hero<span className="pronounce">make your own</span></h3>
          <p className="tagline">Mix a shape, colors, and traits. Save your hero for future stories.</p>
          <div className="traits"><span className="trait">NEW</span></div>
        </button>
      </div>

      <div className="setup-nav">
        <span className="step-label">{value ? `★ Hero: ${characters.find((c) => c.id === value)?.name?.toUpperCase() || ''}` : '★ Tap a hero to pick'}</span>
        <button className="btn gold" disabled={!value} onClick={onNext}>NEXT →</button>
      </div>
    </div>
  );
}
