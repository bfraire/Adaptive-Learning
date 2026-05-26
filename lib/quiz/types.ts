// Error categories map directly to your 3 error-pattern rule branches
export type ErrorCategory =
  | "formula-step"        // gets derivation/procedure wrong
  | "conceptual"          // misunderstands a definition
  | "scenario-misapply";  // knows concept but applies it wrongly in context

// Content type of the section block the question is testing
export type ContentType = "formula" | "example" | "definition" | "general";

export type Difficulty = "scaffold" | "standard" | "challenge";

export type RemediationType =
  | "worked-example"           // < 70%: more examples + mini-lesson
  | "targeted-practice"        // 70–90%: same difficulty, hit weak spots
  | "abstract-challenge"       // > 90%: multi-step, less scaffolding
  | "concept-review"           // repeat error ×2: force step-by-step in preferred style
  | "stepwise-derivation"      // formula error
  | "concise-analogy"          // conceptual error
  | "story-analogy"            // scenario misapplication
  | "formula-intuition"        // reading: slow on formula
  | "story-driven-example"     // reading: skimmed example + missed
  | "definition-restatement";  // reading: struggled with definition

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
};

export type QuestionResult = {
  questionId: string;
  concept: string;
  errorCategory: ErrorCategory;
  contentType: ContentType;
  correct: boolean;
  timeMs: number;
  attempts: number;
};

// Per-content-type reading signals
export type ReadingSignals = {
  formulaTimeRatio: number;   // actual / median reading time
  exampleTimeRatio: number;
  definitionTimeRatio: number;
  definitionReopened: boolean;
};

export type LearnerState = {
  score: number;                              // 0–1, last quiz
  difficulty: Difficulty;
  weakConcepts: string[];
  errorsByConcept: Record<string, number>;    // concept → wrong count
  recentErrors: { concept: string; category: ErrorCategory }[];
  readingSignals: ReadingSignals;
  interestTag: string;                        // from profile: "sports", etc.
  preferredStyle: string;                     // from profile: "story" | "analogy" | "steps"
  streakCorrect: number;
};

export type RemediationBlock = {
  type: RemediationType;
  concept?: string;
  interestTag?: string;
  preferredStyle?: string;
};

export type QuizConfig = {
  difficulty: Difficulty;
  questionCount: number;
  focusConcepts: string[];
  showHint: boolean;
  remediationBlocks: RemediationBlock[];      // can be multiple active at once
};