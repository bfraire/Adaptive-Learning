"use client";
import React, { useState } from "react";
import { BlockMath } from "react-katex";
import { useRouter } from "next/navigation";


export default function Quiz() {
const [answers, setAnswers] = useState<Record<number, { answer?: string; confidence?: number }>>({});
const [submitted, setSubmitted] = useState(false);
const [score, setScore] = useState(0);
const [classification, setClassification] = useState("empty");
const router = useRouter();

{/* Questions for Assessment Quiz */}
const questions = [
{
    id: 1,
    section: "1. Conceptual Understanding (Functions)",
    type: "mc",
    q: "Which condition must a relation satisfy to be classified as a function, passing the vertical line test?",
    options: [
    "A. For every output value (y), there is exactly one input value (x).",
    "B. For every input value (x), there is exactly one output value (y).",
    "C. The function is symmetric about the y-axis.",
    "D. The domain must be all real numbers."
    ],
    correct: "B. For every input value (x), there is exactly one output value (y).",
    explanation:
    "A function maps each input to exactly one output. The graph must pass the vertical line test.",
    difficulty: 1,
    points: 1,
},
{
    id: 2,
    type: "short",
    q: "State the domain of the rational function f(x) = x^2 - 16 / x. Provide your answer using set notation or interval notation.",
    correct: "(-∞, -4) ∪ (-4, 4) ∪ (4, ∞)",
    explanation:
    "Denominator cannot be zero. Exclude x = ±4.",
    difficulty: 1,
    points: 1,
},
{
    id: 3,
    type: "mc-confidence",
    q: "Which of the following functions is a transcendental function?",
    options: [
    "A. f(x) = (x - 2) / (x^3 + 1)",
    "B. f(x) = 5x^4 - 2x + 1",
    "C. f(x) = ln(x) + cos(x)",
    "D. f(x) = x^2 + 5"
    ],
    correct: "C. f(x) = ln(x) + cos(x)",
    explanation:
    "Transcendental functions include trig, exponential, and logarithmic functions.",
    difficulty: 2,
    points: 2,
},
{
    id: 4,
    section: "2. Application or Problem-Solving (Derivatives & Limits)",
    type: "mc",
    q: "A car's position is s(t) = t^3 - 6t^2 + 9t meters in t seconds. What is the instantaneous velocity at t = 4 seconds?",
    options: ["A. 9", "B. 12", "C. 3t^2 - 12t + 9", "D. 48"],
    correct: "A. 9",
    explanation:
    "v(t) = s'(t) = 3t^2 - 12t + 9. Evaluate at t = 4.",
    difficulty: 2,
    points: 2,
},
{
    id: 5,
    type: "mc",
    q: "Evaluate the limit lim(x→4) (x - 4)/(x^2 - 16).",
    options: ["A. 0", "B. 4", "C. 8", "D. DNE"],
    correct: "C. 8",
    explanation:
    "Factor and cancel (x−4). Limit becomes x+4.",
    difficulty: 2,
    points: 1,
},
{
    id: 6,
    type: "short",
    q: "Find the inverse function for f^{-1}(x), for the linear function f(x)=5x−2.",
    correct: "(x + 2) / 5",
    explanation:
    "Solve y = 5x − 2 for x.",
    difficulty: 1,
    points: 1,
},
{
    id: 7,
    type: "mc",
    q: "For a function f(x) to be continuous at x = a, which of the following conditions is NOT one of the three required conditions?",
    options: ["A. f(a) is defined", "B. limit exists", "C. limit = f(a)", "D. differentiability"],
    correct: "D. differentiability",
    explanation:
    "Continuity does not require differentiability.",
    difficulty: 1,
    points: 1,
},
{
    id: 8,
    section: "3. Transfer/Generalization",
    type: "mc-confidence",
    q: 
    "Two friends start running a 100-meter sprint at the same time and finish in a dead tie 10 seconds later. Assuming their position functions S₁(t) and S₂(t) are continuous and differentiable, does there exist a time, t, between 0 and 10 seconds where both runners must have had the exact same instantaneous velocity?",
    options: ["A. Yes", "B. No"],
    correct: "A. Yes",
    explanation:
    "By Rolle’s Theorem, h'(c)=0 → equal velocities.",
    difficulty: 3,
    points: 3,
},
{
    id: 9,
    type: "mc",
    q: "Evaluate the definite integral ∫(4x + x²)dx from 1 to 3.",
    options: ["A. 46/3", "B. 20", "C. 15", "D. 74/3"],
    correct: "D. 74/3",
    explanation:
    "Compute antiderivative and evaluate.",
    difficulty: 2,
    points: 1,
},
{
    id: 10,
    type: "short",
    q: "A radioactive substance decays exponentially. If its half-life is 12 hours, write the expression for the decay constant k when modeling the decay Q(t)=Q₀e^{-kt}.",
    correct: "ln(2)/12",
    explanation:
    "T₁/₂ = ln(2)/k → solve for k.",
    difficulty: 3,
    points: 2,
},
];

{/** Handle Submit */}
const handleSubmit = () => {
  let total = 0;

  questions.forEach((q) => {
    const userAnswer = (answers[q.id]?.answer ?? "").trim();
    const correct = (q.correct ?? "").trim();

    const normalize = (s: string) =>
      s.toLowerCase().replace(/\s+/g, "");

    let isCorrect = false;

    if (q.type === "short") {
      isCorrect = normalize(userAnswer) === normalize(correct);
    } else {
      isCorrect = userAnswer === correct;
    }

    if (isCorrect) total += q.points;
  });

  // Determine classification
  let classification = "Novice";
  if (total > 6 && total <= 12) classification = "Intermediate";
  else if (total > 12) classification = "Expert";

  // Store results in sessionStorage (safe for client routing)
  sessionStorage.setItem(
    "quizResults",
    JSON.stringify({ score: total, classification })
  );

  // Navigate to results page
  router.push("/results");
};

{/** Quiz UI */}
return (
  <div
    className="min-h-screen p-6 mx-auto max-w-3xl space-y-8 bg-white"
    style={{
      fontFamily:
        'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    }}
  >
    <h1 className="text-3xl text-blue-500 font-bold">Assessment Quiz</h1>

    {questions.map((q) => (
      <div
        key={q.id}
        className="p-4 border border-gray-200 text-black rounded-lg shadow-sm bg-white"
      >
        <p className="font-medium text-black mb-2">
          Q{q.id}. {q.q}
        </p>

        {/* Multiple Choice */}
        {q.type === "mc" && (
          <div className="space-y-2">
            {(q.options ?? []).map((opt) => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={opt}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [q.id]: { answer: e.target.value },
                    })
                  }
                />
                <span className="ml-2">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {/* Short Answer */}
        {q.type === "short" && (
          <input
            type="text"
            className="border border-gray-200 p-2 rounded w-full bg-white"
            placeholder="Enter your answer"
            onChange={(e) =>
              setAnswers({
                ...answers,
                [q.id]: { answer: e.target.value },
              })
            }
          />
        )}

        {/* Multiple Choice + Confidence */}
        {q.type === "mc-confidence" && (
          <div className="space-y-2">
            {(q.options ?? []).map((opt) => (
              <label key={opt} className="block">
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={opt}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [q.id]: {
                        ...(answers[q.id] || {}),
                        answer: e.target.value,
                      },
                    })
                  }
                />
                <span className="ml-2">{opt}</span>
              </label>
            ))}

            <p className="mt-2 font-medium">Confidence (1–5)</p>
            <input
              className="w-full"
              type="range"
              min={1}
              max={5}
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [q.id]: {
                    ...(answers[q.id] || {}),
                    confidence: Number(e.target.value),
                  },
                })
              }
            />
          </div>
        )}
      </div>
    ))}

    {/* Submit Button */}
    <div className="pt-4">
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md"
      >
        Submit Answers
      </button>
    </div>
  </div>
);
}

