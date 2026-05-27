import { useEffect, useState } from 'react';
import type { Settings as SettingsType } from '../types';

interface UsageData {
  rate: number;
  totalCount: number;
  totalCost: number;
  days: { date: string; count: number; cost: number }[];
  note?: string;
}

function fmtDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: '2px solid var(--ink)', borderRadius: 10, padding: '8px 10px', background: 'var(--paper)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1.1 }}>{value}</div>
      <div className="opt-sub" style={{ fontSize: 11 }}>{label}</div>
    </div>
  );
}

/** Nano Banana image-generation spend, broken out per day (from the Blob cache). */
function UsagePanel() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setErr(null);
    fetch('/api/usage', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => { if (d.error) setErr(String(d.error)); else setData(d as UsageData); })
      .catch(() => setErr('Could not reach the usage service.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  if (loading) return <div className="opt-sub">Loading spend…</div>;
  if (err) return <div className="opt-sub">Couldn’t load spend: {err}</div>;
  if (!data) return null;

  const max = Math.max(0.01, ...data.days.map((d) => d.cost));
  const ym = new Date().toISOString().slice(0, 7); // current month (UTC) YYYY-MM
  const monthCost = data.days.filter((d) => d.date.slice(0, 7) === ym).reduce((s, d) => s + d.cost, 0);
  const projected = data.days.length ? (data.totalCost / data.days.length) * 30 : 0;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 10 }}>
        <Stat label="All-time" value={`$${data.totalCost.toFixed(2)}`} />
        <Stat label="This month" value={`$${monthCost.toFixed(2)}`} />
        <Stat label="Est. / month" value={`~$${projected.toFixed(2)}`} />
      </div>
      <div className="opt-sub" style={{ marginBottom: 10 }}>{data.totalCount} images · ~${data.rate.toFixed(2)} each</div>
      {data.note ? <div className="opt-sub">{data.note}</div> : null}
      {!data.note && data.days.length === 0 ? <div className="opt-sub">No images generated yet.</div> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.days.map((d) => (
          <div key={d.date} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 60, fontSize: 13 }}>{fmtDay(d.date)}</span>
            <div style={{ flex: 1, background: 'var(--paper-warm)', border: '2px solid var(--ink)', borderRadius: 6, height: 18, overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(6, (d.cost / max) * 100)}%`, height: '100%', background: 'var(--accent)' }}></div>
            </div>
            <span style={{ width: 56, textAlign: 'right', fontWeight: 600 }}>${d.cost.toFixed(2)}</span>
            <span style={{ width: 58, textAlign: 'right', fontSize: 12, color: 'var(--ink-soft)' }}>{d.count} img</span>
          </div>
        ))}
      </div>
      <div className="opt-sub" style={{ marginTop: 10 }}>
        ~${data.rate.toFixed(2)}/image. “Est./month” = average spend on reading days × 30. Re-reading a story is free (cached).
      </div>
      <button className="btn ghost" style={{ marginTop: 10 }} onClick={load}>↻ Refresh</button>
    </div>
  );
}

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

        {/* Nano Banana image spend */}
        <div className="hb-section" style={{ marginTop: 22 }}>
          <label className="hb-label">★ Image Spend (Nano Banana)</label>
          <UsagePanel />
        </div>
      </div>
    </div>
  );
}
