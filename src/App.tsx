import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Chapter, Character, Choice, Settings, SessionStats, SetupQuestion, Stage } from './types';
import { claudeComplete } from './lib/claude';
import { illustratePanel, characterSupportsIllustration, shipSceneRef } from './lib/illustrate';
import { levelFromXp, xpProgress } from './state/rewards';
import { loadInt, loadJson, saveInt, saveJson } from './state/persist';
import { getSessionSetupQuestions } from './data/setupQuestions';
import { CHARACTERS } from './data/characters';
import { CharacterChip } from './data/characters';
import { loadHeroes, saveHero, deleteHero } from './data/heroData';
import { HeroBuilder } from './data/heroData';
import RewardBus from './components/RewardBus';
import ComboMeter from './components/ComboMeter';
import Welcome from './screens/Welcome';
import CharacterSelect from './screens/CharacterSelect';
import Setup from './screens/Setup';
import Loading from './screens/Loading';
import Reader from './screens/Reader';
import End, { SETTING_LABEL } from './screens/End';
import SettingsPage from './settings/Settings';

/* =====================================================
   useHudBump — retrigger a CSS bump anim when value changes
===================================================== */
function useHudBump(value: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    if (value === prev.current) return;
    prev.current = value;
    const el = ref.current;
    if (!el) return;
    el.classList.remove('bumping');
    void el.offsetWidth;
    el.classList.add('bumping');
    const t = setTimeout(() => el.classList.remove('bumping'), 500);
    return () => clearTimeout(t);
  }, [value]);
  return ref;
}

/* =====================================================
   Default settings
===================================================== */
const DEFAULT_SETTINGS: Settings = {
  fontPreset: 'lexend',
  baseDifficulty: 'grade_4',
  rampDifficulty: true,
  chaptersPerStory: 3,
  showXpFlash: true,
  palette: 'classic',
};

/* =====================================================
   Main App
===================================================== */
export default function App() {
  // Settings
  const [settings, setSettings] = useState<Settings>(() => loadJson('olivia.settings', DEFAULT_SETTINGS));
  const setSettingValue = useCallback((key: string, value: unknown) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveJson('olivia.settings', next);
      return next;
    });
  }, []);

  const [stage, setStage] = useState<Stage>('welcome');
  const [prevStage, setPrevStage] = useState<Stage>('welcome');
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [setupStep, setSetupStep] = useState(0);
  const [setupAnswers, setSetupAnswers] = useState<Record<string, string>>({});
  const [setupCustom, setSetupCustom] = useState<Record<string, string>>({});
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState('Mixing your story…');

  // custom heroes
  const [customHeroes, setCustomHeroes] = useState<Character[]>(() => loadHeroes());
  const [editingHero, setEditingHero] = useState<Character | null>(null);
  const allCharacters = useMemo(() => [...CHARACTERS, ...customHeroes], [customHeroes]);

  // session setup questions
  const [sessionSetup, setSessionSetup] = useState<SetupQuestion[]>(() => getSessionSetupQuestions());

  const [fontStep, setFontStep] = useState(2);
  const [highlightTricky, setHighlightTricky] = useState(true);

  // session stats
  const [stats, setStats] = useState<SessionStats>({
    wordCount: 0, wordsTapped: 0, quizCorrect: 0, quizTotal: 0, timeMins: 0, xpGained: 0,
  });
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());

  // persistent reward state
  const [xp, setXp] = useState(() => loadInt('olivia.xp'));
  const [coins, setCoins] = useState(() => loadInt('olivia.coins'));
  const [streak, setStreak] = useState(() => loadInt('olivia.streak'));
  const [allStickers, setAllStickers] = useState<string[]>(() => loadJson('olivia.stickers', []));
  const [earnedAchievements, setEarnedAchievements] = useState<string[]>(() => loadJson('olivia.achievements', []));

  // combo tracking
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [levelUpAt, setLevelUpAt] = useState<number | null>(null);

  // font preset
  useEffect(() => {
    document.body.classList.toggle('font-dys', settings.fontPreset === 'atkinson');
  }, [settings.fontPreset]);

  // comic palette swap
  useEffect(() => {
    const palettes: Record<string, Record<string, string>> = {
      classic: { '--c-yellow': '#ffd84d', '--c-blue': '#6fbef0', '--c-red': '#ff6b4a', '--c-mint': '#5cc287', '--c-pink': '#ffa3c2', '--c-lilac': '#8e7cf0', '--c-tang': '#ffb74a', '--c-azure': '#4a92d8', '--c-night': '#2a2440', '--paper': '#f5ecd6', '--bubble': '#fffaef' },
      sunset: { '--c-yellow': '#ffd166', '--c-blue': '#ef6e6c', '--c-red': '#c44569', '--c-mint': '#f6a26e', '--c-pink': '#ffc8a8', '--c-lilac': '#4b3a5a', '--c-tang': '#e07a5f', '--c-azure': '#8e3a59', '--c-night': '#2d1b3a', '--paper': '#f8e9d2', '--bubble': '#fff5e6' },
      reef: { '--c-yellow': '#f7d35c', '--c-blue': '#3ec1d3', '--c-red': '#ff7e6b', '--c-mint': '#4cd4a8', '--c-pink': '#ffb3ba', '--c-lilac': '#5c6cd1', '--c-tang': '#ffaa5b', '--c-azure': '#2b8aa5', '--c-night': '#1e3a52', '--paper': '#eef3ea', '--bubble': '#fffefb' },
      mono: { '--c-yellow': '#ecdfb5', '--c-blue': '#c9c2b3', '--c-red': '#7a7368', '--c-mint': '#b8b0a0', '--c-pink': '#d8cfbf', '--c-lilac': '#5e5849', '--c-tang': '#a89e88', '--c-azure': '#666057', '--c-night': '#262320', '--paper': '#efe8d4', '--bubble': '#fcf8ec' },
    };
    const p = palettes[settings.palette] || palettes.classic;
    Object.entries(p).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  }, [settings.palette]);

  // persist
  useEffect(() => { saveInt('olivia.xp', xp); }, [xp]);
  useEffect(() => { saveInt('olivia.coins', coins); }, [coins]);
  useEffect(() => { saveJson('olivia.stickers', allStickers); }, [allStickers]);
  useEffect(() => { saveJson('olivia.achievements', earnedAchievements); }, [earnedAchievements]);

  /* ---------- reward helpers ---------- */
  const grantXp = useCallback((n: number) => {
    setXp((prev) => {
      const next = prev + n;
      const oldLvl = levelFromXp(prev);
      const newLvl = levelFromXp(next);
      if (newLvl > oldLvl) {
        setLevelUpAt(newLvl);
        setTimeout(() => setLevelUpAt(null), 2200);
      }
      return next;
    });
    setStats((s) => ({ ...s, xpGained: s.xpGained + n }));
  }, []);

  const grantCoins = useCallback((n: number) => setCoins((c) => c + n), []);

  const grantAchievement = useCallback((id: string, icon: string, label: string, title: string) => {
    setEarnedAchievements((arr) => {
      if (arr.includes(id)) return arr;
      window.__rewards?.achievement(icon, label, title);
      grantCoins(5);
      return [...arr, id];
    });
  }, [grantCoins]);

  /* ---------- flow ---------- */
  const startNew = () => {
    setCharacterId(null);
    setSetupStep(0);
    setSetupAnswers({});
    setSetupCustom({});
    setChapters([]);
    setCurrentChapterIdx(0);
    setStats({ wordCount: 0, wordsTapped: 0, quizCorrect: 0, quizTotal: 0, timeMins: 0, xpGained: 0 });
    setSessionStartTime(Date.now());
    setCombo(0);
    setBestCombo(0);
    setSessionSetup(getSessionSetupQuestions());
    setStage('character');
  };

  const goSetup = () => setStage('setup');
  const advanceSetup = () => {
    if (setupStep < sessionSetup.length - 1) setSetupStep((s) => s + 1);
    else generateFirstChapter();
  };
  const backSetup = () => {
    if (setupStep === 0) setStage('character');
    else setSetupStep((s) => s - 1);
  };

  /* ---------- hero builder ---------- */
  const openHeroBuilder = (hero: Character | null = null) => {
    setEditingHero(hero);
    setStage('hero_builder');
  };
  const handleSaveHero = (hero: Character) => {
    const heroes = saveHero(hero);
    setCustomHeroes(heroes);
    setCharacterId(hero.id);
    setEditingHero(null);
    setStage('character');
    window.__rewards?.sfx('DOSHU!!', 'gold');
  };
  const handleDeleteHero = (id: string) => {
    const heroes = deleteHero(id);
    setCustomHeroes(heroes);
    if (characterId === id) setCharacterId(null);
  };

  /* ---------- Claude integration ---------- */
  const buildContext = () => {
    const c = allCharacters.find((x) => x.id === characterId);
    const settingObj = sessionSetup[0].pool.find((o) => o.v === setupAnswers.setting);
    const problemObj = sessionSetup[1].pool.find((o) => o.v === setupAnswers.problem);
    const itemObj = sessionSetup[2].pool.find((o) => o.v === setupAnswers.item);
    const moodObj = sessionSetup[3].pool.find((o) => o.v === setupAnswers.mood);
    return {
      character: c,
      setting: setupCustom.setting && setupAnswers.setting === '__custom' ? setupCustom.setting : (settingObj?.label || 'the stars'),
      problem: setupCustom.problem && setupAnswers.problem === '__custom' ? setupCustom.problem : (problemObj?.label || 'a mystery'),
      item: setupCustom.item && setupAnswers.item === '__custom' ? setupCustom.item : (itemObj?.label || 'a glowing map'),
      mood: setupCustom.mood && setupAnswers.mood === '__custom' ? setupCustom.mood : (moodObj?.label || 'brave'),
    };
  };

  // Hard character canon Claude must respect in the prose (keeps Rocky faceless, etc.).
  const CHARACTER_CANON: Record<string, string> = {
    rocky: 'Rocky is faceless and eyeless — NEVER describe his eyes, face, or facial expressions. He communicates only in musical chimes, clicks, and beeps (like "♪ click-CLICK ♪"), never in human words. He travels the stars in his own cluttered workshop-spaceship — full of tools, beakers, and glowing screens — and often works in or returns to it.',
  };
  const characterCanon = () => (characterId && CHARACTER_CANON[characterId]) || '';

  const difficultyPipForChapter = (idx: number) => {
    const baseMap: Record<string, number> = { grade_2: 1, grade_3: 2, grade_4: 3, grade_5: 4 };
    const base = baseMap[settings.baseDifficulty] || 3;
    if (!settings.rampDifficulty) return base;
    return Math.min(5, base + idx);
  };

  const difficultyPromptForChapter = (idx: number) => {
    const pip = difficultyPipForChapter(idx);
    const map: Record<number, string> = {
      1: 'Very easy: 6-9 word sentences, mostly one-syllable common words, ~80 words for the chapter, 2 glossary words.',
      2: 'Easy: 8-12 word sentences, common vocabulary with 1-2 friendly new words, ~100 words, 3 glossary words.',
      3: 'On-grade: 10-14 word sentences, a few rich vocabulary words to learn, ~130 words, 3-4 glossary words.',
      4: 'Stretching: 12-16 word sentences, varied sentence types, descriptive language and 4 vocabulary stretches, ~160 words, 4-5 glossary words.',
      5: 'Challenge: 14-20 word sentences with compound and complex structures, vivid vocabulary, similes, ~190 words, 5 glossary words.',
    };
    return { pip, hint: map[pip] };
  };

  const callClaude = async (prompt: string, schemaHint: string) => {
    const sys = `You are writing chapters of a kid-comic-style space-adventure story for a 10-year-old who is practicing reading. Tone: warm, vivid, age-appropriate, with strong visual moments that read like comic-book panels. Never scary, gross, or violent. Always return ONLY valid JSON — no markdown, no commentary.`;
    const full = `${sys}\n\n${prompt}\n\nReturn JSON exactly matching this shape:\n${schemaHint}`;
    try {
      const res = await claudeComplete(full);
      const cleaned = res.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
      const s = cleaned.indexOf('{'), e = cleaned.lastIndexOf('}');
      if (s === -1 || e === -1) throw new Error('No JSON');
      return JSON.parse(cleaned.slice(s, e + 1));
    } catch (err) {
      console.error('Claude failed:', err);
      return null;
    }
  };

  // Generate a chapter's panel illustrations IN PARALLEL and return the chapter
  // with image URLs attached. Awaited on the loading screen so the Reader opens
  // with a finished comic instead of streaming spinners.
  const illustrateChapter = async (chapter: Chapter): Promise<Chapter> => {
    if (!characterSupportsIllustration(characterId)) return chapter;
    const panels = chapter.panels || [];
    if (!panels.some((p) => p.imagePrompt)) return chapter;
    const setting = buildContext().setting;
    const suffix = setting ? ` The scene is set in ${setting}.` : '';
    const urls = await Promise.all(
      panels.map((p) => (p.imagePrompt
        ? illustratePanel(characterId, p.imagePrompt + suffix, shipSceneRef(characterId, p.imagePrompt, setting))
        : Promise.resolve(null))),
    );
    return { ...chapter, panels: panels.map((p, i) => (urls[i] ? { ...p, imageUrl: urls[i] as string } : p)) };
  };

  const generateFirstChapter = async () => {
    setStage('loading');
    setLoadingMsg(`Drawing the first panel of ${allCharacters.find((c) => c.id === characterId)?.name}'s manga…`);
    const ctx = buildContext();
    const diff = difficultyPromptForChapter(0);
    const prompt = `Write CHAPTER 1 of a ${settings.chaptersPerStory}-chapter comic-book-style story.

CHARACTER: ${ctx.character?.name} — ${ctx.character?.tagline}
${characterCanon() ? `CHARACTER CANON (must respect): ${characterCanon()}\n` : ''}SETTING (where it begins): ${ctx.setting}
PROBLEM TO SOLVE: ${ctx.problem}
HELPFUL ITEM: ${ctx.item}
TONE: ${ctx.mood}

READING DIFFICULTY for this chapter: ${diff.hint}

Chapter 1 must:
- Introduce ${ctx.character?.name} in the setting with vivid comic-style action (one big moment).
- Hint at the problem.
- End on a choice — what to do next.
- Include glossary entries for any "stretch" vocabulary words you use.
- Include 1 comprehension question (3 options, 1 correct).
- Provide exactly 2 distinct next-step choices.
- Provide a "panels" array of EXACTLY 3 storyboard panels for this chapter's key visual beats. Each imagePrompt is ONE concrete sentence an illustrator can draw — name the character, the action, and the place; do not put any words or text in the image.`;

    const schema = `{
  "title": "short chapter title (3-6 words)",
  "text": "the prose, 3-4 short paragraphs separated by \\n\\n",
  "glossary": [{"word":"...","syll":"syl • la • bles","def":"kid-friendly definition"}],
  "quiz": {"q":"...","options":["A","B","C"],"correct":0,"explain":"one-sentence why"},
  "choices": [{"label":"...","value":"short_tag"},{"label":"...","value":"short_tag"}],
  "panels": [{"caption":"<=6 word caption or empty","dialogue":"short hero speech bubble or empty","imagePrompt":"one vivid sentence: character + action + place"}]
}`;

    const ch = await callClaude(prompt, schema);
    const final = ch || fallbackChapter(1, ctx);
    setLoadingMsg('Inking the comic panels…');
    const drawn = await illustrateChapter(final);
    setChapters([drawn]);
    setCurrentChapterIdx(0);
    setStats((s) => ({
      ...s,
      wordCount: s.wordCount + (drawn.text || '').split(/\s+/).length,
      quizTotal: s.quizTotal + 1,
    }));
    grantXp(5);
    setStage('reader');
  };

  const generateNextChapter = async (choiceMade: Choice) => {
    setStage('loading');
    setLoadingMsg('Drawing the next panel…');
    const ctx = buildContext();
    const idx = currentChapterIdx + 1;
    const isFinal = idx === settings.chaptersPerStory - 1;
    const prevSummary = chapters.map((c, i) => `Ch${i + 1} (${c.title}): ${c.text.slice(0, 200)}…`).join('\n');
    const diff = difficultyPromptForChapter(idx);

    const prompt = `Continue the story. This is CHAPTER ${idx + 1} of ${settings.chaptersPerStory}.

CHARACTER: ${ctx.character?.name}
${characterCanon() ? `CHARACTER CANON (must respect): ${characterCanon()}\n` : ''}SETTING start: ${ctx.setting}
PROBLEM: ${ctx.problem}
ITEM: ${ctx.item}
TONE: ${ctx.mood}

WHAT HAPPENED:
${prevSummary}

READER JUST CHOSE: "${choiceMade.label}" (tag: ${choiceMade.value})

READING DIFFICULTY for THIS chapter: ${diff.hint}

${isFinal
      ? 'This is the FINAL chapter. Resolve the problem in a satisfying, hopeful way. The "choices" array MUST be empty [].'
      : 'Advance the adventure. End on a new choice point.'}

Include glossary entries for any rich vocabulary, and 1 comprehension question.
Provide a "panels" array of EXACTLY 3 storyboard panels for this chapter's key visual beats; each imagePrompt is ONE concrete sentence an illustrator can draw (name the character, action, place; no words/text in the image).`;

    const schema = `{
  "title": "chapter title",
  "text": "3-4 paragraphs, separated by \\n\\n",
  "glossary": [{"word":"...","syll":"...","def":"..."}],
  "quiz": {"q":"...","options":["A","B","C"],"correct":0,"explain":"..."},
  "choices": ${isFinal ? '[]' : '[{"label":"...","value":"..."},{"label":"...","value":"..."}]'},
  "panels": [{"caption":"<=6 word caption or empty","dialogue":"short hero speech bubble or empty","imagePrompt":"one vivid sentence: character + action + place"}]
}`;

    const ch = await callClaude(prompt, schema);
    const final = ch || fallbackChapter(idx + 1, ctx, isFinal);
    setLoadingMsg('Inking the comic panels…');
    const drawn = await illustrateChapter(final);
    setChapters((cs) => [...cs, drawn]);
    setCurrentChapterIdx(idx);
    setStats((s) => ({
      ...s,
      wordCount: s.wordCount + (drawn.text || '').split(/\s+/).length,
      quizTotal: s.quizTotal + 1,
    }));
    grantXp(10);
    grantAchievement('path-walker', '🛤️', 'ACHIEVEMENT', 'Path Walker');
    setStage('reader');
  };

  /* ---------- reader callbacks ---------- */
  const handleAdvance = ({ ending, choice }: { ending?: boolean; choice?: Choice }) => {
    if (ending) finishStory();
    else if (choice) generateNextChapter(choice);
  };

  const handleWordTapped = (word: string, kind: string) => {
    setStats((s) => ({ ...s, wordsTapped: s.wordsTapped + 1 }));
    const xpEarned = kind === 'glossary' ? 5 : 2;
    grantXp(xpEarned);
    if (kind === 'glossary') grantCoins(1);
    if (stats.wordsTapped + 1 === 5) {
      grantAchievement('curious-reader', '🔎', 'ACHIEVEMENT', 'Curious Reader');
    }
    if (stats.wordsTapped + 1 === 15) {
      grantAchievement('word-wizard', '📖', 'ACHIEVEMENT', 'Word Wizard');
    }
  };

  // word definition cache
  const defCache = useRef<Record<string, string>>({});
  const handleWordDefine = async (word: string): Promise<string> => {
    if (defCache.current[word]) return defCache.current[word];
    const result = await callClaude(
      `Define "${word}" for a 10-year-old reader in one short, friendly sentence. If it fits a space-adventure context, use that.`,
      `{"def":"one short kid-friendly sentence"}`,
    );
    const def = result?.def || `"${word}" — tap the speaker to hear it again.`;
    defCache.current[word] = def;
    return def;
  };

  // listen for quiz answered events (from QuizPanel)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.correct) {
        setStats((s) => ({ ...s, quizCorrect: s.quizCorrect + 1 }));
        setCombo((c) => {
          const next = c + 1;
          setBestCombo((b) => Math.max(b, next));
          if (next === 3) grantAchievement('triple-doshu', '🔥', 'ACHIEVEMENT', 'Triple DOSHU!');
          return next;
        });
        grantXp(25 + (combo * 5));
        grantCoins(5);
      } else {
        setCombo(0);
      }
    };
    document.body.addEventListener('__olivia_quiz', handler);
    return () => document.body.removeEventListener('__olivia_quiz', handler);
  }, [combo, grantXp, grantCoins, grantAchievement]);

  const finishStory = () => {
    const mins = Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000));
    const setting = setupAnswers.setting;
    const newSticker = SETTING_LABEL[setting] ? setting : 'first-flight';
    const additions = ['first-flight', newSticker];
    if (bestCombo >= 3) additions.push('word-wizard');
    const merged = Array.from(new Set([...allStickers, ...additions]));
    setAllStickers(merged);
    const newStreak = streak + 1;
    setStreak(newStreak);
    try { localStorage.setItem('olivia.streak', String(newStreak)); } catch {}
    grantXp(50);
    grantCoins(20);
    grantAchievement('first-story', '🚀', 'ACHIEVEMENT', 'First Flight');
    if (stats.quizCorrect === stats.quizTotal && stats.quizTotal >= 3) {
      grantAchievement('perfect-mind', '🧠', 'ACHIEVEMENT', 'Perfect Comprehension');
    }
    setStats((s) => ({ ...s, timeMins: mins, earnedStickers: merged, newSticker }));
    setStage('end');
  };

  /* ---------- render ---------- */
  const xpInfo = xpProgress(xp);
  const lvlRef = useHudBump(xpInfo.lvl);
  const xpRef = useHudBump(xp);
  const coinsRef = useHudBump(coins);
  const streakRef = useHudBump(streak);

  let body;
  if (stage === 'welcome') {
    body = <Welcome onStart={startNew} />;
  } else if (stage === 'character') {
    body = (
      <CharacterSelect
        value={characterId}
        onChange={setCharacterId}
        onNext={goSetup}
        onBack={() => setStage('welcome')}
        characters={allCharacters}
        onCreateNew={() => openHeroBuilder()}
        onEditHero={(h) => openHeroBuilder(h)}
        onDeleteHero={handleDeleteHero}
      />
    );
  } else if (stage === 'hero_builder') {
    body = (
      <HeroBuilder
        existing={editingHero}
        onSave={handleSaveHero}
        onCancel={() => { setEditingHero(null); setStage('character'); }}
        claudeCall={callClaude}
      />
    );
  } else if (stage === 'setup') {
    const q = sessionSetup[setupStep];
    body = (
      <Setup
        questions={sessionSetup}
        stepIdx={setupStep}
        value={setupAnswers[q.id]}
        customValue={setupCustom[q.id]}
        onChange={(v) => setSetupAnswers((a) => ({ ...a, [q.id]: v }))}
        onCustom={(v) => setSetupCustom((c) => ({ ...c, [q.id]: v }))}
        onNext={advanceSetup}
        onBack={backSetup}
      />
    );
  } else if (stage === 'loading') {
    body = <Loading characterId={characterId} message={loadingMsg} />;
  } else if (stage === 'reader') {
    const chap = chapters[currentChapterIdx];
    body = chap ? (
      <Reader
        chapter={chap}
        chapterIdx={currentChapterIdx}
        totalChapters={settings.chaptersPerStory}
        characterId={characterId}
        setting={setupAnswers.setting}
        onAdvance={handleAdvance}
        onWordDefine={handleWordDefine}
        onWordTapped={handleWordTapped}
        fontStep={fontStep}
        setFontStep={setFontStep}
        highlightTricky={highlightTricky}
        setHighlightTricky={setHighlightTricky}
        difficultyLevel={difficultyPipForChapter(currentChapterIdx)}
      />
    ) : <Loading characterId={characterId} message="Loading…" />;
  } else if (stage === 'end') {
    body = (
      <End
        session={{
          characterId,
          setting: setupAnswers.setting,
          problem: setupAnswers.problem,
          item: setupAnswers.item,
          mood: setupAnswers.mood,
          chapters,
          stats: { ...stats, earnedStickers: allStickers, newSticker: stats.newSticker },
          newSticker: stats.newSticker,
        }}
        onAgain={startNew}
        onHome={() => setStage('welcome')}
      />
    );
  } else if (stage === 'settings') {
    body = (
      <SettingsPage
        settings={settings}
        onChange={setSettingValue}
        onBack={() => setStage(prevStage)}
      />
    );
  }

  return (
    <>
      <RewardBus />
      <div className="app">
        <div className="topbar">
          <div className="brand" onClick={() => setStage('welcome')}>
            <div className="logo">読</div>
            <div>
              Olivia's <span className="accent">Comics</span><br />
              <span className="ja">★ READING ADVENTURES</span>
            </div>
          </div>
          <div className="hud">
            <div ref={lvlRef} className="hud-chip lvl">
              <span className="glyph">★</span> LVL {xpInfo.lvl}
              <div className="xp-bar"><i style={{ width: xpInfo.pct + '%' }}></i></div>
            </div>
            <div ref={xpRef} className="hud-chip xp"><span className="glyph">✨</span>{xp} XP</div>
            <div ref={coinsRef} className="hud-chip coins"><span className="glyph">★</span>{coins}</div>
            <div ref={streakRef} className="hud-chip streak"><span className="glyph">🔥</span>{streak}</div>
            <button
              className="hud-chip"
              style={{ cursor: 'pointer', background: 'var(--paper)' }}
              onClick={() => { setPrevStage(stage); setStage('settings'); }}
              title="Settings"
            >
              <span className="glyph">⚙️</span>
            </button>
          </div>
        </div>
        {body && <div className="stage-in" key={stage}>{body}</div>}
      </div>

      <ComboMeter combo={combo} />

      {levelUpAt && (
        <div className="levelup-overlay">
          <div className="levelup-card">
            <div className="ja">★ POWER UP ★</div>
            <div className="lvl-up">Level Up!</div>
            <div className="num">{levelUpAt}</div>
          </div>
        </div>
      )}
    </>
  );
}

/* =====================================================
   FALLBACK CHAPTERS
===================================================== */
function fallbackChapter(num: number, ctx: { character?: Character | null; setting: string; item: string }, isFinal = false): Chapter {
  const name = ctx.character?.name || 'our hero';
  const setting = ctx.setting || 'the stars';
  if (num === 1) {
    return {
      title: `Into the ${setting}`,
      text: `${name} woke up to a strange humming sound. The little spaceship rattled. Outside the round window, the ${setting.toLowerCase()} sparkled like a thousand tiny lights.\n\n"Something is wrong," ${name} whispered. A red button glowed. A green dial spun. Anywhere else, this would feel scary. Out here, it felt like the start of something big.\n\nIn one pocket: ${ctx.item.toLowerCase()}. In the other: a half-eaten snack. ${name} took a deep breath.`,
      glossary: [
        { word: 'rattled', syll: 'rat \u2022 tled', def: 'shook with a noisy sound' },
        { word: 'sparkled', syll: 'spar \u2022 kled', def: 'shined with tiny flashes of light' },
        { word: 'whispered', syll: 'whis \u2022 pered', def: 'spoke very softly' },
      ],
      quiz: { q: 'What woke up the hero?', options: ['A loud song', 'A strange humming sound', 'A scary monster'], correct: 1, explain: 'The humming sound made the ship rattle.' },
      choices: [
        { label: 'Press the glowing red button.', value: 'press_button' },
        { label: 'Look out the window first.', value: 'look_window' },
      ],
    };
  }
  if (isFinal) {
    return {
      title: 'Home Among the Stars',
      text: `${name} smiled. The problem was solved. A new friend floated nearby, glowing softly. Together, they steered the ship toward a calm, bright star.\n\n"Thank you for finding me," the friend chimed. ${name} laughed. "Anytime."\n\nThe ${setting.toLowerCase()} was quiet again. Tomorrow there would be more stars. But tonight — tonight was for resting, and for one more snack.`,
      glossary: [
        { word: 'steered', syll: 'steered', def: 'guided which way the ship went' },
        { word: 'chimed', syll: 'chimed', def: 'made a soft bell-like sound' },
      ],
      quiz: { q: 'How did the friend say thanks?', options: ['With a chime', 'With a hug', 'With a song'], correct: 0, explain: 'The friend chimed softly.' },
      choices: [],
    };
  }
  return {
    title: 'A Trail of Lights',
    text: `${name} followed a trail of tiny glowing lights. Each one floated, then drifted ahead — like crumbs made of stars.\n\nThe air grew warmer. The hum got louder. Something — or someone — was hiding just past the curve of the rocks.\n\n${name}'s ${ctx.item.toLowerCase()} beeped twice. That meant: be careful.`,
    glossary: [
      { word: 'drifted', syll: 'drif \u2022 ted', def: 'moved slowly and gently' },
      { word: 'beyond', syll: 'be \u2022 yond', def: 'on the other side of something' },
    ],
    quiz: { q: 'What did the two beeps mean?', options: ['Be careful', 'Run fast', 'Take a snack'], correct: 0, explain: 'Two beeps meant be careful.' },
    choices: [
      { label: 'Call out a friendly hello.', value: 'say_hello' },
      { label: 'Tip-toe forward quietly.', value: 'tiptoe' },
    ],
  };
}
