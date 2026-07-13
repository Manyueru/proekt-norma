"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Edit3, GraduationCap, Plus, Trash2, X } from "lucide-react";
import {
  EXAM_FORMAT_LABELS,
  type Exam,
  type ExamFormat
} from "@/lib/types";
import { daysUntil, formatDate, getExamProgress } from "@/lib/study-planner";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Button, buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { ProgressBar } from "@/components/shared/progress-bar";

function localDateInput(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function emptyExam(): Exam {
  const timestamp = new Date().toISOString();
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return {
    id: crypto.randomUUID(),
    title: "",
    discipline: "",
    teacher: "",
    date: localDateInput(date),
    format: "oral",
    questionsPerTicket: 2,
    notes: "",
    questions: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function toEditor(exam: Exam): Exam {
  return { ...exam, date: localDateInput(new Date(exam.date)) };
}

function normalizeForSave(exam: Exam): Exam {
  return {
    ...exam,
    title: exam.title.trim(),
    discipline: exam.discipline.trim(),
    teacher: exam.teacher.trim(),
    notes: exam.notes.trim(),
    date: new Date(`${exam.date}T12:00:00`).toISOString(),
    questionsPerTicket: Math.max(1, Number(exam.questionsPerTicket) || 1),
    updatedAt: new Date().toISOString()
  };
}

export function ExamsManager() {
  const { exams, studyTasks, saveExam, deleteExam } = usePersonalData();
  const [draft, setDraft] = useState<Exam | null>(null);
  const [showPast, setShowPast] = useState(false);

  const sorted = useMemo(
    () => [...exams]
      .filter((exam) => showPast || daysUntil(exam.date) >= 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [exams, showPast]
  );

  function patch(values: Partial<Exam>) {
    if (!draft) return;
    setDraft({ ...draft, ...values });
  }

  async function handleSave() {
    if (!draft?.title.trim() || !draft.date) return;
    await saveExam(normalizeForSave(draft));
    setDraft(null);
  }

  async function handleDelete(exam: Exam) {
    const linked = studyTasks.filter((task) => task.examId === exam.id).length;
    const message = linked
      ? `Удалить экзамен «${exam.title}»? У ${linked} связанных задач будет снята привязка к экзамену.`
      : `Удалить экзамен «${exam.title}»?`;
    if (!window.confirm(message)) return;
    await deleteExam(exam.id);
  }

  if (draft) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium">{exams.some((exam) => exam.id === draft.id) ? "Редактирование экзамена" : "Новый экзамен"}</h2>
            <p className="mt-1 text-sm text-muted-c">После сохранения можно будет добавить вопросы и сформировать пробный билет.</p>
          </div>
          <Button variant="ghost" onClick={() => setDraft(null)}><X size={16} />Закрыть</Button>
        </div>

        <Card className="flex flex-col gap-5">
          <FormField label="Название экзамена" hint="Например: «Экзамен по логопедии»." required>
            <Input value={draft.title} onChange={(event) => patch({ title: event.target.value })} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Дисциплина">
              <Input value={draft.discipline} onChange={(event) => patch({ discipline: event.target.value })} />
            </FormField>
            <FormField label="Преподаватель">
              <Input value={draft.teacher} onChange={(event) => patch({ teacher: event.target.value })} />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Дата экзамена" required>
              <Input type="date" value={draft.date} onChange={(event) => patch({ date: event.target.value })} />
            </FormField>
            <FormField label="Формат">
              <Select className="w-full" value={draft.format} onChange={(event) => patch({ format: event.target.value as ExamFormat })}>
                {Object.entries(EXAM_FORMAT_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </Select>
            </FormField>
            <FormField label="Вопросов в билете">
              <Input type="number" min={1} max={10} value={draft.questionsPerTicket} onChange={(event) => patch({ questionsPerTicket: Number(event.target.value) })} />
            </FormField>
          </div>

          <FormField label="Примечания" hint="Формат ответа, требования преподавателя или организационные детали.">
            <Textarea rows={4} value={draft.notes} onChange={(event) => patch({ notes: event.target.value })} />
          </FormField>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => void handleSave()} disabled={!draft.title.trim() || !draft.date}>Сохранить экзамен</Button>
            <Button variant="ghost" onClick={() => setDraft(null)}>Отмена</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4 border-accent-violet/20 bg-accent-violet/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <GraduationCap size={20} className="mt-0.5 shrink-0 text-accent-violet" />
          <div>
            <p className="text-sm font-medium">Подготовка к экзаменам</p>
            <p className="mt-1 text-sm leading-6 text-muted-c">Добавляйте вопросы, отмечайте уровень уверенности, тренируйтесь на случайном вопросе и пробном билете.</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setDraft(emptyExam())}><Plus size={16} />Добавить экзамен</Button>
      </Card>

      <p className="rounded-lg border border-c bg-surface px-4 py-3 text-xs leading-5 text-muted-c">Экзамены и вопросы пока сохраняются только в текущем браузере. Их можно сохранить вместе с резервной копией данных.</p>

      <label className="flex w-fit items-center gap-2 text-sm text-muted-c">
        <input type="checkbox" checked={showPast} onChange={(event) => setShowPast(event.target.checked)} />
        Показывать прошедшие экзамены
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        {sorted.map((exam) => {
          const progress = getExamProgress(exam);
          const days = daysUntil(exam.date);
          const linkedTasks = studyTasks.filter((task) => task.examId === exam.id && task.status !== "completed").length;
          return (
            <Card key={exam.id} className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-c">{EXAM_FORMAT_LABELS[exam.format]}</p>
                  <h2 className="mt-1 text-base font-medium">{exam.title}</h2>
                  <p className="mt-1 text-sm text-muted-c">{formatDate(exam.date)}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${days < 0 ? "bg-black/5 text-muted-c dark:bg-white/5" : days <= 7 ? "bg-orange-500/10 text-orange-700 dark:text-orange-300" : "bg-accent-violet/10 text-accent-violet"}`}>
                  {days < 0 ? "Экзамен прошёл" : days === 0 ? "Сегодня" : `Через ${days} дн.`}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 text-xs text-muted-c">
                  <span>Освоено вопросов</span>
                  <span>{progress.mastered} из {progress.total}</span>
                </div>
                <div className="mt-2"><ProgressBar value={progress.percent} /></div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-c">
                {exam.discipline && <span>{exam.discipline}</span>}
                {exam.teacher && <span>Преподаватель: {exam.teacher}</span>}
                {linkedTasks > 0 && <span>Активных задач: {linkedTasks}</span>}
              </div>

              <div className="mt-auto flex flex-wrap gap-2">
                <Link href={`/exams/${exam.id}`} className={buttonClassName({ variant: "primary" })}><CalendarDays size={15} />Открыть подготовку</Link>
                <Button onClick={() => setDraft(toEditor(exam))}><Edit3 size={15} />Изменить</Button>
                <Button variant="ghost" onClick={() => void handleDelete(exam)}><Trash2 size={15} />Удалить</Button>
              </div>
            </Card>
          );
        })}
      </div>

      {!sorted.length && (
        <Card className="text-center">
          <p className="text-sm font-medium">Экзамены пока не добавлены</p>
          <p className="mt-1 text-sm text-muted-c">Создайте первый экзамен и добавьте список вопросов.</p>
        </Card>
      )}
    </div>
  );
}
