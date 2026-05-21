import type { SetupQuestion } from '../types';

interface SetupProps {
  questions: SetupQuestion[];
  stepIdx: number;
  value: string | undefined;
  customValue: string | undefined;
  onChange: (v: string) => void;
  onCustom: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Setup({
  questions,
  stepIdx,
  value,
  customValue,
  onChange,
  onCustom,
  onNext,
  onBack,
}: SetupProps) {
  const q = questions[stepIdx];
  return (
    <div>
      <div className="section-head">
        <div>
          <div className="step-tag">★ STEP {stepIdx + 2} OF {questions.length + 1} — BUILD YOUR STORY</div>
          <h2>Set <span className="stroke">the Stage.</span></h2>
        </div>
        <div className="row-gap-md">
          <button className="btn ghost" onClick={onBack}>← BACK</button>
        </div>
      </div>

      <div className="setup-card">
        <div className="setup-progress">
          {questions.map((_, i) => (
            <div key={i} className={`dot ${i < stepIdx ? 'done' : ''} ${i === stepIdx ? 'active' : ''}`} />
          ))}
        </div>

        <h3 className="setup-q">{q.q}</h3>
        <p className="setup-hint">{q.hint}</p>

        <div className="setup-options">
          {q.options.map((opt) => (
            <button
              key={opt.v}
              className={`setup-option ${value === opt.v ? 'selected' : ''}`}
              onClick={() => onChange(opt.v)}
            >
              <span className="emoji-glyph" aria-hidden="true">{opt.icon}</span>
              <span className="opt-label">{opt.label}</span>
              <span className="opt-sub">{opt.sub}</span>
            </button>
          ))}
          <div className={`setup-option custom ${value === '__custom' ? 'selected' : ''}`}>
            <span className="opt-label" style={{ fontSize: 14, opacity: 0.7, letterSpacing: '0.1em' }}>OR WRITE YOUR OWN</span>
            <input
              placeholder="Type your idea…"
              value={customValue || ''}
              onChange={(e) => onCustom(e.target.value)}
              onFocus={() => onChange('__custom')}
            />
          </div>
        </div>

        <div className="setup-nav">
          <span className="step-label">★ QUESTION {stepIdx + 1} / {questions.length}</span>
          <button className="btn gold" disabled={!value} onClick={onNext}>
            {stepIdx === questions.length - 1 ? 'MAKE MY STORY →' : 'NEXT →'}
          </button>
        </div>
      </div>
    </div>
  );
}
