"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MainSideNav from "../../components/MainSideNav";

interface QuizResult {
  score: number;
  classification: string;
}

const MAX_SCORE = 20;

const LEVEL_INFO: Record<string, { color: string; bg: string; border: string; description: string; range: string }> = {
  Expert: {
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-300",
    description: "You have a strong grasp of calculus fundamentals. Content is presented at full depth with minimal scaffolding.",
    range: "13–20 points",
  },
  Intermediate: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-300",
    description: "You have solid foundational knowledge. Content includes guided examples and reinforcement where helpful.",
    range: "7–12 points",
  },
  Novice: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-300",
    description: "You're building your calculus foundation. Content uses analogies, step-by-step breakdowns, and extra examples.",
    range: "0–6 points",
  },
};

export default function ScorePage() {
  const [result, setResult] = useState<QuizResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("quizResults");
    const localData = localStorage.getItem("learnerProfile");

    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      setResult(parsed);
      localStorage.setItem("learnerProfile", sessionData);
    } else if (localData) {
      setResult(JSON.parse(localData));
    }

    setHydrated(true);
  }, []);

  const levelInfo = result ? LEVEL_INFO[result.classification] ?? LEVEL_INFO["Novice"] : null;
  const pct = result ? Math.round((result.score / MAX_SCORE) * 100) : 0;

  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MainSideNav />

      <main className="flex-1 ml-64 py-10 px-8">
        <div className="max-w-2xl mx-auto space-y-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Score</h1>
            <p className="text-gray-500 mt-1 text-sm">Your latest assessment results</p>
          </div>

          {!result ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium mb-1">No assessment on record</p>
              <p className="text-sm text-gray-400 mb-6">Take the quiz to see your score and learning level here.</p>
              <Link
                href="/quiz"
                className="inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Take Assessment Quiz
              </Link>
            </div>
          ) : (
            <>
              {/* Score card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base font-semibold text-gray-700">Assessment Score</h2>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${levelInfo!.color} ${levelInfo!.bg} ${levelInfo!.border}`}>
                    {result.classification}
                  </span>
                </div>

                {/* Score display */}
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-6xl font-bold text-gray-900">{result.score}</span>
                  <span className="text-xl text-gray-400 font-medium pb-1.5">/ {MAX_SCORE}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                  <div
                    className="h-3 rounded-full bg-blue-500 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">{pct}% of maximum score</p>
              </div>

              {/* Level details card */}
              <div className={`rounded-2xl border p-6 ${levelInfo!.bg} ${levelInfo!.border}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className={`text-base font-semibold mb-1 ${levelInfo!.color}`}>
                      {result.classification} Level
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{levelInfo!.description}</p>
                    <p className="text-xs text-gray-400">Score range: {levelInfo!.range}</p>
                  </div>
                </div>
              </div>

              {/* Scoring scale */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Score Scale</h3>
                <div className="space-y-3">
                  {[
                    { label: "Expert", range: "13–20", color: "bg-green-500", textColor: "text-green-700" },
                    { label: "Intermediate", range: "7–12", color: "bg-blue-500", textColor: "text-blue-700" },
                    { label: "Novice", range: "0–6", color: "bg-amber-500", textColor: "text-amber-700" },
                  ].map((tier) => (
                    <div key={tier.label} className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${tier.color} flex-shrink-0`} />
                      <span className={`text-sm font-medium w-24 ${tier.textColor}`}>{tier.label}</span>
                      <span className="text-sm text-gray-400">{tier.range} points</span>
                      {result.classification === tier.label && (
                        <span className="ml-auto text-xs text-gray-500 font-medium">← your level</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Link
                  href="/quiz"
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Retake Assessment
                </Link>
                <Link
                  href="/results"
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  View Detailed Results
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
