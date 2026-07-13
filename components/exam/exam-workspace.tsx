"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpenCheck,
  Check,
  Edit3,
  Plus,
  RefreshCw,
  Shuffle,
  TicketCheck,
  Trash2,
  X
} from "lucide-react";
import {
  EXAM_FORMAT_LABELS,
  EXAM_QUESTION_STATUS_LABELS,
  type Exam,
  type ExamQuestion,
  type ExamQuestionStatus
} from "@/lib/types";
import {
  createRandomTicket,
  formatDate,
  getExamPlan,
  getExamProgress,
  pickRandomQuestion
} from "@/lib/study-planner";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Button, buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { ProgressBar } from "@/components/shared/progress-bar";
import { cn } from "@/lib/utils";

function emptyQuestion(): ExamQuestion {
  const timestamp = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: "",
    shortAnswer: "",
    fullAnswer: "",
    outline: "",
    keyTerms: "",
    commonMistakes: "",
    teacherQuestions: "",
    status: "not-started",
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function ExamWorkspace({ examId }: { examId: string }) {
  const { exams, saveExam } = usePersonalData();
  const exam = exams.find((item) => item.id === examId);
  const [draft, setDraft] = useState<ExamQuestion | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [mode, setMode] = useState<"questions" | "random" | "ticket">("questions");
  const [randomId, setRandomId] = useState<string | null>(null);
  const [ticketIds, setTicketIds] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filter, setFilter] = useState<ExamQuestionStatus | "all" | "weak">("all");

  const filteredQuestions = useMemo(() => {
    if (!exam) return [];
    if (filter === "all") return currentExam.questions;
    if (filter === "weak") {
      return currentExam.questions.filter((question) =>
        question.status === "not-started" || question.status === "read" || question.status === "review"
      );
    }
    return currentExam.questions.filter((question) => question.status === filter);
  }, [exam, filter]);

  if (!exam) {
    return (
      <div className="flex flex-col gap-4">
        <Link href="/exams" className="w-fit text-sm text-accent-blue hover:underline">← К экзаменам</Link>
        <Card>
          <h1 className="text-lg font-medium">Экзамен не найден</h1>
          <p className="mt-1 text-sm text-muted-c">Возможно, он был удалён или данные хранятся в другом браузере.</p>
        </Card>
      </div>
    );
  }

  const currentExam = exam;
  const progress = getExamProgress(currentExam);
  const plan = getExamPlan(currentExam);
  const activeQuestion = currentExam.questions.find((question) => question.id === activeQuestionId);
  const randomQuestion = currentExam.questions.find((question) => question.id === randomId);
  const ticket = ticketIds.map((id) => currentExam.questions.find((question) => question.id === id)).filter(Boolean) as ExamQuestion[];

  function patch(values: Partial<ExamQuestion>) {
    if (!draft) return;
    setDraft({ ...draft, ...values });
  }

  async function saveQuestion() {
    if (!draft?.title.trim()) return;
    const timestamp = new Date().toISOString();
    const saved: ExamQuestion = {
      ...draft,
      title: draft.title.trim(),
      updatedAt: timestamp
    };
    await saveExam({
      ...currentExam,
      questions: [saved, ...currentExam.questions.filter((question) => question.id !== saved.id)],
      updatedAt: timestamp
    });
    setDraft(null);
    setActiveQuestionId(saved.id);
  }

  async function deleteQuestion(question: ExamQuestion) {
    if (!window.confirm(`Удалить вопрос «${question.title}»?`)) return;
    await saveExam({
      ...currentExam,
      questions: currentExam.questions.filter((item) => item.id !== question.id),
      updatedAt: new Date().toISOString()
    });
    if (activeQuestionId === question.id) setActiveQuestionId(null);
  }

  async function updateQuestionStatus(question: ExamQuestion, status: ExamQuestionStatus) {
    const timestamp = new Date().toISOString();
    await saveExam({
      ...currentExam,
      questions: currentExam.questions.map((item) =>
        item.id === question.id
          ? { ...item, status, lastReviewedAt: timestamp, updatedAt: timestamp }
          : item
      ),
      updatedAt: timestamp
    });
  }

  function chooseRandom() {
    const question = pickRandomQuestion(currentExam.questions);
    setRandomId(question?.id ?? null);
    setShowAnswer(false);
  }

  function createTicket() {
    setTicketIds(createRandomTicket(currentExam.questions, currentExam.questionsPerTicket).map((question) => question.id));
    setShowAnswer(false);
  }

  if (draft) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-medium">{currentExam.questions.some((question) => question.id === draft.id) ? "Редактирование вопроса" : "Новый экзаменационный вопрос"}</h1>
            <p className="mt-1 text-sm text-muted-c">Можно сначала добавить только формулировку и постепенно заполнить ответ.</p>
          </div>
          <Button variant="ghost" onClick={() => setDraft(null)}><X size={16} />Закрыть</Button>
        </div>
        <Card className="flex flex-col gap-5">
          <FormField label="Формулировка вопроса" required>
            <Textarea rows={3} value={draft.title} onChange={(event) => patch({ title: event.target.value })} placeholder="Моторная алалия: определение, причины, симптоматика…" />
          </FormField>
          <FormField label="Краткий ответ" hint="Версия для быстрого повторения перед экзаменом.">
            <Textarea rows={4} value={draft.shortAnswer} onChange={(event) => patch({ shortAnswer: event.target.value })} />
          </FormField>
          <FormField label="План ответа" hint="Основные пункты в правильной последовательности.">
            <Textarea rows={5} value={draft.outline} onChange={(event) => patch({ outline: event.target.value })} placeholder={"1. Определение\n2. Причины\n3. Симптоматика"} />
          </FormField>
          <FormField label="Полный ответ" hint="Развёрнутый ответ, которым можно сверяться после тренировки.">
            <Textarea rows={10} value={draft.fullAnswer} onChange={(event) => patch({ fullAnswer: event.target.value })} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Ключевые термины">
              <Textarea rows={4} value={draft.keyTerms} onChange={(event) => patch({ keyTerms: event.target.value })} />
            </FormField>
            <FormField label="Частые ошибки">
              <Textarea rows={4} value={draft.commonMistakes} onChange={(event) => patch({ commonMistakes: event.target.value })} />
            </FormField>
          </div>
          <FormField label="Дополнительные вопросы преподавателя">
            <Textarea rows={4} value={draft.teacherQuestions} onChange={(event) => patch({ teacherQuestions: event.target.value })} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Уровень подготовки">
              <Select className="w-full" value={draft.status} onChange={(event) => patch({ status: event.target.value as ExamQuestionStatus })}>
                {Object.entries(EXAM_QUESTION_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </Select>
            </FormField>
            <FormField label="Дата повторения" hint="Необязательно.">
              <Input type="date" value={draft.reviewDate ?? ""} onChange={(event) => patch({ reviewDate: event.target.value || undefined })} />
            </FormField>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => void saveQuestion()} disabled={!draft.title.trim()}><Check size={16} />Сохранить вопрос</Button>
            <Button variant="ghost" onClick={() => setDraft(null)}>Отмена</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/exams" className="flex w-fit items-center gap-1 text-sm text-accent-blue hover:underline"><ArrowLeft size={15} />К экзаменам</Link>

      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-c">{EXAM_FORMAT_LABELS[currentExam.format]} экзамен · {formatDate(currentExam.date)}</p>
          <h1 className="mt-1 text-xl font-medium">{currentExam.title}</h1>
          <p className="mt-1 text-sm text-muted-c">{currentExam.discipline}{currentExam.teacher ? ` · ${currentExam.teacher}` : ""}</p>
        </div>
        <Link href="/study-tasks" className={buttonClassName()}><Plus size={16} />Добавить учебную задачу</Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4"><p className="text-xs text-muted-c">Освоено</p><p className="mt-1 text-2xl font-medium">{progress.mastered} <span className="text-sm font-normal text-muted-c">из {progress.total}</span></p><div className="mt-2"><ProgressBar value={progress.percent} /></div></Card>
        <Card className="p-4"><p className="text-xs text-muted-c">До экзамена</p><p className="mt-1 text-2xl font-medium">{plan.remainingDays}</p><p className="mt-1 text-xs text-muted-c">дней, считая сегодняшний</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-c">Новых в день</p><p className="mt-1 text-2xl font-medium">{plan.newPerDay}</p><p className="mt-1 text-xs text-muted-c">рекомендуемый темп</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-c">На повторение</p><p className="mt-1 text-2xl font-medium">{progress.review}</p><p className="mt-1 text-xs text-muted-c">вопросов</p></Card>
      </section>

      {currentExam.notes && <Card><p className="text-xs text-muted-c">Примечания</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{currentExam.notes}</p></Card>}

      <div className="flex flex-wrap gap-2 border-b border-c pb-3">
        <Button size="sm" variant={mode === "questions" ? "primary" : "secondary"} onClick={() => setMode("questions")}><BookOpenCheck size={15} />Все вопросы</Button>
        <Button size="sm" variant={mode === "random" ? "primary" : "secondary"} onClick={() => { setMode("random"); if (!randomId) chooseRandom(); }}><Shuffle size={15} />Случайный вопрос</Button>
        <Button size="sm" variant={mode === "ticket" ? "primary" : "secondary"} onClick={() => { setMode("ticket"); if (!ticketIds.length) createTicket(); }}><TicketCheck size={15} />Пробный билет</Button>
      </div>

      {mode === "questions" && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Select value={filter} onChange={(event) => setFilter(event.target.value as ExamQuestionStatus | "all" | "weak")}>
              <option value="all">Все вопросы</option>
              <option value="weak">Только слабые</option>
              {Object.entries(EXAM_QUESTION_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </Select>
            <Button variant="primary" onClick={() => setDraft(emptyQuestion())}><Plus size={16} />Добавить вопрос</Button>
          </div>

          <div className="grid gap-3">
            {filteredQuestions.map((question, index) => (
              <Card key={question.id} className="flex flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button type="button" className="flex-1 text-left" onClick={() => setActiveQuestionId(activeQuestionId === question.id ? null : question.id)}>
                    <p className="text-xs text-muted-c">Вопрос {index + 1}</p>
                    <h2 className="mt-1 text-sm font-medium leading-6">{question.title}</h2>
                  </button>
                  <div className="flex flex-wrap gap-2">
                    <Select value={question.status} onChange={(event) => void updateQuestionStatus(question, event.target.value as ExamQuestionStatus)}>
                      {Object.entries(EXAM_QUESTION_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </Select>
                    <Button size="sm" onClick={() => setDraft({ ...question })}><Edit3 size={15} />Изменить</Button>
                    <Button size="sm" variant="ghost" onClick={() => void deleteQuestion(question)}><Trash2 size={15} /></Button>
                  </div>
                </div>
                {activeQuestion?.id === question.id && (
                  <div className="grid gap-4 border-t border-c pt-4">
                    {question.shortAnswer && <section><p className="text-xs font-medium text-muted-c">Краткий ответ</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{question.shortAnswer}</p></section>}
                    {question.outline && <section><p className="text-xs font-medium text-muted-c">План ответа</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{question.outline}</p></section>}
                    {question.fullAnswer && <section><p className="text-xs font-medium text-muted-c">Полный ответ</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{question.fullAnswer}</p></section>}
                  </div>
                )}
              </Card>
            ))}
          </div>
          {!filteredQuestions.length && <Card className="text-center"><p className="text-sm text-muted-c">Вопросов по выбранному фильтру нет.</p></Card>}
        </div>
      )}

      {mode === "random" && (
        <Card className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-xs text-muted-c">Случайный вопрос без подсказки</p><h2 className="mt-1 text-base font-medium">{randomQuestion?.title || "Сначала добавьте вопросы"}</h2></div>
            <Button onClick={chooseRandom} disabled={!currentExam.questions.length}><RefreshCw size={15} />Другой вопрос</Button>
          </div>
          {randomQuestion && (
            <>
              <p className="text-sm leading-6 text-muted-c">Попробуйте ответить вслух или письменно, затем откройте план и сравните.</p>
              <Button className="w-fit" variant="primary" onClick={() => setShowAnswer((value) => !value)}>{showAnswer ? "Скрыть подсказку" : "Показать план и ответ"}</Button>
              {showAnswer && <div className="grid gap-4 border-t border-c pt-4">{randomQuestion.outline&&<section><p className="text-xs font-medium text-muted-c">План</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{randomQuestion.outline}</p></section>}{randomQuestion.shortAnswer&&<section><p className="text-xs font-medium text-muted-c">Краткий ответ</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{randomQuestion.shortAnswer}</p></section>}</div>}
            </>
          )}
        </Card>
      )}

      {mode === "ticket" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-c">В билете: {currentExam.questionsPerTicket} вопроса. Отвечайте без подсказки, затем откройте планы.</p>
            <Button onClick={createTicket} disabled={!currentExam.questions.length}><RefreshCw size={15} />Новый билет</Button>
          </div>
          {ticket.map((question, index) => (
            <Card key={question.id}>
              <p className="text-xs text-muted-c">Вопрос {index + 1}</p>
              <h2 className="mt-1 text-base font-medium leading-7">{question.title}</h2>
              {showAnswer && question.outline && <p className="mt-4 whitespace-pre-wrap border-t border-c pt-4 text-sm leading-6">{question.outline}</p>}
            </Card>
          ))}
          {ticket.length > 0 && <Button className="w-fit" variant="primary" onClick={() => setShowAnswer((value) => !value)}>{showAnswer ? "Скрыть планы" : "Показать планы ответов"}</Button>}
          {!ticket.length && <Card className="text-center"><p className="text-sm text-muted-c">Добавьте вопросы, чтобы сформировать билет.</p></Card>}
        </div>
      )}
    </div>
  );
}
