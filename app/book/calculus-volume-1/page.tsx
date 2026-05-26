"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CALCULUS_V1, type Chapter, type Section } from "../../../lib/bookData";

interface UserProfile {
  score: number;
  classification: string;
  interest?: string;
  contentStyle?: string;
}

// ─── Book Table-of-Contents Sidebar ───────────────────────────────────────────

function BookSideNav({
  chapters,
  expandedInNav,
  onToggleNav,
}: {
  chapters: Chapter[];
  expandedInNav: Set<number>;
  onToggleNav: (id: number) => void;
}) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 z-20 flex flex-col">
      {/* Top: back link + branding */}
      <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-3"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Library
        </Link>
        <h2 className="text-sm font-bold text-gray-900 leading-tight">Calculus Volume 1</h2>
        <p className="text-xs text-gray-400 mt-0.5">OpenStax</p>
      </div>

      {/* Table of contents */}
      <div className="flex-1 overflow-y-auto py-3">
        <p className="px-5 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Contents
        </p>

        {chapters.map((chapter) => {
          const isExpanded = expandedInNav.has(chapter.id);
          return (
            <div key={chapter.id}>
              <button
                onClick={() => onToggleNav(chapter.id)}
                className="w-full flex items-center gap-2 px-5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
                <span>
                  Ch. {chapter.id} · {chapter.title}
                </span>
              </button>

              {isExpanded && (
                <div className="pl-10 pr-4 pb-1">
                  {chapter.sections.map((section) => (
                    <div key={section.id} className="py-1">
                      {section.route ? (
                        <Link
                          href={section.route}
                          className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition-colors group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:bg-blue-600 flex-shrink-0" />
                          {section.id} {section.title}
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2 text-xs text-gray-300 cursor-not-allowed">
                          <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          {section.id} {section.title}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

// ─── Section Card inside an open chapter ──────────────────────────────────────

function SectionCard({ section, profile }: { section: Section; profile: UserProfile | null }) {
  const isAvailable = section.route !== null;

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
        isAvailable
          ? "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 bg-white cursor-pointer group"
          : "border-gray-100 bg-gray-50 opacity-70"
      }`}
    >
      {/* Status dot */}
      <div className="flex-shrink-0 mt-0.5">
        {isAvailable ? (
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" />
        ) : (
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 block" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-0.5">Section {section.id}</p>
            {isAvailable && section.route ? (
              <Link
                href={section.route}
                className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors hover:underline"
              >
                {section.title}
              </Link>
            ) : (
              <p className="text-sm font-semibold text-gray-500">{section.title}</p>
            )}
          </div>

          {isAvailable ? (
            <span className="flex-shrink-0 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Available
            </span>
          ) : (
            <span className="flex-shrink-0 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Coming Soon
            </span>
          )}
        </div>

        {/* Personalization info */}
        {isAvailable && (
          <div className="mt-2">
            {profile ? (
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                  {profile.classification}
                </span>
                {profile.interest && (
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md capitalize">
                    {profile.interest}
                  </span>
                )}
                {profile.contentStyle && (
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md capitalize">
                    {profile.contentStyle}
                  </span>
                )}
                <span className="text-[11px] text-green-600 font-medium flex items-center gap-0.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Personalized
                </span>
              </div>
            ) : (
              <Link
                href="/quiz"
                className="inline-flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-700 mt-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Take the quiz to personalize this section
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Arrow for available sections */}
      {isAvailable && section.route && (
        <Link
          href={section.route}
          className="flex-shrink-0 self-center text-gray-300 group-hover:text-blue-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}

// ─── Chapter Accordion ─────────────────────────────────────────────────────────

function ChapterAccordion({
  chapter,
  profile,
  defaultOpen,
}: {
  chapter: Chapter;
  profile: UserProfile | null;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const availableCount = chapter.sections.filter((s) => s.route).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Chapter header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        {/* Chapter number badge */}
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">{chapter.id}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-400 mb-0.5">Chapter {chapter.id}</p>
          <h3 className="text-base font-semibold text-gray-900">{chapter.title}</h3>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-gray-400">
            {availableCount} of {chapter.sections.length} available
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Sections list */}
      {open && (
        <div className="border-t border-gray-100 px-6 py-4 space-y-2">
          {chapter.sections.map((section) => (
            <SectionCard key={section.id} section={section} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function BookPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [navExpanded, setNavExpanded] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    const sessionData = sessionStorage.getItem("quizResults");
    const localData = localStorage.getItem("learnerProfile");
    const prefsData = localStorage.getItem("userPreferences");

    let quizInfo: { score: number; classification: string } | null = null;

    if (sessionData) {
      quizInfo = JSON.parse(sessionData);
      localStorage.setItem("learnerProfile", sessionData);
    } else if (localData) {
      quizInfo = JSON.parse(localData);
    }

    if (quizInfo) {
      const prefs = prefsData ? JSON.parse(prefsData) : {};
      setProfile({
        score: quizInfo.score,
        classification: quizInfo.classification,
        interest: prefs.interest,
        contentStyle: prefs.contentStyle,
      });
    }

    setHydrated(true);
  }, []);

  const toggleNav = (id: number) => {
    setNavExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!hydrated) return null;

  const book = CALCULUS_V1;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BookSideNav
        chapters={book.chapters}
        expandedInNav={navExpanded}
        onToggleNav={toggleNav}
      />

      <main className="flex-1 ml-72 py-10 px-8">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── Book Info Card ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex gap-6 p-8">
              {/* Book cover visual */}
              <div className="w-24 h-32 rounded-xl bg-gradient-to-br from-blue-500 to-blue-800 flex-shrink-0 flex flex-col items-center justify-center shadow-md">
                <span className="text-white font-serif text-4xl leading-none mb-1">∫</span>
                <span className="text-blue-200 text-xs font-semibold tracking-wide">CALCULUS</span>
                <span className="text-blue-300 text-[10px]">Volume 1</span>
              </div>

              {/* Book metadata */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    OpenStax
                  </span>
                  <span className="text-xs text-gray-400">Open Educational Resource</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{book.title}</h1>
                <p className="text-sm text-gray-400 mb-4">Sourced by {book.source}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{book.summary}</p>
              </div>
            </div>

            {/* Stats bar */}
            <div className="border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
              <div className="px-6 py-4 text-center">
                <p className="text-xl font-bold text-gray-900">{book.chapters.length}</p>
                <p className="text-xs text-gray-400 mt-0.5">Chapters</p>
              </div>
              <div className="px-6 py-4 text-center">
                <p className="text-xl font-bold text-gray-900">
                  {book.chapters.reduce((sum, ch) => sum + ch.sections.length, 0)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Sections</p>
              </div>
              <div className="px-6 py-4 text-center">
                <p className="text-xl font-bold text-gray-900">
                  {book.chapters.reduce((sum, ch) => sum + ch.sections.filter((s) => s.route).length, 0)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Personalized</p>
              </div>
            </div>
          </div>

          {/* ── Personalization status banner ── */}
          {profile ? (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-800">
                Content is personalized for{" "}
                <span className="font-semibold">{profile.classification}</span>
                {profile.interest && (
                  <> · <span className="font-semibold capitalize">{profile.interest}</span></>
                )}
                {profile.contentStyle && (
                  <> · <span className="font-semibold capitalize">{profile.contentStyle}</span></>
                )}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-5 py-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-amber-800">Take the assessment quiz to unlock personalized content.</p>
              </div>
              <Link
                href="/quiz"
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline ml-4 flex-shrink-0"
              >
                Take Quiz →
              </Link>
            </div>
          )}

          {/* ── Chapter heading ── */}
          <div>
            <h2 className="text-lg font-bold text-gray-900">Chapters</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Click a chapter to expand its sections. Personalized sections show your learning profile.
            </p>
          </div>

          {/* ── Chapter Accordions ── */}
          {book.chapters.map((chapter) => (
            <ChapterAccordion
              key={chapter.id}
              chapter={chapter}
              profile={profile}
              defaultOpen={chapter.id === 1}
            />
          ))}

        </div>
      </main>
    </div>
  );
}
