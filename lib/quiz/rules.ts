import {
  LearnerState, QuizConfig, QuizQuestion,
  RemediationBlock, ErrorCategory
} from "./types";

// ── Performance rules ────────────────────────────────────────────

export function applyPerformanceRules(
  state: LearnerState,
  config: QuizConfig
): QuizConfig {
  const remediations: RemediationBlock[] = [];

  if (state.score < 0.7) {
    config = { ...config, difficulty: "scaffold", questionCount: 3, showHint: true };
    remediations.push({ type: "worked-example" });
  } else if (state.score <= 0.9) {
    config = { ...config, difficulty: "standard" };
    remediations.push({ type: "targeted-practice" });

    // Repeat-error trigger: same concept wrong ≥2 times
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

  return {
    ...config,
    remediationBlocks: [...config.remediationBlocks, ...remediations],
  };
}

// ── Error-pattern rules ──────────────────────────────────────────

const ERROR_TO_REMEDIATION: Record<ErrorCategory, RemediationBlock["type"]> = {
  "formula-step":       "stepwise-derivation",
  "conceptual":         "concise-analogy",
  "scenario-misapply":  "story-analogy",
};

export function applyErrorPatternRules(
  state: LearnerState,
  config: QuizConfig
): QuizConfig {
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

  // Focus next quiz on the concepts that had errors
  const focusConcepts = [...new Set(state.recentErrors.map(e => e.concept))];

  return {
    ...config,
    focusConcepts: focusConcepts.length > 0 ? focusConcepts : config.focusConcepts,
    remediationBlocks: [...config.remediationBlocks, ...remediations],
  };
}

// ── Reading behavior rules ───────────────────────────────────────

export function applyReadingRules(
  state: LearnerState,
  config: QuizConfig
): QuizConfig {
  const { readingSignals: rs, interestTag } = state;
  const remediations: RemediationBlock[] = [];

  // Formula: spent >1.5× median reading time
  if (rs.formulaTimeRatio > 1.5) {
    remediations.push({ type: "formula-intuition", interestTag });
  }

  // Example: skimmed (low time) AND missed a post-quiz question on it
  // The "missed" condition is checked by cross-referencing recentErrors contentType
  const missedExample = state.recentErrors.some(e =>
    // you'd enrich QuestionResult with contentType to enable this
    (e as any).contentType === "example"
  );
  if (rs.exampleTimeRatio < 0.5 && missedExample) {
    remediations.push({ type: "story-driven-example", interestTag });
  }

  // Definition: >2× expected time OR reopened
  if (rs.definitionTimeRatio > 2 || rs.definitionReopened) {
    remediations.push({ type: "definition-restatement" });
  }

  return {
    ...config,
    remediationBlocks: [...config.remediationBlocks, ...remediations],
  };
}

// ── Compose all rules ────────────────────────────────────────────

export function buildQuizConfig(
  state: LearnerState,
  sectionConcepts: string[]
): QuizConfig {
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