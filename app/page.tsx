"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePreferences } from "./context/Preferences-Context";
import MainSideNav from "../components/MainSideNav";

interface QuizResult {
  score: number;
  classification: string;
}

const INTERESTS = [
  { value: "basketball", label: "Basketball" },
  { value: "baseball", label: "Baseball" },
  { value: "soccer", label: "Soccer" },
  { value: "cooking", label: "Cooking" },
  { value: "fashion", label: "Fashion" },
  { value: "gaming", label: "Gaming" },
];

const CONTENT_STYLES = [
  { value: "concise", label: "Concise" },
  { value: "story", label: "Story-Driven" },
  { value: "step-by-step", label: "Step-by-Step" },
  { value: "analogies", label: "Analogy-Heavy" },
];

function classificationBadgeClass(c: string) {
  if (c === "Expert") return "bg-green-100 text-green-800 border border-green-300";
  if (c === "Intermediate") return "bg-blue-100 text-blue-800 border border-blue-300";
  return "bg-amber-100 text-amber-800 border border-amber-300";
}

export default function HomePage() {
  const { preferences, setPreferences } = usePreferences();
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [editingPrefs, setEditingPrefs] = useState(false);
  const [interest, setInterest] = useState(preferences.interest);
  const [contentStyle, setContentStyle] = useState(preferences.contentStyle);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Prefer sessionStorage (current session), fall back to localStorage (returning user)
    const sessionData = sessionStorage.getItem("quizResults");
    const localData = localStorage.getItem("learnerProfile");

    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      setQuizResult(parsed);
      localStorage.setItem("learnerProfile", sessionData);
    } else if (localData) {
      setQuizResult(JSON.parse(localData));
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    setInterest(preferences.interest);
    setContentStyle(preferences.contentStyle);
  }, [preferences]);

  const savePreferences = () => {
    setPreferences({ interest, contentStyle });
    setEditingPrefs(false);
  };

  const styleLabel = CONTENT_STYLES.find((s) => s.value === preferences.contentStyle)?.label;

  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MainSideNav />

      <main className="flex-1 ml-64 py-10 px-8">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Page header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-500 mt-1 text-sm">Your adaptive learning dashboard</p>
          </div>

          {/* Assessment / Profile card */}
          {!quizResult ? (
            /* No quiz data — prompt user to take the quiz */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Discover Your Learning Level</h2>
              <p className="text-gray-500 text-sm mb-6 max-w-md">
                Take a short 10-question assessment to personalize your calculus experience. We'll tailor content to your skill level and interests.
              </p>
              <Link
                href="/quiz"
                className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Take Assessment Quiz
              </Link>
            </div>
          ) : (
            /* Quiz data exists — show learning profile */
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-0.5">Your Learning Profile</h2>
                  <p className="text-xs text-gray-400">Personalization is active based on your assessment</p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${classificationBadgeClass(quizResult.classification)}`}>
                  {quizResult.classification}
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {quizResult.score}
                    <span className="text-sm font-normal text-gray-400"> / 20</span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Interest</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {preferences.interest || "—"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Content Style</p>
                  <p className="text-sm font-semibold text-gray-900">{styleLabel || preferences.contentStyle || "—"}</p>
                </div>
              </div>

              {/* Edit preferences inline panel */}
              {editingPrefs ? (
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Edit Preferences</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Interest</label>
                      <select
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        className="border border-gray-200 text-gray-700 text-sm p-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {INTERESTS.map((i) => (
                          <option key={i.value} value={i.value}>{i.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">Content Style</label>
                      <select
                        value={contentStyle}
                        onChange={(e) => setContentStyle(e.target.value)}
                        className="border border-gray-200 text-gray-700 text-sm p-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {CONTENT_STYLES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={savePreferences}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingPrefs(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setEditingPrefs(true)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Edit Preferences
                  </button>
                  <Link
                    href="/quiz"
                    className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Retake Assessment
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Books section */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Books Open for Personalization</h2>

            <Link
              href="/book/calculus-volume-1"
              className="group flex items-start gap-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              {/* Book spine / cover */}
              <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex-shrink-0 flex flex-col items-center justify-end pb-2 shadow-sm">
                <span className="text-white font-serif text-lg leading-none">∫</span>
                <span className="text-blue-200 text-[9px] font-medium mt-0.5">Vol. 1</span>
              </div>

              {/* Book info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    OpenStax
                  </span>
                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    Personalization Available
                  </span>
                </div>
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Calculus Volume 1
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  Functions, limits, derivatives, and integration — content tailored to your learning level and interests.
                </p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 self-center text-gray-300 group-hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
