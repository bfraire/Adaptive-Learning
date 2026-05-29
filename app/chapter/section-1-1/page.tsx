"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReaderBlocks, { ContentBlock } from "@/components/section/ReaderBlocks";

type QuizResults = { classification?: string };
type UserPreferences = { interest?: string; contentStyle?: string };

type Profile = {
  classification: string;
  interest: string;
  contentStyle: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

export default function Section11Page() {
  const chapterId = "chapter-01";
  const sectionId = "section-01-1";

  const [profile, setProfile] = useState<Profile>({
    classification: "Novice",
    interest: "basketball",
    contentStyle: "concise",
  });

  useEffect(() => {
    try {
      const quizRaw = sessionStorage.getItem("quizResults");
      const prefsRaw = localStorage.getItem("userPreferences");

      const quiz: QuizResults = quizRaw ? JSON.parse(quizRaw) : {};
      const prefs: UserPreferences = prefsRaw ? JSON.parse(prefsRaw) : {};

      setProfile({
        classification: quiz.classification ?? "Novice",
        interest: prefs.interest ?? "basketball",
        contentStyle: prefs.contentStyle ?? "concise",
      });
    } catch {
      // defaults already set in useState
    }
  }, []);

  const rewriteFilename = useMemo(() => {
    const level = slugify(profile.classification);
    const interest = slugify(profile.interest);
    const style = slugify(profile.contentStyle);
    return `${level}-${interest}-${style}.md`;
  }, [profile]);

  // Prev / next placeholders — routes will be filled in when sections are generated
  type NavSection = { label: string; title: string; route: string | null };
  const prevSection = null as NavSection | null;
  const nextSection = {
    label: "Section 1.2",
    title: "Basic Classes of Functions",
    route: null,
  } as NavSection | null;

  // R = rewriteFilename  S = "source"
  // Rewrite covers 9 headings; everything else falls back to source.
  const blocks: ContentBlock[] = useMemo(() => {
    const R = rewriteFilename;
    const S = "source";

    return [

      // ── Introduction ───────────────────────────────────────────────────────
      {
        id: "learning-objectives",
        kind: "callout",
        calloutType: "note",
        title: "Learning Objectives",
        source: { chapterId, sectionId, variant: S, heading: "Learning Objectives" },
      },
      {
        id: "intro",
        kind: "text",
        title: "Introduction",
        hideTitle: true,
        source: { chapterId, sectionId, variant: S, heading: "Introduction" },
      },

      // ── 1. What is a Function? ─────────────────────────────────────────────
      {
        id: "what-is-a-function-1",
        kind: "text",
        label: "Personalized",
        title: "What is a Function?",
        source: { chapterId, sectionId, variant: R, heading: "1. What is a Function?" },
      },
      {
        id: "gemini-figure-1",
        kind: "figure",
        src: "/Gemini-Visual-1.png",
        alt: "Diagram illustrating the concept of functions as a mapping from inputs to outputs, with a personalized theme based on the user's interest",
        maxHeightPx: 320,
      },
      {
        id: "what-is-a-function-2",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "2. What is a Function?" },
      },
      {
        id: "what-is-a-function-example-1",
        kind: "callout",
        calloutType: "note",
        title: "Example",
        source: { chapterId, sectionId, variant: R, heading: "What is a Function? Example 1" },
      },
      {
        id: "what-is-a-function-3",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "3. What is a Function?" },
      },
      {
        id: "what is a function: formal-definition",
        kind: "callout",
        calloutType: "definition",
        title: "Definition",
        source: { chapterId, sectionId, variant: S, heading: "Formal Definition" },
      },
      {
        id: "what-is-a-function-4",
        kind: "text",
        title: "Independent and Dependent Variables",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "4. What is a Function?" },
      },
      {
        id: "what is a function: wrapping-it-together",
        kind: "callout",
        calloutType: "definition",
        title: "Wrapping it Together",
        source: { chapterId, sectionId, variant: R, heading: "What is a Function? Example 2" },
      },
      {
        id: "quiz-cp-1-1",
        kind: "quiz",
        title: "Checkpoint 1.1 — Evaluating Functions",
        sectionConcepts: ["Function Evaluation", "Notation"],
        questions: [
          {
            id: "cp-1-1-a",
            question: "For $f(x) = x^2 - 3x + 5$, what is $f(1)$?",
            options: ["$3$", "$7$", "$1$", "$5$"],
            correctIndex: 0,
            explanation: "$f(1) = 1^2 - 3(1) + 5 = 1 - 3 + 5 = 3$",
            concept: "Function Evaluation",
            errorCategory: "formula-step",
            contentType: "formula",
            difficulty: "standard",
          },
          {
            id: "cp-1-1-b",
            question: "For $f(x) = x^2 - 3x + 5$, which expression equals $f(a+h)$?",
            options: [
              "$a^2 + 2ah + h^2 - 3a - 3h + 5$",
              "$a^2 + h^2 - 3a + 5$",
              "$a^2 - 3a + 5 + h$",
              "$a^2 + 2ah + h^2 + 5$",
            ],
            correctIndex: 0,
            explanation: "Substitute $x = a+h$: $(a+h)^2 - 3(a+h) + 5 = a^2 + 2ah + h^2 - 3a - 3h + 5$.",
            concept: "Function Evaluation",
            errorCategory: "formula-step",
            contentType: "formula",
            difficulty: "challenge",
          },
        ],
      },
      {
        id: "what-is-a-function-5",
        kind: "text",
        label: "Original",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "5. What is a Function?" },
      },
      {
        id: "figure-1.2",
        kind: "figure",
        title: "Figure 1.2",
        src: "/Figure_1.2.webp",
        caption: "**Figure 1.2** A function can be visualized as an input/output device.",
        alt: "Diagram illustrating the concept of functions as a mapping from inputs to outputs",
        maxHeightPx: 200,
      },
      {
        id: "figure-1.3",
        kind: "figure",
        title: "Figure 1.3",
        src: "/Figure_1.3.webp",
        caption: "**Figure 1.3** A function maps every element in the domain to exactly one element in the range. Although each input can be sent to only one output, two different inputs can be sent to the same output.",
        alt: "Output of a function represented as a mapping from input values to output values",
        maxHeightPx: 320,
      },
      {
        id: "figure-1.4",
        kind: "figure",
        title: "Figure 1.4",
        src: "/Figure_1.4.webp",
        caption: "**Figure 1.4** In this case a graph of a function f has a domain of {$1, 2, 3$} and a range of {$1, 2$}. The independent variable is $x$ and the dependent variable is $f(x)$.",
        alt: "Graph of a function plotted in the coordinate plane",
        maxHeightPx: 320,
      },
      {
        id: "graph-visual-text",
        kind: "text",
        title: "Graph Visual",
        label: "Original",
        hideTitle: true,
        source: { chapterId, sectionId, variant: S, heading: "Graph Visual" },
      },
      {
        id: "graph-of-function",
        kind: "figure",
        title: "Figure 1.5",
        src: "/Figure_1.5.webp",
        caption: "**Figure 1.5** Here we see a graph of the function $f$ with domain {$1, 2, 3$} and rule $f(x) = 3 - x$. The graph consists of the points $(x, f(x))$ for all $x$ in the domain.",
        alt: "Graph of a function plotted in the coordinate plane",
        maxHeightPx: 320,
      },

      // ── 2. Notation and Domain ─────────────────────────────────────────────
      {
        id: "Notation",
        kind: "text",
        label: "Personalized",
        title: "Notation",
        source: { chapterId, sectionId, variant: R, heading: "2. Notation" },
      },
      {
        id: "notation-example-1",
        kind: "callout",
        calloutType: "definition",
        title: "Analogy",
        source: { chapterId, sectionId, variant: R, heading: "2. Notation Example 1" },
      },
      {
        id: "how-to-write-notation",
        kind: "text",
        title: "How to Write Notation",
        label: "Original",
        hideTitle: true,
        source: { chapterId, sectionId, variant: S, heading: "How To Write Notation" },
      },
      {
        id: "interval-notation",
        kind: "text",
        label: "Personalized",
        title: "Interval Notation",
        source: { chapterId, sectionId, variant: R, heading: "Interval Notation" },
      },
      {
        id: "in-text-example-1",
        kind: "callout",
        calloutType: "note",
        title: "Example",
        source: { chapterId, sectionId, variant: R, heading: "In Text Example 1" },
      },
      {
        id: "infinite-intervals",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "Infinite Intervals" },
      },
      {
        id: "in-text-example-2",
        kind: "callout",
        calloutType: "note",
        title: "Example",
        source: { chapterId, sectionId, variant: R, heading: "In Text Example 2" },
      },
      {
        id: "quiz-cp-1-2",
        kind: "quiz",
        title: "Checkpoint 1.2 — Domain and Range",
        sectionConcepts: ["Domain", "Range", "Square Root Restriction"],
        questions: [
          {
            id: "cp-1-2-a",
            question: "What is the domain of $f(x) = \\sqrt{4 - 2x} + 5$?",
            options: [
              "$\\{x \\mid x \\leq 2\\}$",
              "$\\{x \\mid x \\geq 2\\}$",
              "$(-\\infty, \\infty)$",
              "$\\{x \\mid x \\leq 4\\}$",
            ],
            correctIndex: 0,
            explanation: "The radicand must be non-negative: $4 - 2x \\geq 0 \\Rightarrow x \\leq 2$.",
            concept: "Domain — Square Root Restriction",
            errorCategory: "formula-step",
            contentType: "formula",
            difficulty: "standard",
          },
          {
            id: "cp-1-2-b",
            question: "What is the range of $f(x) = \\sqrt{4 - 2x} + 5$?",
            options: [
              "$\\{y \\mid y \\geq 5\\}$",
              "$\\{y \\mid y \\geq 0\\}$",
              "$(-\\infty, \\infty)$",
              "$\\{y \\mid y \\geq 4\\}$",
            ],
            correctIndex: 0,
            explanation: "Since $\\sqrt{4-2x} \\geq 0$, adding 5 gives $f(x) \\geq 5$.",
            concept: "Range",
            errorCategory: "conceptual",
            contentType: "formula",
            difficulty: "standard",
          },
        ],
      },
      // ── Piecewise-Defined Functions ────────────────────────────────────────
      {
        id: "piecewise-functions",
        kind: "text",
        label: "Personalized",
        title: "Piecewise-Defined Functions",
        source: { chapterId, sectionId, variant: R, heading: "Piecewise-Defined Functions" },
      },
      {
        id: "evaluating-piecewise",
        kind: "text",
        hidelabel: true,
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "Evaluating Piecewise Functions" },
      },
      // ── Representing Functions ─────────────────────────────────────────────
      {
        id: "representing-functions",
        kind: "text",
        label: "Original",
        title: "Representing Functions",
        source: { chapterId, sectionId, variant: S, heading: "Representing Functions" },
      },
      {
        id: "tables",
        kind: "text",
        label: "Personalized",
        title: "Tables",
        source: { chapterId, sectionId, variant: R, heading: "Tables" },
      },
      {
        id: "figure-table-visual",
        kind: "figure",
        title: "Table 1.1",
        src: "/Table_1.1.png",
        caption: "**Table 1.1** Score points as a Function of Time Elapsed in a Basketball Game.",
        alt: "Table of score points.",
        maxHeightPx: 320,
      },
      {
        id: "tables-1",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "Tables Continued" },
      },
      {
        id: "graphs",
        kind: "text",
        title: "Graphs",
        source: { chapterId, sectionId, variant: R, heading: "Graphs" },
      },
      {
        id: "figure-temperature-graph-1",
        kind: "figure",
        title: "Figure 1.6",
        src: "/Gemini-Visual-4.png",
        caption: "**Figure 1.6** The graph of the data from Table 1.1 shows score points as a function of time elapsed in a basketball game.",
        alt: "Graph of score points.",
        maxHeightPx: 320,
      },
      {
        id: "graphs-1",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "Graphs Continued" },
      },
      {
        id: "algebraic-formulas",
        kind: "text",
        label: "Personalized",
        title: "Algebraic Formulas",
        source: { chapterId, sectionId, variant: R, heading: "Algebraic Formulas" },
      },
      {
        id: "algebraic-formulas-analogy-1",
        kind: "callout",
        calloutType: "note",
        title: "Analogy",
        source: { chapterId, sectionId, variant: R, heading: "Algebraic Formulas Analogy 1" },
      },
      {
        id: "algebraic-formulas-2",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "2. Algebraic Formulas" },
      },
      {
        id: "algebraic-formulas-analogy-2",
        kind: "callout",
        calloutType: "note",
        title: "Analogy",
        source: { chapterId, sectionId, variant: R, heading: "Algebraic Formulas Analogy 2" },
      },
      {
        id: "algebraic-formulas-3",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "3. Algebraic Formulas" },
      },
      {
        id: "algebraic-formulas-4",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "4. Algebraic Formulas" },
      },
      {
        id: "gemini-visual-2",
        kind: "figure",
        title: "Figure 1.8",
        src: "/Gemini-Visual-2.png",
        alt: "Graph illustrating the vertical line test for functions",
        maxHeightPx: 320,
      },
      {
        id: "vertical-line-test",
        kind: "callout",
        calloutType: "note",
        title: "Rule: Vertical Line Test",
        source: { chapterId, sectionId, variant: S, heading: "Rule: Vertical Line Test" },
      },
      {
        id: "vertical-line-test-graph",
        kind: "figure",
        title: "Figure 1.9",
        src: "/Figure_1.9.webp",
        caption: "**Figure 1.9** (a) The set of plotted points represents the graph of a function because every vertical line intersects the set of points, at most, once. (b) The set of plotted points does not represent the graph of a function because some vertical lines intersect the set of points more than once.",
        alt: "Graph illustrating the vertical line test for functions",
        maxHeightPx: 320,
      },
      {
        id: "quiz-cp-1-3",
        kind: "quiz",
        title: "Checkpoint 1.3 — Zeros of a Function",
        sectionConcepts: ["Zeros", "Factoring", "Polynomial Functions"],
        questions: [
          {
            id: "cp-1-3-a",
            question: "What are the zeros of $f(x) = x^3 - 5x^2 + 6x$?",
            options: [
              "$x = 0,\\, 2,\\, 3$",
              "$x = 1,\\, 2,\\, 3$",
              "$x = 0,\\, 3,\\, 6$",
              "$x = 0,\\, 2,\\, 5$",
            ],
            correctIndex: 0,
            explanation: "Factor: $x(x^2 - 5x + 6) = x(x-2)(x-3)$. Setting each factor to zero gives $x = 0, 2, 3$.",
            concept: "Zeros of a Function",
            errorCategory: "formula-step",
            contentType: "formula",
            difficulty: "standard",
          },
        ],
      },
      // ── Increasing and Decreasing Functions ───────────────────────────────
      {
        id: "increasing-decreasing-1",
        kind: "text",
        label: "Personalized",
        title: "Increasing and Decreasing Functions",
        source: { chapterId, sectionId, variant: R, heading: "1. Increasing and Decreasing Functions" },
      },
      {
        id: "increasing-decreasing-analogy-1",
        kind: "callout",
        calloutType: "example",
        title: "Analogy",
        source: { chapterId, sectionId, variant: R, heading: "Analogy 1: Increasing and Decreasing Functions" },
      },
      {
        id: "increasing-decreasing-2",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "2. Increasing and Decreasing Functions" },
      },
      {
        id: "increasing-decreasing-analogy-2",
        kind: "callout",
        calloutType: "example",
        title: "Analogy",
        source: { chapterId, sectionId, variant: R, heading: "Analogy 2: Increasing and Decreasing Functions" },
      },
      {
        id: "increasing-decreasing-3",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "3. Increasing and Decreasing Functions" },
      },
      {
        id: "gemini-visual-3",
        kind: "figure",
        title: "Figure 1.10",
        src: "/Gemini-Visual-3.png",
        caption: "**Figure 1.10** Graphs of increasing and decreasing functions.",
        alt: "Graph of functions illustrating increasing and decreasing behavior",
        maxHeightPx: 320,
      },
      {
        id: "definition-increasing-decreasing",
        kind: "callout",
        calloutType: "definition",
        title: "Definition",
        source: { chapterId, sectionId, variant: S, heading: "Definition: Increasing and Decreasing" },
      },
      {
        id: "increasing-decreasing-4",
        kind: "figure",
        title: "Figure 1.11",
        src: "/Figure_1.11.png",
        alt: "Graph of functions illustrating increasing and decreasing behavior",
        caption: "**Figure 1.11** (a) The function $f(x) = 3x$ is increasing on the interval $(-∞, ∞)$. (b) The function $f(x) = -x^3$ is decreasing on the interval $(-∞, ∞)$.",
        maxHeightPx: 320,
      },
      // ── Combining Functions ────────────────────────────────────────────────
      {
        id: "combining-functions",
        kind: "text",
        label: "Personalized",
        title: "Combining Functions",
        source: { chapterId, sectionId, variant: R, heading: "Combining Functions" },
      },
      {
        id: "combining-functions-operators",
        kind: "text",
        label: "Original",
        title: "Combine Functions with Mathematical Operators",
        source: { chapterId, sectionId, variant: S, heading: "Combining Functions with Mathematical Operators" },
      },
      {
        id: "quiz-cp-1-4",
        kind: "quiz",
        title: "Checkpoint 1.4 — Arithmetic of Functions",
        sectionConcepts: ["Combining Functions", "Domain Restrictions"],
        questions: [
          {
            id: "cp-1-4-a",
            question: "For $f(x) = x^2 + 3$ and $g(x) = 2x - 5$, what is $\\left(\\dfrac{f}{g}\\right)(x)$?",
            options: [
              "$\\dfrac{x^2 + 3}{2x - 5}$",
              "$\\dfrac{2x - 5}{x^2 + 3}$",
              "$\\dfrac{x^2 - 2}{2x}$",
              "$\\dfrac{x^2 + 3}{2x + 5}$",
            ],
            correctIndex: 0,
            explanation: "$(f/g)(x) = f(x)/g(x) = (x^2+3)/(2x-5)$.",
            concept: "Arithmetic of Functions",
            errorCategory: "formula-step",
            contentType: "formula",
            difficulty: "standard",
          },
          {
            id: "cp-1-4-b",
            question: "What value must be excluded from the domain of $\\left(\\dfrac{f}{g}\\right)(x)$ when $g(x) = 2x - 5$?",
            options: [
              "$x = \\dfrac{5}{2}$",
              "$x = 5$",
              "$x = 2$",
              "No values are excluded",
            ],
            correctIndex: 0,
            explanation: "The denominator $g(x) = 2x-5 = 0$ when $x = 5/2$, so $x = 5/2$ is excluded.",
            concept: "Domain Restrictions",
            errorCategory: "conceptual",
            contentType: "formula",
            difficulty: "scaffold",
          },
        ],
      },
      // ── Function Composition ───────────────────────────────────────────────
      {
        id: "function-composition",
        kind: "text",
        title: "Composite Functions",
        label: "Personalized",
        source: { chapterId, sectionId, variant: R, heading: "Composite Functions" },
      },
      {
        id: "definition-composition",
        kind: "callout",
        calloutType: "definition",
        title: "Definition",
        source: { chapterId, sectionId, variant: S, heading: "Definition: Function Composition" },
      },
      {
        id: "definition-composition-1",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: S, heading: "Definition: Function Composition Continued" },
      },
      {
        id: "domain-range-diagram",
        kind: "figure",
        title: "Figure 1.12",
        src: "/Figure_1.12.webp",
        alt: "Graph illustrating the domain and range of a function",
        caption:"**Figure 1.12** For the composite function $g ∘ f$, we have $(g ∘ f)(1) = 4$, $(g ∘ f)(2) = 5$, and $(g ∘ f)(3) = 4$",
        maxHeightPx: 320,
      },
      {
        id: "quiz-cp-1-5",
        kind: "quiz",
        title: "Checkpoint 1.5 & 1.6 — Function Composition",
        sectionConcepts: ["Composite Functions", "Composition Order"],
        questions: [
          {
            id: "cp-1-5-a",
            question: "Let $f(x) = 2 - 5x$ and $g(x) = \\sqrt{x}$. Which expression equals $(f \\circ g)(x)$?",
            options: [
              "$2 - 5\\sqrt{x}$",
              "$\\sqrt{2 - 5x}$",
              "$5\\sqrt{x} - 2$",
              "$(2 - 5x)^2$",
            ],
            correctIndex: 0,
            explanation: "$(f \\circ g)(x) = f(g(x)) = f(\\sqrt{x}) = 2 - 5\\sqrt{x}$.",
            concept: "Composite Functions",
            errorCategory: "formula-step",
            contentType: "formula",
            difficulty: "standard",
          },
          {
            id: "cp-1-6-a",
            question: "An item is on sale for 10% off, then a coupon takes an additional 30% off the sale price. If the original price is $x$ dollars, what is the final price?",
            options: [
              "$0.63x$",
              "$0.60x$",
              "$0.40x$",
              "$0.37x$",
            ],
            correctIndex: 0,
            explanation: "Sale price: $0.9x$. Coupon: $0.7 \\times 0.9x = 0.63x$.",
            concept: "Composite Functions",
            errorCategory: "scenario-misapply",
            contentType: "example",
            difficulty: "standard",
          },
        ],
      },
      // ── Symmetry of Functions ──────────────────────────────────────────────
      {
        id: "symmetry-functions-1",
        kind: "text",
        label: "Personalized",
        title: "Symmetry of Functions",
        source: { chapterId, sectionId, variant: R, heading: "1. Symmetry in Functions" },
      },
      {
        id: "symmetry-functions-analogy-1",
        kind: "callout",
        calloutType: "example",
        title: "Analogy",
        source: { chapterId, sectionId, variant: R, heading: "Symmetry in Functions Analogy 1" },
      },
      {
        id: "symmetry-functions-2",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: R, heading: "2. Symmetry in Functions" },
      },
      {
        id: "symmetry-functions-analogy-2",
        kind: "callout",
        calloutType: "example",
        title: "Analogy",
        source: { chapterId, sectionId, variant: R, heading: "Symmetry in Functions Analogy 2" },
      },
      {
        id: "symmetry-diagram",
        kind: "figure",
        title: "Figure 1.13",
        src: "/Figure_1.13.webp",
        alt: "Graph illustrating the symmetry of a function",
        caption:"**Figure 1.13** (a) A graph that is symmetric about the y-axis. (b) A graph that is symmetric about the origin.", 
        maxHeightPx: 320,
      },
      {
        id: "symmetry-functions-3",
        kind: "text",
        hideTitle: true,
        source: { chapterId, sectionId, variant: S, heading: "Symmetry of Functions-1" },
      },
      {
        id: "definition-symmetry",
        kind: "callout",
        calloutType: "definition",
        title: "Definition",
        source: { chapterId, sectionId, variant: S, heading: "Definition: Even and Odd Functions" },
      },
      {
        id: "quiz-cp-1-7",
        kind: "quiz",
        title: "Checkpoint 1.7 — Even and Odd Functions",
        sectionConcepts: ["Symmetry", "Even Functions", "Odd Functions"],
        questions: [
          {
            id: "cp-1-7-a",
            question: "Is $f(x) = 4x^3 - 5x$ even, odd, or neither?",
            options: [
              "Odd",
              "Even",
              "Neither",
              "Cannot be determined",
            ],
            correctIndex: 0,
            explanation: "$f(-x) = 4(-x)^3 - 5(-x) = -4x^3 + 5x = -(4x^3 - 5x) = -f(x)$, so $f$ is odd.",
            concept: "Odd Functions",
            errorCategory: "conceptual",
            contentType: "definition",
            difficulty: "standard",
          },
        ],
      },
      {
        id: "absolute-value-function",
        kind: "text",
        hideTitle: true,
        label: "Original",
        source: { chapterId, sectionId, variant: S, heading: "Absolute Value Function" },
      },   
      {
        id: "absolute-value-graph",
        kind: "figure",
        title: "Figure 1.14",
        src: "/Figure_1.14.webp",
        alt: "Graph illustrating the symmetry of the absolute value function",
        caption: "**Figure 1.14** The graph of $f(x) = |x|$ is symmetric about the y-axis.",
        maxHeightPx: 320,
      },
      {
        id: "quiz-cp-1-8",
        kind: "quiz",
        title: "Checkpoint 1.8 — Absolute Value Function",
        sectionConcepts: ["Absolute Value", "Domain and Range"],
        questions: [
          {
            id: "cp-1-8-a",
            question: "For $f(x) = |x + 2| - 4$, what is the domain?",
            options: [
              "$(-\\infty, \\infty)$",
              "$\\{x \\mid x \\geq -2\\}$",
              "$\\{x \\mid x \\geq -4\\}$",
              "$\\{x \\mid x \\geq 0\\}$",
            ],
            correctIndex: 0,
            explanation: "The absolute value is defined for all real numbers, so the domain is $(-\\infty, \\infty)$.",
            concept: "Domain — Absolute Value",
            errorCategory: "conceptual",
            contentType: "definition",
            difficulty: "scaffold",
          },
          {
            id: "cp-1-8-b",
            question: "For $f(x) = |x + 2| - 4$, what is the range?",
            options: [
              "$\\{y \\mid y \\geq -4\\}$",
              "$\\{y \\mid y \\geq -2\\}$",
              "$(-\\infty, \\infty)$",
              "$\\{y \\mid y \\geq 0\\}$",
            ],
            correctIndex: 0,
            explanation: "Since $|x+2| \\geq 0$, we have $f(x) = |x+2| - 4 \\geq -4$. The minimum value $-4$ is achieved at $x = -2$.",
            concept: "Range — Absolute Value",
            errorCategory: "conceptual",
            contentType: "formula",
            difficulty: "standard",
          },
        ],
      },
    ];
  }, [chapterId, sectionId, rewriteFilename]);

  return (
    <div className="min-h-screen bg-white text-black">

      {/* ── Fixed top navigation bar ── */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-30 flex items-center px-5 gap-3">

        {/* Back to home */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>

        <span className="text-gray-200 select-none">|</span>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-gray-400 min-w-0 flex-1">
          <Link href="/book/calculus-volume-1" className="hover:text-blue-600 transition-colors flex-shrink-0">
            Calculus Vol. 1
          </Link>
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/book/calculus-volume-1" className="hover:text-blue-600 transition-colors flex-shrink-0">
            Chapter 1
          </Link>
          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600 font-medium truncate">Review of Functions</span>
        </div>

        {/* Right side: profile chip + quick links */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="hidden sm:inline-flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full gap-1 capitalize">
            {profile.classification}
            {profile.interest && <><span className="text-gray-300">·</span>{profile.interest}</>}
          </span>
          <Link href="/score" className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors">
            My Score
          </Link>
          <Link
            href="/practice/1-1"
            className="text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            Practice
          </Link>
          <Link
            href="/quiz"
            className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            Retake Quiz
          </Link>
        </div>
      </nav>

      {/* ── Main content — offset for fixed nav ── */}
      <div className="max-w-3xl mx-auto px-5 pt-20 pb-10">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Chapter 1
            </span>
            <span className="text-xs text-gray-400">Section 1.1</span>
          </div>
          <h1 className="text-3xl font-bold text-black">Review of Functions</h1>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
              Personalized
            </span>
            <span className="text-xs text-gray-400 capitalize">
              {profile.classification} · {profile.interest} · {profile.contentStyle}
            </span>
          </div>
        </header>

        <ReaderBlocks blocks={blocks} />

        {/* ── Bottom prev / next navigation ── */}
        <footer className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex justify-between items-start gap-6">

            {/* Previous section */}
            <div className="flex-1">
              {prevSection ? (
                <Link href={prevSection.route!} className="group flex flex-col gap-0.5">
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-blue-500 transition-colors mb-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </span>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    {prevSection.label}
                  </span>
                  <span className="text-sm text-gray-500">{prevSection.title}</span>
                </Link>
              ) : (
                <div className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-300 mb-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </span>
                  <span className="text-sm text-gray-300">No previous section</span>
                </div>
              )}
            </div>

            {/* Next section */}
            <div className="flex-1 text-right">
              {nextSection?.route ? (
                <Link href={nextSection.route!} className="group flex flex-col items-end gap-0.5">
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-blue-500 transition-colors mb-1">
                    Next
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    {nextSection.label}
                  </span>
                  <span className="text-sm text-gray-500">{nextSection.title}</span>
                </Link>
              ) : nextSection ? (
                <div className="flex flex-col items-end gap-0.5">
                  <span className="flex items-center gap-1 text-xs font-medium text-gray-300 mb-1">
                    Next
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-gray-400">{nextSection.label}</span>
                  <span className="text-sm text-gray-400">{nextSection.title}</span>
                  <span className="text-xs text-gray-300 mt-0.5">Coming soon</span>
                </div>
              ) : null}
            </div>

          </div>
        </footer>
      </div>
    </div>
  );
}
