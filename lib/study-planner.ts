import type { Exam, ExamQuestion, StudyTask } from "./types";

export type DeadlineLevel = "completed" | "overdue" | "today" | "urgent" | "soon" | "normal";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysUntil(value: string, reference = new Date()) {
  const target = startOfDay(new Date(value));
  const current = startOfDay(reference);
  return Math.ceil((target.getTime() - current.getTime()) / DAY_MS);
}

export function getDeadlineInfo(task: StudyTask, reference = new Date()) {
  if (task.status === "completed") {
    return {
      level: "completed" as DeadlineLevel,
      label: "Выполнено",
      className: "border-emerald-500/30 bg-emerald-500/5",
      textClassName: "text-emerald-700 dark:text-emerald-300"
    };
  }

  const due = new Date(task.dueAt);
  const diffMs = due.getTime() - reference.getTime();
  const diffDays = daysUntil(task.dueAt, reference);

  if (diffMs < 0) {
    const overdueDays = Math.max(1, Math.ceil(Math.abs(diffMs) / DAY_MS));
    return {
      level: "overdue" as DeadlineLevel,
      label: overdueDays === 1 ? "Просрочено на 1 день" : `Просрочено на ${overdueDays} дн.`,
      className: "border-red-500/50 bg-red-500/10",
      textClassName: "text-red-700 dark:text-red-300"
    };
  }

  if (diffDays <= 0) {
    return {
      level: "today" as DeadlineLevel,
      label: "Срок сегодня",
      className: "border-red-500/50 bg-red-500/10",
      textClassName: "text-red-700 dark:text-red-300"
    };
  }

  if (diffDays <= 3) {
    return {
      level: "urgent" as DeadlineLevel,
      label: diffDays === 1 ? "Остался 1 день" : `Осталось ${diffDays} дня`,
      className: "border-orange-500/45 bg-orange-500/10",
      textClassName: "text-orange-700 dark:text-orange-300"
    };
  }

  if (diffDays <= 7) {
    return {
      level: "soon" as DeadlineLevel,
      label: `Осталось ${diffDays} дней`,
      className: "border-amber-500/40 bg-amber-500/10",
      textClassName: "text-amber-700 dark:text-amber-300"
    };
  }

  return {
    level: "normal" as DeadlineLevel,
    label: `Осталось ${diffDays} дней`,
    className: "border-c bg-surface",
    textClassName: "text-muted-c"
  };
}

export function sortStudyTasks(tasks: StudyTask[]) {
  const priorityWeight = { high: 0, normal: 1, low: 2 } as const;
  return [...tasks].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (b.status === "completed" && a.status !== "completed") return -1;
    const dueCompare = new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    if (dueCompare !== 0) return dueCompare;
    return priorityWeight[a.priority] - priorityWeight[b.priority];
  });
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

export function getExamProgress(exam: Exam) {
  const total = exam.questions.length;
  const mastered = exam.questions.filter((question) =>
    question.status === "mastered" || question.status === "independent"
  ).length;
  const review = exam.questions.filter((question) => question.status === "review").length;
  return {
    total,
    mastered,
    review,
    percent: total ? Math.round((mastered / total) * 100) : 0
  };
}

export function getExamPlan(exam: Exam, reference = new Date()) {
  const remainingDays = Math.max(1, daysUntil(exam.date, reference));
  const unmastered = exam.questions.filter(
    (question) => question.status !== "mastered" && question.status !== "independent"
  ).length;
  const review = exam.questions.filter((question) => question.status === "review").length;
  return {
    remainingDays,
    unmastered,
    newPerDay: unmastered ? Math.max(1, Math.ceil(unmastered / remainingDays)) : 0,
    reviewPerDay: review ? Math.max(1, Math.ceil(review / remainingDays)) : 0
  };
}

export function pickRandomQuestion(questions: ExamQuestion[]) {
  if (!questions.length) return null;
  const weaker = questions.filter(
    (question) => question.status !== "mastered" && question.status !== "independent"
  );
  const pool = weaker.length ? weaker : questions;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

export function createRandomTicket(questions: ExamQuestion[], count: number) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.max(1, Math.min(count, questions.length)));
}
