"use client";

import { useState } from "react";

type Question = {
  id: string;
  prompt: string;
  choices: string[];
};

export function LessonQuiz({
  quizId,
  questions,
  lastScore,
}: {
  quizId: string;
  questions: Question[];
  lastScore: number | null;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{
    score: number;
    correct: Record<string, number>;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  async function handleSubmit() {
    setSubmitting(true);
    const res = await fetch(`/api/quiz/${quizId}/attempt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: questions.map((q) => answers[q.id]),
      }),
    });
    setSubmitting(false);
    if (res.ok) {
      const data = await res.json();
      setResult(data);
    }
  }

  return (
    <div className="mt-10 rounded-xl border border-black/10 p-5 dark:border-white/10">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Knowledge check</h2>
        {lastScore !== null && !result && (
          <span className="text-xs text-black/40 dark:text-white/40">
            Best score: {lastScore}%
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-6">
        {questions.map((q, qi) => {
          const correctIndex = result?.correct[q.id];
          return (
            <div key={q.id}>
              <p className="text-sm font-medium">
                {qi + 1}. {q.prompt}
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                {q.choices.map((choice, ci) => {
                  const selected = answers[q.id] === ci;
                  const isCorrect = result && ci === correctIndex;
                  const isWrongSelected = result && selected && !isCorrect;
                  return (
                    <button
                      key={ci}
                      type="button"
                      disabled={Boolean(result)}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: ci }))
                      }
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isCorrect
                          ? "border-green-600 bg-green-600/10"
                          : isWrongSelected
                            ? "border-red-600 bg-red-600/10"
                            : selected
                              ? "border-black bg-black/5 dark:border-white dark:bg-white/10"
                              : "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {result ? (
        <p className="mt-5 text-sm font-medium">
          You scored {result.score}%.{" "}
          {result.score === 100 ? "Nice work!" : "Review the highlighted answers above."}
        </p>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          className="mt-5 rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:opacity-85 disabled:opacity-40 dark:bg-white dark:text-black"
        >
          {submitting ? "Submitting..." : "Submit answers"}
        </button>
      )}
    </div>
  );
}
