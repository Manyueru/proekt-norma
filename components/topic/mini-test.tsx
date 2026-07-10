"use client";

import { useState } from "react";
import { MiniTestQuestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MiniTest({ questions }: { questions: MiniTestQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) return null;

  const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  return (
    <div className="flex flex-col gap-5">
      {questions.map((q, qi) => (
        <div key={q.id} className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            {qi + 1}. {q.question}
          </p>
          <div className="flex flex-col gap-1.5">
            {q.options.map((option, oi) => {
              const selected = answers[q.id] === oi;
              const isCorrect = submitted && oi === q.correctIndex;
              const isWrong = submitted && selected && oi !== q.correctIndex;
              return (
                <button
                  key={oi}
                  onClick={() => !submitted && setAnswers((a) => ({ ...a, [q.id]: oi }))}
                  className={cn(
                    "text-left text-sm rounded-lg border px-3 py-2 transition-colors",
                    selected ? "border-accent-blue" : "border-c",
                    isCorrect && "border-accent-sage bg-accent-sage/10",
                    isWrong && "border-red-400 bg-red-400/10"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <Button
          variant="primary"
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < questions.length}
          className="w-fit"
        >
          Проверить ответы
        </Button>
      ) : (
        <p className="text-sm text-muted-c">
          Правильных ответов: {correctCount} из {questions.length}
        </p>
      )}
    </div>
  );
}
