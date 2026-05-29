"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { InlineMath, BlockMath } from "react-katex";

// ── Types matching TurnResponse from api_server.py ──────────────────────────

type Turn = {
  turn_number: number;
  phase: "exercise" | "redirect" | "section_complete";

  // Exercise
  item_id?: string;
  question?: string;
  answer?: Record<string, unknown>;
  self_check_only?: boolean;
  difficulty?: number;
  problem_type?: string;
  concept_id?: string;
  concept_label?: string;
  is_repeat_cycle?: boolean;

  // Redirect
  redirect_message?: string;
  redirect_section?: string;

  // Feedback
  last_item_id?: string;
  last_correct?: boolean;
  last_p_before?: number;
  last_p_after?: number;
  last_action?: string;

  // Progress
  section_mastery: number;
  section_complete: boolean;
  concepts_mastered: string[];
  p_current_concept?: number;
};

// ── LaTeX rendering helper ───────────────────────────────────────────────────

function renderMath(text: string) {
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      return <BlockMath key={i} math={part.slice(2, -2)} />;
    }
    if (part.startsWith("$") && part.endsWith("$")) {
      return <InlineMath key={i} math={part.slice(1, -1)} />;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Difficulty badge ─────────────────────────────────────────────────────────

const DIFF_LABEL: Record<number, string> = { 1: "Easy", 2: "Medium", 3: "Hard" };
const DIFF_COLOR: Record<number, string> = {
  1: "bg-green-100 text-green-700",
  2: "bg-yellow-100 text-yellow-700",
  3: "bg-red-100 text-red-700",
};

// ── Mastery bar ───────────────────────────────────────────────────────────────

function MasteryBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500 w-28">Section mastery</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-gray-700 font-medium w-8 text-right">{pct}%</span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PracticePage() {
  const studentId = useRef<string>("");
  const [classification, setClassification] = useState("Novice");
  const [turn, setTurn] = useState<Turn | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Answer state
  const [revealed, setRevealed] = useState(false);
  const [selfCheckResult, setSelfCheckResult] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Feedback strip (shown briefly after submit)
  const [feedback, setFeedback] = useState<{ correct: boolean; pBefore: number; pAfter: number } | null>(null);

  // ── Boot: read sessionStorage and start session ────────────────────────────

  useEffect(() => {
    try {
      const quizRaw = sessionStorage.getItem("quizResults");
      const quiz = quizRaw ? JSON.parse(quizRaw) : {};
      const cls = quiz.classification ?? "Novice";
      setClassification(cls);

      // Stable per-browser student id
      let sid = localStorage.getItem("studentId");
      if (!sid) {
        sid = `student_${Date.now()}`;
        localStorage.setItem("studentId", sid);
      }
      studentId.current = sid;

      startSession(sid, cls);
    } catch {
      setError("Could not read quiz results. Please complete the quiz first.");
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── API helpers ────────────────────────────────────────────────────────────

  const startSession = useCallback(async (sid: string, cls: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/exercise/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: sid, section_id: "1.1", classification: cls }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data: Turn = await res.json();
      setTurn(data);
    } catch (e) {
      setError(`Failed to start session: ${e}. Make sure the exercise server is running (uvicorn api_server:app --port 8000).`);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitResponse = useCallback(async (itemId: string, correct: boolean) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/exercise/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId.current,
          section_id: "1.1",
          item_id: itemId,
          correct,
        }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data: Turn = await res.json();

      // Show brief feedback before switching to next turn
      if (data.last_correct !== undefined && data.last_p_before !== undefined && data.last_p_after !== undefined) {
        setFeedback({ correct: data.last_correct, pBefore: data.last_p_before, pAfter: data.last_p_after });
        setTimeout(() => {
          setFeedback(null);
          setTurn(data);
          setRevealed(false);
          setSelfCheckResult(null);
        }, 1800);
      } else {
        setTurn(data);
        setRevealed(false);
        setSelfCheckResult(null);
      }
    } catch (e) {
      setError(`Submission failed: ${e}`);
    } finally {
      setSubmitting(false);
    }
  }, []);

  // ── Render states ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading adaptive session…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-red-600 font-medium">{error}</p>
          <Link href="/quiz" className="inline-block text-sm text-blue-600 underline">
            Go to assessment quiz
          </Link>
        </div>
      </div>
    );
  }

  if (!turn) return null;

  return (
    <div
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}
    >
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/chapter/section-1-1" className="text-blue-500 text-sm hover:underline">
            ← Section 1.1
          </Link>
          <span className="text-gray-400 text-xs">|</span>
          <span className="text-gray-600 text-sm font-medium">Adaptive Practice</span>
        </div>
        <span className="text-xs text-gray-400">{classification} · Turn {turn.turn_number}</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Mastery bar */}
        <MasteryBar value={turn.section_mastery} />

        {/* Feedback strip */}
        {feedback && (
          <div
            className={`rounded-lg px-4 py-3 text-sm font-medium transition-all ${
              feedback.correct
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {feedback.correct ? "Correct!" : "Not quite."}{" "}
            <span className="font-normal opacity-75">
              Concept mastery: {Math.round(feedback.pBefore * 100)}% → {Math.round(feedback.pAfter * 100)}%
            </span>
          </div>
        )}

        {/* ── Phase: exercise ─────────────────────────────────────────────── */}
        {turn.phase === "exercise" && !feedback && (
          <div className="space-y-5">
            {/* Meta */}
            <div className="flex flex-wrap gap-2 items-center text-xs">
              {turn.concept_label && (
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {turn.concept_label}
                </span>
              )}
              {turn.difficulty !== undefined && (
                <span className={`px-2 py-0.5 rounded ${DIFF_COLOR[turn.difficulty] ?? ""}`}>
                  {DIFF_LABEL[turn.difficulty] ?? turn.difficulty}
                </span>
              )}
              {turn.problem_type && (
                <span className="text-gray-400">{turn.problem_type}</span>
              )}
              {turn.is_repeat_cycle && (
                <span className="text-amber-600 font-medium">Review</span>
              )}
            </div>

            {/* Question */}
            <div className="text-base leading-relaxed">
              {turn.question ? renderMath(turn.question) : <em className="text-gray-400">No question text.</em>}
            </div>

            {/* Self-check only: reveal answer button */}
            {turn.self_check_only ? (
              <div className="space-y-4">
                {!revealed ? (
                  <button
                    onClick={() => setRevealed(true)}
                    className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    Show answer
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                      <p className="font-medium text-gray-700 mb-1">Answer</p>
                      <div className="text-gray-800">
                        {turn.answer
                          ? renderMath(JSON.stringify(turn.answer).replace(/^"|"$/g, ""))
                          : <em>No answer provided.</em>}
                      </div>
                    </div>

                    {selfCheckResult === null && (
                      <div className="flex gap-3">
                        <button
                          disabled={submitting}
                          onClick={() => {
                            setSelfCheckResult(true);
                            submitResponse(turn.item_id!, true);
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          I got it right
                        </button>
                        <button
                          disabled={submitting}
                          onClick={() => {
                            setSelfCheckResult(false);
                            submitResponse(turn.item_id!, false);
                          }}
                          className="px-4 py-2 bg-red-400 text-white rounded-lg text-sm font-medium hover:bg-red-500 transition-colors disabled:opacity-50"
                        >
                          I got it wrong
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Agent-graded: show answer inline since backend auto-grades */
              <div className="space-y-4">
                {!revealed ? (
                  <button
                    onClick={() => setRevealed(true)}
                    className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    Show answer
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                      <p className="font-medium text-gray-700 mb-1">Answer</p>
                      <div className="text-gray-800">
                        {turn.answer
                          ? renderMath(JSON.stringify(turn.answer).replace(/^"|"$/g, ""))
                          : <em>No answer provided.</em>}
                      </div>
                    </div>
                    {selfCheckResult === null && (
                      <div className="flex gap-3">
                        <button
                          disabled={submitting}
                          onClick={() => {
                            setSelfCheckResult(true);
                            submitResponse(turn.item_id!, true);
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          Correct
                        </button>
                        <button
                          disabled={submitting}
                          onClick={() => {
                            setSelfCheckResult(false);
                            submitResponse(turn.item_id!, false);
                          }}
                          className="px-4 py-2 bg-red-400 text-white rounded-lg text-sm font-medium hover:bg-red-500 transition-colors disabled:opacity-50"
                        >
                          Incorrect
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Phase: redirect ─────────────────────────────────────────────── */}
        {turn.phase === "redirect" && !feedback && (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 space-y-3">
              <p className="font-semibold text-amber-800">Prerequisite Review Needed</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {turn.redirect_message ?? "Some prerequisite concepts need review before continuing."}
              </p>
              {turn.redirect_section && (
                <p className="text-xs text-amber-700">
                  Suggested section:{" "}
                  <span className="font-medium">{turn.redirect_section}</span>
                </p>
              )}
            </div>
            <button
              onClick={() => submitResponse(turn.item_id ?? "redirect", true)}
              disabled={submitting}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Continue practice
            </button>
          </div>
        )}

        {/* ── Phase: section_complete ─────────────────────────────────────── */}
        {turn.phase === "section_complete" && !feedback && (
          <div className="space-y-6 text-center py-8">
            <div className="text-5xl">🎉</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Section 1.1 Complete!</h2>
              <p className="text-gray-500 text-sm">
                You mastered {turn.concepts_mastered.length} concept{turn.concepts_mastered.length !== 1 ? "s" : ""} with{" "}
                {Math.round(turn.section_mastery * 100)}% overall mastery.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Link
                href="/chapter/section-1-1"
                className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Back to reading
              </Link>
              <button
                onClick={() => startSession(studentId.current, classification)}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Restart session
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
