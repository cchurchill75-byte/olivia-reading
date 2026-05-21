import type { Settings as SettingsType } from '../types';

interface SettingsPageProps {
  settings: SettingsType;
  onChange: (key: string, value: unknown) => void;
  onBack: () => void;
}

export default function SettingsPage({ settings, onChange, onBack }: SettingsPageProps) {
  return (
    <div>
      <div className="section-head">
        <div>
          <div className="step-tag">★ SETTINGS</div>
          <h2><span className="stroke">Tweak</span> It.</h2>
          <div className="sub">Change how the stories look and read.</div>
        </div>
        <div className="row-gap-md">
          <button className="btn ghost" onClick={onBack}>← BACK</button>
        </div>
      </div>

      <div className="setup-card" style={{ maxWidth: 640 }}>
        {/* Color Palette */}
        <div className="hb-section">
          <label className="hb-label">★ Color Palette</label>
          <div className="setup-options" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            {[
              { value: 'classic', label: 'Kid Classic', sub: 'Yellow / blue / red' },
              { value: 'sunset', label: 'Sunset', sub: 'Warm tones' },
              { value: 'reef', label: 'Reef', sub: 'Aqua & coral' },
              { value: 'mono', label: 'Sketchbook', sub: 'Mono tones' },
            ].map((opt) => (
              <button
                key={opt.value}
                className={`setup-option ${settings.palette === opt.value ? 'selected' : ''}`}
                onClick={() => onChange('palette', opt.value)}
                style={{ minHeight: 80 }}
              >
                <span className="opt-label">{opt.label}</span>
                <span className="opt-sub">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reading Font */}
        <div className="hb-section" style={{ marginTop: 22 }}>
          <label className="hb-label">★ Reading Font</label>
          <div className="setup-options" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {[
              { value: 'lexend', label: 'Lexend', sub: 'Reading-tuned' },
              { value: 'atkinson', label: 'Atkinson', sub: 'Dyslexia-friendly' },
            ].map((opt) => (
              <button
                key={opt.value}
                className={`setup-option ${settings.fontPreset === opt.value ? 'selected' : ''}`}
                onClick={() => onChange('fontPreset', opt.value)}
                style={{ minHeight: 80 }}
              >
                <span className="opt-label">{opt.label}</span>
                <span className="opt-sub">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Starting Difficulty */}
        <div className="hb-section" style={{ marginTop: 22 }}>
          <label className="hb-label">★ Starting Difficulty</label>
          <div className="setup-options" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            {[
              { value: 'grade_2', label: 'Easy' },
              { value: 'grade_4', label: 'Just Right' },
              { value: 'grade_5', label: 'Hard' },
            ].map((opt) => (
              <button
                key={opt.value}
                className={`setup-option ${settings.baseDifficulty === opt.value ? 'selected' : ''}`}
                onClick={() => onChange('baseDifficulty', opt.value)}
                style={{ minHeight: 60 }}
              >
                <span className="opt-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ramp Toggle */}
        <div className="hb-section" style={{ marginTop: 22 }}>
          <label className="hb-label">★ Difficulty Grows Each Chapter</label>
          <button
            className={`setup-option ${settings.rampDifficulty ? 'selected' : ''}`}
            onClick={() => onChange('rampDifficulty', !settings.rampDifficulty)}
            style={{ minHeight: 50, maxWidth: 200 }}
          >
            <span className="opt-label">{settings.rampDifficulty ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Chapters Per Story */}
        <div className="hb-section" style={{ marginTop: 22 }}>
          <label className="hb-label">★ Chapters Per Story: {settings.chaptersPerStory}</label>
          <div className="setup-options" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`setup-option ${settings.chaptersPerStory === n ? 'selected' : ''}`}
                onClick={() => onChange('chaptersPerStory', n)}
                style={{ minHeight: 50 }}
              >
                <span className="opt-label">{n}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
