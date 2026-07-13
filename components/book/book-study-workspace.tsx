"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, CheckCircle2, Save } from "lucide-react";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import type { BookProgress, StudyBook } from "@/lib/types";
import { cn } from "@/lib/utils";

function emptyProgress(bookId: string): BookProgress {
  return {
    bookId,
    completedChapterIds: [],
    chapterNotes: {},
    quizAnswers: {},
    status: "not-started",
    updatedAt: new Date().toISOString()
  };
}

export function BookStudyWorkspace({ book }: { book: StudyBook }) {
  const { bookProgress, saveBookProgress } = usePersonalData();
  const initial = bookProgress[book.id] ?? emptyProgress(book.id);
  const [draft, setDraft] = useState<BookProgress>(initial);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const saved = bookProgress[book.id];
    if (saved && !dirty) setDraft(saved);
  }, [book.id, bookProgress, dirty]);

  const routeIsComplete = book.contentStatus === "ready";
  const allChaptersDone = book.chapters.length > 0 && draft.completedChapterIds.length === book.chapters.length;
  const answeredAll = book.quiz.length > 0 && book.quiz.every((question) => draft.quizAnswers[question.id] !== undefined);
  const quizScore = useMemo(() => {
    if (!answeredAll) return undefined;
    return book.quiz.reduce((score, question) => score + (draft.quizAnswers[question.id] === question.correctIndex ? 1 : 0), 0);
  }, [answeredAll, book.quiz, draft.quizAnswers]);

  function patch(values: Partial<BookProgress>) {
    setDraft((current) => ({ ...current, ...values }));
    setDirty(true);
    setMessage("");
  }

  async function persist(values: Partial<BookProgress> = {}) {
    const next: BookProgress = {
      ...draft,
      ...values,
      updatedAt: new Date().toISOString()
    };
    setDraft(next);
    await saveBookProgress(next);
    setDirty(false);
    setMessage("Прогресс сохранён в этом браузере.");
  }

  async function toggleChapter(chapterId: string) {
    const completedChapterIds = draft.completedChapterIds.includes(chapterId)
      ? draft.completedChapterIds.filter((id) => id !== chapterId)
      : [...draft.completedChapterIds, chapterId];
    const status = completedChapterIds.length === 0 ? "not-started" : "reading";
    await persist({ completedChapterIds, status });
  }

  async function finishBook() {
    if (!routeIsComplete) return;
    await persist({
      status: "completed",
      quizScore,
      quizTotal: book.quiz.length
    });
    setMessage("Книга отмечена как изученная.");
  }

  return (
    <div className="flex flex-col gap-5">
      {book.chapters.length === 0 ? (
        <Card>
          <h2 className="text-base font-semibold">Маршрут чтения готовится</h2>
          <p className="mt-2 text-sm leading-6 text-muted-c">
            Книга уже включена в обязательную библиотеку, но главы, вопросы и проверочное задание ещё проходят сверку.
          </p>
        </Card>
      ) : (
        book.chapters.map((chapter, index) => {
          const completed = draft.completedChapterIds.includes(chapter.id);
          return (
            <Card key={chapter.id} className={cn(completed && "border-emerald-500/30")}> 
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-c">Блок {index + 1}</p>
                  <h2 className="mt-1 text-lg font-semibold">{chapter.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => void toggleChapter(chapter.id)}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                    completed ? "border-emerald-500 bg-emerald-600 text-white" : "border-c text-muted-c"
                  )}
                  aria-label={completed ? "Отметить блок непройденным" : "Отметить блок пройденным"}
                >
                  <Check size={17} />
                </button>
              </div>

              <p className="mt-3 text-sm leading-6">{chapter.goal}</p>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold">Во время чтения</h3>
                  <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-muted-c">
                    {chapter.readingGuide.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Вопросы после блока</h3>
                  <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-muted-c">
                    {chapter.reflectionQuestions.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium">Ваши заметки</p>
                <Textarea
                  className="mt-2"
                  rows={5}
                  value={draft.chapterNotes[chapter.id] ?? ""}
                  onChange={(event) => patch({
                    chapterNotes: { ...draft.chapterNotes, [chapter.id]: event.target.value },
                    status: "reading"
                  })}
                  placeholder="Главная мысль, непонятные места, связь с практикой…"
                />
              </div>
            </Card>
          );
        })
      )}

      {book.quiz.length > 0 && (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-c">Проверка понимания</p>
              <h2 className="mt-1 text-lg font-semibold">Мини-тест по маршруту</h2>
            </div>
            {quizScore !== undefined && <Badge tone="blue">{quizScore} из {book.quiz.length}</Badge>}
          </div>

          <div className="mt-5 flex flex-col gap-5">
            {book.quiz.map((question, questionIndex) => {
              const selected = draft.quizAnswers[question.id];
              return (
                <div key={question.id} className="border-t border-c pt-4 first:border-t-0 first:pt-0">
                  <p className="text-sm font-medium">{questionIndex + 1}. {question.question}</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={option} className="flex items-start gap-2 rounded-xl border border-c px-3 py-2.5 text-sm">
                        <input
                          type="radio"
                          name={`${book.id}-${question.id}`}
                          checked={selected === optionIndex}
                          onChange={() => patch({
                            quizAnswers: { ...draft.quizAnswers, [question.id]: optionIndex },
                            status: "reading"
                          })}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  {answeredAll && question.explanation && (
                    <p className={cn(
                      "mt-2 text-xs leading-5",
                      selected === question.correctIndex ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"
                    )}>
                      {selected === question.correctIndex ? "Верно. " : "Нужно повторить. "}{question.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {!routeIsComplete && book.chapters.length > 0 && (
        <p className="rounded-xl border border-amber-300/50 bg-amber-50/40 px-4 py-3 text-xs leading-5 text-amber-800 dark:bg-amber-950/10 dark:text-amber-200">
          Это предварительно размеченная часть маршрута. Её можно изучать и сохранять, но завершить всю книгу получится после полной проверки структуры.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => void persist({ status: draft.status === "not-started" ? "reading" : draft.status })}><Save size={16} />Сохранить</Button>
        <Button
          variant="primary"
          onClick={() => void finishBook()}
          disabled={!routeIsComplete || !allChaptersDone || (book.quiz.length > 0 && !answeredAll)}
        >
          <CheckCircle2 size={16} />Завершить книгу
        </Button>
      </div>
      {message && <p className="text-xs text-muted-c" role="status">{message}</p>}
    </div>
  );
}
