"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ResultsPage() {
  const [score, setScore] = useState<number | null>(null);
  const [classification, setClassification] = useState<string>("");

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResults");
    if (stored) {
      const parsed = JSON.parse(stored);
      setScore(parsed.score);
      setClassification(parsed.classification);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Your Results</h1>

      {score !== null ? (
        <>
          <p className="text-2xl font-semibold mb-2">Score: {score} / 20</p>
          <p className="text-xl mb-6">
            Classification: <span className="font-bold">{classification}</span>
          </p>

          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md"
          >
            Back to Home
          </Link>
        </>
      ) : (
        <p className="text-lg">No results found.</p>
      )}
    </div>
  );
}
