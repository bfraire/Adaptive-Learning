"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { InlineMath, BlockMath } from "react-katex";

function renderMath(text: string) {
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$$") && part.endsWith("$$"))
          return <BlockMath key={i} math={part.slice(2, -2)} />;
        if (part.startsWith("$") && part.endsWith("$"))
          return <InlineMath key={i} math={part.slice(1, -1)} />;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ErrorCategory = "formula-step" | "conceptual" | "scenario-misapply";
type ContentType = "formula" | "example" | "definition" | "general";
type Difficulty = "scaffold" | "standard" | "challenge";
type RemediationType =
  | "worked-example"
  | "targeted-practice"
  | "abstract-challenge"
  | "concept-review"
  | "stepwise-derivation"
  | "concise-analogy"
  | "story-analogy"
  | "formula-intuition"
  | "story-driven-example"
  | "definition-restatement";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  concept: string;
  errorCategory: ErrorCategory;
  contentType: ContentType;
  difficulty: Difficulty;
  // Optional per-difficulty variants of the same question
  variants?: Partial<Record<Difficulty, { question: string; options: string[]; correctIndex: number }>>;
};

type QuestionResult = {
  questionId: string;
  concept: string;
  errorCategory: ErrorCategory;
  contentType: ContentType;
  correct: boolean;
  timeMs: number;
  attempts: number;
};

type ReadingSignals = {
  formulaTimeRatio: number;
  exampleTimeRatio: number;
  definitionTimeRatio: number;
  definitionReopened: boolean;
};

type RemediationBlock = {
  type: RemediationType;
  concept?: string;
  interestTag?: string;
  preferredStyle?: string;
};

type LearnerState = {
  score: number;
  difficulty: Difficulty;
  weakConcepts: string[];
  errorsByConcept: Record<string, number>;
  recentErrors: { concept: string; category: ErrorCategory; contentType: ContentType }[];
  readingSignals: ReadingSignals;
  interestTag: string;
  preferredStyle: string;
  streakCorrect: number;
};

type QuizConfig = {
  difficulty: Difficulty;
  questionCount: number;
  focusConcepts: string[];
  showHint: boolean;
  remediationBlocks: RemediationBlock[];
};

// ─── Rule Engines ─────────────────────────────────────────────────────────────

function applyPerformanceRules(state: LearnerState, config: QuizConfig): QuizConfig {
  const remediations: RemediationBlock[] = [];

  if (state.score < 0.7) {
    config = { ...config, difficulty: "scaffold", questionCount: 3, showHint: true };
    remediations.push({ type: "worked-example" });
  } else if (state.score <= 0.9) {
    config = { ...config, difficulty: "standard" };
    remediations.push({ type: "targeted-practice" });

    const repeatErrors = Object.entries(state.errorsByConcept)
      .filter(([, count]) => count >= 2)
      .map(([concept]) => concept);

    if (repeatErrors.length > 0) {
      remediations.push({
        type: "concept-review",
        concept: repeatErrors[0],
        preferredStyle: state.preferredStyle,
      });
    }
  } else {
    config = { ...config, difficulty: "challenge", questionCount: 5, showHint: false };
    remediations.push({ type: "abstract-challenge" });
  }

  return { ...config, remediationBlocks: [...config.remediationBlocks, ...remediations] };
}

const ERROR_TO_REMEDIATION: Record<ErrorCategory, RemediationType> = {
  "formula-step": "stepwise-derivation",
  "conceptual": "concise-analogy",
  "scenario-misapply": "story-analogy",
};

function applyErrorPatternRules(state: LearnerState, config: QuizConfig): QuizConfig {
  const triggered = new Set<ErrorCategory>();
  const remediations: RemediationBlock[] = [];

  for (const { concept, category } of state.recentErrors) {
    if (!triggered.has(category)) {
      triggered.add(category);
      remediations.push({
        type: ERROR_TO_REMEDIATION[category],
        concept,
        interestTag: state.interestTag,
      });
    }
  }

  const focusConcepts = [...new Set(state.recentErrors.map((e) => e.concept))];

  return {
    ...config,
    focusConcepts: focusConcepts.length > 0 ? focusConcepts : config.focusConcepts,
    remediationBlocks: [...config.remediationBlocks, ...remediations],
  };
}

function applyReadingRules(state: LearnerState, config: QuizConfig): QuizConfig {
  const { readingSignals: rs, interestTag } = state;
  const remediations: RemediationBlock[] = [];

  if (rs.formulaTimeRatio > 1.5) {
    remediations.push({ type: "formula-intuition", interestTag });
  }

  const missedExample = state.recentErrors.some((e) => e.contentType === "example");
  if (rs.exampleTimeRatio < 0.5 && missedExample) {
    remediations.push({ type: "story-driven-example", interestTag });
  }

  if (rs.definitionTimeRatio > 2 || rs.definitionReopened) {
    remediations.push({ type: "definition-restatement" });
  }

  return {
    ...config,
    remediationBlocks: [...config.remediationBlocks, ...remediations],
  };
}

export function buildQuizConfig(state: LearnerState, sectionConcepts: string[]): QuizConfig {
  let config: QuizConfig = {
    difficulty: "standard",
    questionCount: 4,
    focusConcepts: sectionConcepts,
    showHint: false,
    remediationBlocks: [],
  };
  config = applyPerformanceRules(state, config);
  config = applyErrorPatternRules(state, config);
  config = applyReadingRules(state, config);
  return config;
}

// ─── State persistence ────────────────────────────────────────────────────────

const HISTORY_KEY = "quizHistory";
const SIGNALS_KEY = "readingSignals";

function loadHistory(): QuestionResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(results: QuestionResult[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(results.slice(-100)));
  } catch {}
}

function loadReadingSignals(): ReadingSignals {
  try {
    const raw = localStorage.getItem(SIGNALS_KEY);
    return raw
      ? JSON.parse(raw)
      : { formulaTimeRatio: 1, exampleTimeRatio: 1, definitionTimeRatio: 1, definitionReopened: false };
  } catch {
    return { formulaTimeRatio: 1, exampleTimeRatio: 1, definitionTimeRatio: 1, definitionReopened: false };
  }
}

function computeLearnerState(
  history: QuestionResult[],
  readingSignals: ReadingSignals,
  interestTag: string,
  preferredStyle: string,
  lastScore: number
): LearnerState {
  const errorsByConcept: Record<string, number> = {};
  const conceptMap: Record<string, { correct: number; total: number }> = {};

  for (const r of history) {
    if (!conceptMap[r.concept]) conceptMap[r.concept] = { correct: 0, total: 0 };
    conceptMap[r.concept].total++;
    if (r.correct) conceptMap[r.concept].correct++;
    else errorsByConcept[r.concept] = (errorsByConcept[r.concept] ?? 0) + 1;
  }

  const weakConcepts = Object.entries(conceptMap)
    .filter(([, v]) => v.total >= 2 && v.correct / v.total < 0.6)
    .map(([k]) => k);

  const recentErrors = history
    .slice(-10)
    .filter((r) => !r.correct)
    .map((r) => ({ concept: r.concept, category: r.errorCategory, contentType: r.contentType }))
    .slice(-5);

  let streakCorrect = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].correct) streakCorrect++;
    else break;
  }

  const difficulty: Difficulty =
    lastScore > 0.9 ? "challenge" : lastScore < 0.7 ? "scaffold" : "standard";

  return {
    score: lastScore,
    difficulty,
    weakConcepts,
    errorsByConcept,
    recentErrors,
    readingSignals,
    interestTag,
    preferredStyle,
    streakCorrect,
  };
}

// ─── Remediation content renderer ────────────────────────────────────────────

function getRemediationLabel(type: RemediationType): string {
  const labels: Record<RemediationType, string> = {
    "worked-example": "Let's work through this together",
    "targeted-practice": "Practice the missed concepts",
    "abstract-challenge": "Push further",
    "concept-review": "Let's revisit this concept",
    "stepwise-derivation": "Step-by-step breakdown",
    "concise-analogy": "Here's another way to see it",
    "story-analogy": "Let's ground this in a scenario",
    "formula-intuition": "Building intuition for this formula",
    "story-driven-example": "Here's why this matters",
    "definition-restatement": "Let's clarify the definition",
  };
  return labels[type] ?? "Review";
}

function getRemediationStyle(type: RemediationType): {
  border: string;
  bg: string;
  label: string;
  icon: string;
} {
  if (["worked-example", "concept-review", "stepwise-derivation", "formula-intuition"].includes(type)) {
    return {
      border: "border-blue-200",
      bg: "bg-blue-50",
      label: "text-blue-700",
      icon: "◈",
    };
  }
  if (["story-analogy", "story-driven-example", "concise-analogy"].includes(type)) {
    return {
      border: "border-amber-200",
      bg: "bg-amber-50",
      label: "text-amber-700",
      icon: "◇",
    };
  }
  return {
    border: "border-gray-200",
    bg: "bg-gray-50",
    label: "text-gray-600",
    icon: "○",
  };
}

type RemediationCardProps = {
  block: RemediationBlock;
  question: QuizQuestion;
};

function RemediationCard({ block, question }: RemediationCardProps) {
  const style = getRemediationStyle(block.type);
  const label = getRemediationLabel(block.type);

  return (
    <div
      className={`mt-3 rounded-xl border ${style.border} ${style.bg} px-4 py-3 text-sm leading-relaxed`}
      style={{ animation: "fadeSlideIn 0.25s ease both" }}
    >
      <p className={`font-semibold mb-1 ${style.label} flex items-center gap-1.5`}>
        <span style={{ fontSize: 13 }}>{style.icon}</span>
        {label}
      </p>
      <p className="text-gray-700">{renderMath(question.explanation)}</p>

      {block.type === "stepwise-derivation" && (
        <p className="mt-2 text-gray-500 text-xs">
          Try breaking each step down before checking the answer.
        </p>
      )}

      {(block.type === "story-analogy" || block.type === "story-driven-example") &&
        block.interestTag && (
          <p className="mt-2 text-gray-500 text-xs">
            Framed using your interest area: <span className="font-medium">{block.interestTag}</span>.
          </p>
        )}

      {block.type === "concept-review" && block.concept && (
        <p className="mt-2 text-gray-500 text-xs">
          You&apos;ve missed <span className="font-medium">{block.concept}</span> more than once — let&apos;s
          nail it in your preferred style.
        </p>
      )}

      {block.type === "definition-restatement" && (
        <p className="mt-2 text-gray-500 text-xs">
          You can reopen the definition block above to compare.
        </p>
      )}
    </div>
  );
}

// ─── Hint ────────────────────────────────────────────────────────────────────

function HintBadge({ concept }: { concept: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
      >
        <span
          style={{
            display: "inline-block",
            transition: "transform 0.15s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ▶
        </span>
        Show hint
      </button>
      {open && (
        <p
          className="mt-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
          style={{ animation: "fadeSlideIn 0.15s ease both" }}
        >
          Think about the definition of <span className="font-medium">{concept}</span> and what
          constraints apply to a valid function.
        </p>
      )}
    </div>
  );
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────

function DifficultyPip({ difficulty }: { difficulty: Difficulty }) {
  const map: Record<Difficulty, { label: string; color: string }> = {
    scaffold: { label: "scaffolded", color: "bg-blue-100 text-blue-600" },
    standard: { label: "standard", color: "bg-gray-100 text-gray-500" },
    challenge: { label: "challenge", color: "bg-amber-100 text-amber-600" },
  };
  const { label, color } = map[difficulty];
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{label}</span>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 tabular-nums">
        {current}/{total}
      </span>
    </div>
  );
}

// ─── Difficulty ordering ──────────────────────────────────────────────────────

const DIFFICULTY_RANK: Record<Difficulty, number> = { scaffold: 0, standard: 1, challenge: 2 };

// ─── End screens ─────────────────────────────────────────────────────────────

function AllCorrectScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-6 space-y-3" style={{ animation: "fadeSlideIn 0.3s ease both" }}>
      <div className="text-3xl">✓</div>
      <p className="font-semibold text-gray-900">All correct!</p>
      <p className="text-sm text-gray-500">
        Ready for more? The adaptive practice session has additional problems for this section.
      </p>
      <div className="flex justify-center gap-3 pt-1">
        <a
          href="/practice/1-1"
          className="rounded-xl bg-gray-900 text-white text-sm font-medium px-5 py-2 hover:bg-gray-700 transition-colors"
        >
          Adaptive practice →
        </a>
        <button
          onClick={onReset}
          className="rounded-xl border border-gray-200 text-gray-600 text-sm font-medium px-5 py-2 hover:bg-gray-50 transition-colors"
        >
          Restart
        </button>
      </div>
    </div>
  );
}

type EscalationItem = {
  failed: QuizQuestion;
  easier: QuizQuestion | null;
};

function EscalationScreen({
  items,
  onReset,
}: {
  items: EscalationItem[];
  onReset: () => void;
}) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  return (
    <div style={{ animation: "fadeSlideIn 0.3s ease both" }} className="space-y-4">
      <p className="text-sm font-semibold text-gray-700">
        Let&apos;s try a different approach for the concepts you missed.
      </p>

      {items.map(({ failed, easier }) => (
        <div key={failed.id} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-amber-700">{failed.concept}</p>

          {easier ? (
            <>
              <p className="text-sm text-gray-800">{renderMath(easier.question)}</p>
              {revealed.has(easier.id) ? (
                <div className="rounded-lg bg-white border border-amber-200 px-3 py-2 text-sm text-gray-700">
                  {renderMath(easier.explanation)}
                </div>
              ) : (
                <button
                  onClick={() => setRevealed((s) => new Set([...s, easier.id]))}
                  className="text-xs text-amber-700 underline hover:text-amber-900"
                >
                  Show worked answer
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Review the <span className="font-medium">{failed.concept}</span> example in the section above, then try again.
            </p>
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-1">
        <a
          href="/practice/1-1"
          className="rounded-xl bg-gray-900 text-white text-sm font-medium px-5 py-2 hover:bg-gray-700 transition-colors"
        >
          Adaptive practice →
        </a>
        <button
          onClick={onReset}
          className="rounded-xl border border-gray-200 text-gray-600 text-sm font-medium px-5 py-2 hover:bg-gray-50 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// ─── Main QuizBlock ───────────────────────────────────────────────────────────

export type QuizBlockProps = {
  title?: string;
  questions: QuizQuestion[];
  sectionConcepts: string[];
  sectionId?: string;
  onComplete?: (results: QuestionResult[], config: QuizConfig) => void;
};

export function QuizBlock({
  title,
  questions,
  sectionConcepts,
  sectionId,
  onComplete,
}: QuizBlockProps) {
  // history is kept in state so handleNext can append to it after mount
  const [history, setHistoryState] = useState<QuestionResult[]>([]);

  // config starts with stable SSR-safe defaults; useEffect hydrates from localStorage
  const [config, setConfig] = useState<QuizConfig>({
    difficulty: "standard",
    questionCount: 4,
    focusConcepts: sectionConcepts,
    showHint: false,
    remediationBlocks: [],
  });

  useEffect(() => {
    const storedHistory = loadHistory();
    const readingSignals = loadReadingSignals();
    const prefs = (() => {
      try {
        const p = localStorage.getItem("userPreferences");
        return p ? JSON.parse(p) : {};
      } catch {
        return {};
      }
    })();
    const lastScore =
      storedHistory.length === 0
        ? 0.75
        : storedHistory.slice(-5).filter((r) => r.correct).length /
          storedHistory.slice(-5).length;
    const learnerState = computeLearnerState(
      storedHistory,
      readingSignals,
      prefs.interest ?? "general",
      prefs.contentStyle ?? "steps",
      lastScore
    );
    setHistoryState(storedHistory);
    setConfig(buildQuizConfig(learnerState, sectionConcepts));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Retry / escalation state
  const [roundPool, setRoundPool] = useState<QuizQuestion[] | null>(null); // null = use all questions
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [wrongAttemptsMap, setWrongAttemptsMap] = useState<Record<string, number>>({});
  const [retryRound, setRetryRound] = useState(0); // 0 = first pass, 1 = first retry
  const [allCorrect, setAllCorrect] = useState(false);
  const [escalationItems, setEscalationItems] = useState<EscalationItem[]>([]);

  // Select questions based on config, respecting roundPool when set
  const activeQuestions = (() => {
    const base = roundPool ?? questions;
    const focused = base.filter(
      (q) =>
        q.difficulty === config.difficulty ||
        config.focusConcepts.includes(q.concept)
    );
    const pool = focused.length >= config.questionCount ? focused : base;
    return pool.slice(0, config.questionCount);
  })();

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sessionResults, setSessionResults] = useState<QuestionResult[]>([]);
  const [done, setDone] = useState(false);
  const questionStartTime = useRef(Date.now());

  const currentQuestion = activeQuestions[currentIndex];

  // Apply difficulty variant if present
  const displayQuestion = (() => {
    const variant = currentQuestion?.variants?.[config.difficulty];
    if (!variant) return currentQuestion;
    return {
      ...currentQuestion,
      question: variant.question,
      options: variant.options,
      correctIndex: variant.correctIndex,
    };
  })();

  const handleSubmit = useCallback(() => {
    if (selectedOption === null || !currentQuestion) return;
    const correct = selectedOption === displayQuestion.correctIndex;
    const timeMs = Date.now() - questionStartTime.current;

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      concept: currentQuestion.concept,
      errorCategory: currentQuestion.errorCategory,
      contentType: currentQuestion.contentType,
      correct,
      timeMs,
      attempts: 1,
    };

    setSessionResults((prev) => [...prev, result]);
    setSubmitted(true);
  }, [selectedOption, currentQuestion, displayQuestion]);

  const handleNext = useCallback(() => {
    // Not the last question — just advance
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setSubmitted(false);
      questionStartTime.current = Date.now();
      return;
    }

    // Round complete
    const roundResults = [...sessionResults];
    const newHistory = [...history, ...roundResults];
    saveHistory(newHistory);
    setHistoryState(newHistory);
    onComplete?.(roundResults, config);

    const correctIds = new Set(roundResults.filter((r) => r.correct).map((r) => r.questionId));
    const wrongIds = roundResults.filter((r) => !r.correct).map((r) => r.questionId);

    const newMastered = new Set([...masteredIds, ...correctIds]);
    setMasteredIds(newMastered);

    const newWrongAttempts = { ...wrongAttemptsMap };
    for (const id of wrongIds) {
      newWrongAttempts[id] = (newWrongAttempts[id] ?? 0) + 1;
    }
    setWrongAttemptsMap(newWrongAttempts);

    // All correct — show completion screen
    if (wrongIds.length === 0) {
      setAllCorrect(true);
      setDone(true);
      return;
    }

    // Second attempt exhausted — escalate
    if (retryRound >= 1) {
      const items: EscalationItem[] = questions
        .filter((q) => wrongIds.includes(q.id))
        .map((failed) => {
          const easier =
            questions.find(
              (alt) =>
                alt.concept === failed.concept &&
                DIFFICULTY_RANK[alt.difficulty] < DIFFICULTY_RANK[failed.difficulty] &&
                alt.id !== failed.id
            ) ?? null;
          return { failed, easier };
        });
      setEscalationItems(items);
      setDone(true);
      return;
    }

    // First retry — show only wrong questions, rebuild config from updated history
    const wrongQuestions = questions.filter(
      (q) => wrongIds.includes(q.id) && !newMastered.has(q.id)
    );
    setRoundPool(wrongQuestions);
    setRetryRound((r) => r + 1);

    const signals = loadReadingSignals();
    const prefs = (() => {
      try { return JSON.parse(localStorage.getItem("userPreferences") ?? "{}"); }
      catch { return {}; }
    })();
    const lastScore =
      newHistory.length === 0
        ? 0.75
        : newHistory.slice(-5).filter((r) => r.correct).length / Math.min(5, newHistory.length);
    const newState = computeLearnerState(
      newHistory, signals,
      prefs.interest ?? "general",
      prefs.contentStyle ?? "steps",
      lastScore
    );
    setConfig(buildQuizConfig(newState, sectionConcepts));

    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setSessionResults([]);
    questionStartTime.current = Date.now();
  }, [
    currentIndex, activeQuestions.length, sessionResults, history, config, onComplete,
    masteredIds, wrongAttemptsMap, retryRound, questions, sectionConcepts,
  ]);

  const handleReset = useCallback(() => {
    setRoundPool(null);
    setMasteredIds(new Set());
    setWrongAttemptsMap({});
    setRetryRound(0);
    setAllCorrect(false);
    setEscalationItems([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setSessionResults([]);
    setDone(false);
    questionStartTime.current = Date.now();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && selectedOption !== null && !submitted) handleSubmit();
      if (e.key === "Enter" && submitted) handleNext();
      const num = parseInt(e.key);
      if (!submitted && num >= 1 && num <= (displayQuestion?.options?.length ?? 0)) {
        setSelectedOption(num - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedOption, submitted, handleSubmit, handleNext, displayQuestion]);

  if (!currentQuestion && !done) return null;

  // Find the most relevant remediation for this question's error type
  const relevantRemediation =
    submitted && selectedOption !== displayQuestion.correctIndex
      ? config.remediationBlocks.find(
          (b) => b.type === ERROR_TO_REMEDIATION[currentQuestion.errorCategory]
        ) ??
        config.remediationBlocks.find(
          (b) => b.type === "worked-example" || b.type === "concept-review"
        ) ??
        null
      : null;

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-4px); }
          75%      { transform: translateX(4px); }
        }
        .quiz-option-shake { animation: shake 0.25s ease; }
      `}</style>

      <div
        id={sectionId}
        className="my-8 rounded-2xl border border-gray-200 bg-white px-6 py-5"
        style={{ animation: "fadeSlideIn 0.3s ease both" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {retryRound > 0
              ? `Retry — missed questions`
              : (title ?? "Check your understanding")}
          </p>
          <DifficultyPip difficulty={config.difficulty} />
        </div>

        {done ? (
          allCorrect ? (
            <AllCorrectScreen onReset={handleReset} />
          ) : (
            <EscalationScreen items={escalationItems} onReset={handleReset} />
          )
        ) : (
          <>
            <ProgressBar current={currentIndex + 1} total={activeQuestions.length} />

            {/* Question */}
            <p
              key={currentQuestion.id}
              className="text-sm font-medium text-gray-900 leading-relaxed mb-4"
              style={{ animation: "fadeSlideIn 0.2s ease both" }}
            >
              {renderMath(displayQuestion.question)}
            </p>

            {/* Hint */}
            {config.showHint && !submitted && (
              <HintBadge concept={currentQuestion.concept} />
            )}

            {/* Options */}
            <div className="space-y-2 mb-4">
              {displayQuestion.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === displayQuestion.correctIndex;

                let base =
                  "w-full text-left text-sm px-4 py-3 rounded-xl border transition-all duration-150 flex items-center gap-3 ";

                if (!submitted) {
                  base += isSelected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 hover:border-gray-400 text-gray-700 hover:bg-gray-50";
                } else if (isSelected && isCorrect) {
                  base += "border-green-300 bg-green-50 text-green-800";
                } else if (isSelected && !isCorrect) {
                  base += "border-red-300 bg-red-50 text-red-700 quiz-option-shake";
                } else {
                  base += "border-gray-100 text-gray-400";
                }

                const marker = submitted
                  ? isSelected && isCorrect ? "✓"
                  : isSelected ? "✗"
                  : String.fromCharCode(65 + i)
                  : String.fromCharCode(65 + i);

                const markerColor = submitted
                  ? isSelected && isCorrect ? "text-green-600 font-bold"
                  : isSelected ? "text-red-500 font-bold"
                  : "text-gray-300"
                  : isSelected ? "text-white" : "text-gray-400";

                return (
                  <button
                    key={i}
                    disabled={submitted}
                    onClick={() => setSelectedOption(i)}
                    className={base}
                  >
                    <span
                      className={`text-xs w-5 shrink-0 text-center font-mono ${markerColor}`}
                    >
                      {marker}
                    </span>
                    <span>{renderMath(opt)}</span>
                  </button>
                );
              })}
            </div>

            {/* Remediation card — shown on wrong answer */}
            {relevantRemediation && (
              <RemediationCard
                block={relevantRemediation}
                question={currentQuestion}
              />
            )}

            {/* Feedback */}
            {submitted && selectedOption === displayQuestion.correctIndex && (
              <div
                className="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                style={{ animation: "fadeSlideIn 0.2s ease both" }}
              >
                <span className="font-semibold">Correct. </span>
                {renderMath(currentQuestion.explanation)}
              </div>
            )}
            {submitted && selectedOption !== displayQuestion.correctIndex && (
              <div
                className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                style={{ animation: "fadeSlideIn 0.2s ease both" }}
              >
                <span className="font-semibold">Not quite. </span>
                Try a different option and move on — you&apos;ll see this concept again.
              </div>
            )}

            {/* Action row */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-300">
                {submitted ? "press Enter to continue" : "press Enter to submit"}
              </span>
              {!submitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmit}
                  className="rounded-xl bg-gray-900 text-white text-sm font-medium px-5 py-2 disabled:opacity-30 hover:bg-gray-700 transition-colors"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="rounded-xl bg-gray-900 text-white text-sm font-medium px-5 py-2 hover:bg-gray-700 transition-colors"
                >
                  {currentIndex + 1 >= activeQuestions.length ? "Finish →" : "Next →"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}