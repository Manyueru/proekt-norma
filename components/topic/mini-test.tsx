"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import type { MiniTestQuestion, TestAttempt } from "@/lib/types";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MiniTest({ topicSlug, questions }: { topicSlug: string; questions: MiniTestQuestion[] }) {
  const { testAttempts, saveTestAttempt } = usePersonalData();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const attempts = useMemo(
    () => testAttempts.filter((attempt) => attempt.quizId === topicSlug),
    [testAttempts, topicSlug]
  );
  const best = attempts.reduce((max, attempt) => Math.max(max, attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0), 0);

  if (questions.length === 0) return null;
  const correctCount = questions.filter((question) => answers[question.id] === question.correctIndex).length;

  async function submit() {
    setSubmitted(true);
    setSaved(false);
    const attempt: TestAttempt = {
      id: crypto.randomUUID(),
      quizId: topicSlug,
      topicSlug,
      answers,
      score: correctCount,
      total: questions.length,
      completedAt: new Date().toISOString()
    };
    await saveTestAttempt(attempt);
    setSaved(true);
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
    setSaved(false);
  }

  return (
    <div className="flex flex-col gap-5">
      {attempts.length > 0 && (
        <p className="text-xs text-muted-c">Попыток: {attempts.length}. Лучший результат: {best}%.</p>
      )}
      {questions.map((question, index) => (
        <div key={question.id} className="flex flex-col gap-2">
          <p className="text-sm font-medium">{index + 1}. {question.question}</p>
          <div className="flex flex-col gap-1.5">
            {question.options.map((option, optionIndex) => {
              const selected = answers[question.id] === optionIndex;
              const isCorrect = submitted && optionIndex === question.correctIndex;
              const isWrong = submitted && selected && optionIndex !== question.correctIndex;
              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => !submitted && setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
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
          {submitted && (
            <p className="text-xs leading-5 text-muted-c">
              {question.explanation || `Правильный ответ: ${question.options[question.correctIndex]}.`}
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <Button
          variant="primary"
          onClick={() => void submit()}
          disabled={Object.keys(answers).length < questions.length}
          className="w-fit"
        >
          <Save size={16} />Проверить и сохранить
        </Button>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-lg bg-black/[0.03] p-4 dark:bg-white/[0.04]">
          <p className="text-sm">Правильных ответов: <b>{correctCount} из {questions.length}</b> ({Math.round((correctCount / questions.length) * 100)}%).</p>
          {correctCount < questions.length && <p className="text-xs text-muted-c">Вернитесь к ошибочным вопросам и перечитайте соответствующие разделы темы.</p>}
          {saved && <p className="text-xs text-accent-sage" role="status">Результат сохранён.</p>}
          <Button size="sm" onClick={reset}><RotateCcw size={15} />Пройти ещё раз</Button>
        </div>
      )}
    </div>
  );
}
