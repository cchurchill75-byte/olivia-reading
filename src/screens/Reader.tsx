import { useState, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import type { Chapter, Choice } from '../types';
import { tokenize, syllabify } from '../lib/tokenize';
import { speakWord } from '../lib/tts';
import ComicPage from '../components/ComicPage';

interface ReaderProps {
  chapter: Chapter;
  chapterIdx: number;
  totalChapters: number;
  characterId: string | null;
  setting: string;
  onAdvance: (opts: { ending?: boolean; choice?: Choice }) => void;
  onWordDefine: (word: string) => Promise<string>;
  onWordTapped: (word: string, kind: string) => void;
  fontStep: number;
  setFontStep: (fn: (v: number) => number) => void;
  highlightTricky: boolean;
  setHighlightTricky: (fn: (v: boolean) => boolean) => void;
  difficultyLevel: number;
}

export default function Reader({
  chapter,
  chapterIdx,
  totalChapters,
  characterId,
  setting,
  onAdvance,
  onWordDefine,
  onWordTapped,
  fontStep,
  setFontStep,
  highlightTricky,
  setHighlightTricky,
  difficultyLevel,
}: ReaderProps) {
  const [popover, setPopover] = useState<PopoverData | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [tappedWords, setTappedWords] = useState<Set<string>>(new Set());
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPopover(null);
    setQuizAnswered(null);
    setSelectedChoice(null);
    setTappedWords(new Set());
  }, [chapter]);

  useEffect(() => {
    const sizes = [18, 20, 22, 24, 28];
    document.documentElement.style.setProperty('--reader-size', sizes[fontStep] + 'px');
  }, [fontStep]);

  const handleWordClick = useCallback(async (e: React.MouseEvent<HTMLSpanElement>, word: string) => {
    const cleaned = word.replace(/[^a-zA-Z\-']/g, '').toLowerCase();
    if (!cleaned) return;
    speakWord(cleaned);

    const target = e.target as HTMLElement;
    target.classList.remove('twinkle');
    void target.offsetWidth;
    target.classList.add('twinkle');
    setTimeout(() => target.classList.remove('twinkle'), 600);

    const rect = target.getBoundingClientRect();
    const cardRect = cardRef.current!.getBoundingClientRect();
    const x = rect.left - cardRect.left + rect.width / 2;
    const y = rect.bottom - cardRect.top + 12;
    const inDict = (chapter.glossary || []).find((g) => g.word.toLowerCase() === cleaned);

    const isFirstTap = !tappedWords.has(cleaned);
    if (isFirstTap) {
      const xp = inDict ? 5 : 2;
      const docX = rect.left + rect.width / 2;
      const docY = rect.top;
      window.__rewards?.fly({ x: docX, y: docY, text: `+${xp} XP`, kind: 'xp' });
      if (inDict) {
        window.__rewards?.fly({ x: docX + 30, y: docY + 10, text: '+1 ★', kind: 'coin' });
      }
      onWordTapped?.(cleaned, inDict ? 'glossary' : 'tap');
      setTappedWords((s) => new Set([...s, cleaned]));
    }

    setPopover({
      word: cleaned,
      x,
      y,
      syll: inDict ? inDict.syll : syllabify(cleaned),
      def: inDict ? inDict.def : 'Tap the speaker to hear it again.',
      loading: !inDict,
      xpEarned: isFirstTap,
    });

    if (!inDict) {
      const def = await onWordDefine(cleaned);
      setPopover((p) => p && p.word === cleaned ? { ...p, def, loading: false } : p);
    }
  }, [chapter, onWordDefine, tappedWords, onWordTapped]);

  const readAloud = () => {
    const text = chapter.text.replace(/\s+/g, ' ').trim();
    speakWord(text);
  };

  const isLast = chapterIdx === totalChapters - 1;
  const trickySet = useMemo(() => {
    const s = new Set<string>();
    (chapter.glossary || []).forEach((g) => s.add(g.word.toLowerCase()));
    return s;
  }, [chapter]);

  return (
    <div className="reader">
      <div className="reader-head">
        <div className="row-gap-md">
          <div className="chapter-tag">CH. {chapterIdx + 1} / {totalChapters}</div>
          <div className="difficulty-bar" title="Difficulty">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`pip ${i < difficultyLevel ? 'on' : ''}`}></div>
            ))}
          </div>
        </div>
        <div className="reader-tools">
          <button className="tool-btn" onClick={readAloud}>
            <span className="ico">🔊</span> READ
          </button>
          <button className={`tool-btn ${highlightTricky ? 'active' : ''}`} onClick={() => setHighlightTricky((v) => !v)}>
            <span className="ico">✨</span> TRICKY
          </button>
          <div className="font-step" title="Text size">
            <button onClick={() => setFontStep((v) => Math.max(0, v - 1))}>A−</button>
            <button onClick={() => setFontStep((v) => Math.min(4, v + 1))}>A+</button>
          </div>
        </div>
      </div>

      <div className="story-card" ref={cardRef}>
        <ComicPage
          chapter={chapter}
          characterId={characterId || 'rocky'}
          setting={setting}
          chapterIdx={chapterIdx}
          totalChapters={totalChapters}
        />

        <div className="story-body">
          <h3 className="chapter-title">{chapter.title}</h3>
          <div className="story-text">
            {chapter.text.split('\n\n').map((para, pi) => (
              <p key={pi}>
                {tokenize(para).map((tok, i) => {
                  if (tok.kind === 'word') {
                    const isTricky = highlightTricky && trickySet.has(tok.text.toLowerCase().replace(/[^a-z\-']/g, ''));
                    return (
                      <span
                        key={i}
                        className={`w ${isTricky ? 'tricky' : ''}`}
                        onClick={(e) => handleWordClick(e, tok.text)}
                      >{tok.text}</span>
                    );
                  }
                  return <span key={i}>{tok.text}</span>;
                })}
              </p>
            ))}
          </div>

          {popover && (
            <WordPopover
              data={popover}
              onClose={() => setPopover(null)}
              onSpeak={() => speakWord(popover.word)}
            />
          )}
        </div>
      </div>

      <div className="reader-foot">
        <div className="hint">★ TAP ANY WORD TO HEAR IT</div>
        <div className="row-gap-md">
          {quizAnswered === null && (
            <button className="btn" onClick={() => setQuizAnswered('__open')}>
              CHECK WHAT I READ →
            </button>
          )}
        </div>
      </div>

      {quizAnswered !== null && (
        <QuizPanel
          quiz={chapter.quiz}
          onContinue={() => {
            if (isLast) onAdvance({ ending: true });
            else setSelectedChoice('__open');
          }}
          isLast={isLast}
        />
      )}

      {selectedChoice !== null && !isLast && (
        <ChoicePanel
          choices={chapter.choices || []}
          onPick={(c) => onAdvance({ choice: c })}
        />
      )}
    </div>
  );
}

/* ---- QuizPanel ---- */
interface QuizPanelProps {
  quiz: Chapter['quiz'];
  onContinue: () => void;
  isLast: boolean;
}

function QuizPanel({ quiz, onContinue, isLast }: QuizPanelProps) {
  const [picked, setPicked] = useState<number | null>(null);
  if (!quiz) return null;
  const correctIdx = quiz.correct;

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === correctIdx;
    document.body.dispatchEvent(new CustomEvent('__olivia_quiz', { detail: { correct } }));
    if (correct) {
      window.__rewards?.sfx('DOSHU!!', 'gold');
      const center = window.innerWidth / 2;
      const top = 120;
      window.__rewards?.fly({ x: center, y: top, text: '+25 XP', kind: 'xp' });
      window.__rewards?.fly({ x: center + 80, y: top + 14, text: '+5 ★', kind: 'coin' });
    } else {
      window.__rewards?.sfx('GUH!', 'red');
    }
  };

  return (
    <div className="quiz-panel">
      <h4>QUICK CHECK</h4>
      <p className="lead">{quiz.q}</p>
      <div className="quiz-options">
        {quiz.options.map((opt, i) => {
          let cls = 'quiz-opt';
          if (picked !== null) {
            if (i === correctIdx) cls += ' correct';
            else if (i === picked) cls += ' wrong';
          }
          return (
            <button key={i} className={cls} onClick={() => handlePick(i)}>{opt}</button>
          );
        })}
      </div>
      {picked !== null && (
        <>
          <div className={`quiz-feedback ${picked === correctIdx ? '' : 'miss'}`}>
            {picked === correctIdx
              ? <><span className="big">YES!</span>{quiz.explain || 'Great reading.'}</>
              : <><span className="big">NOT YET —</span>{quiz.explain || 'The right answer is: ' + quiz.options[correctIdx]}</>}
          </div>
          <div style={{ marginTop: 14, textAlign: 'right' }}>
            <button className="btn gold" onClick={onContinue}>
              {isLast ? 'FINISH STORY →' : 'KEEP GOING →'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---- ChoicePanel ---- */
function ChoicePanel({ choices, onPick }: { choices: Choice[]; onPick: (c: Choice) => void }) {
  return (
    <div className="choice-panel">
      <h4>YOU DECIDE WHAT HAPPENS NEXT</h4>
      <p className="lead">Your choice changes the story. There's no wrong answer.</p>
      <div className="choice-grid">
        {choices.map((c, i) => (
          <button key={i} className="choice-btn" onClick={() => onPick(c)}>
            <span className="dot">{String.fromCharCode(65 + i)}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---- WordPopover ---- */
interface PopoverData {
  word: string;
  x: number;
  y: number;
  syll: string;
  def: string;
  loading: boolean;
  xpEarned: boolean;
}

function WordPopover({ data, onClose, onSpeak }: { data: PopoverData; onClose: () => void; onSpeak: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} className="word-popover" style={{ left: Math.max(20, data.x - 150), top: data.y }}>
      {data.xpEarned && <div className="reward-tick">+XP</div>}
      <div className="ww">{data.word}</div>
      <div className="syll">{data.syll}</div>
      <div className="def">{data.loading ? 'Looking it up…' : data.def}</div>
      <div className="row">
        <button className="mini" onClick={onSpeak}>🔊 HEAR IT</button>
        <button className="mini ghost" onClick={onClose}>CLOSE</button>
      </div>
    </div>
  );
}
