"use client";

import Link from "next/link";
import { ArrowRight, Check, Search } from "lucide-react";
import { topics } from "@/lib/data";
import { TRACK_LABELS, type Track } from "@/lib/types";
import { getCurrentTopic, getOverallProgress, getTrackProgress } from "@/lib/progress";
import { daysUntil, formatDate, formatDateTime, getDeadlineInfo, getExamProgress, sortStudyTasks } from "@/lib/study-planner";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { StatusBadge } from "@/components/topic/status-badge";
import { ProgressBar } from "@/components/shared/progress-bar";
import { buttonClassName } from "@/components/ui/button";

const FEATURED_TRACKS: Track[] = ["speech-therapy", "neuropsychology", "child-development"];

const QUICK_LINKS = [
  ["/competencies", "Карта знаний"],
  ["/observations", "Тренажёр насмотренности"],
  ["/books", "Изучение книг"],
  ["/methods", "Атлас методик"],
  ["/research", "Новые исследования"],
  ["/study-tasks", "Учебные задачи"]
] as const;

export function HomeDashboard() {
  const {
    progress,
    notes,
    studyTasks,
    exams,
    saveStudyTask,
    loading
  } = usePersonalData();

  const hasStarted = Object.values(progress).some((record) => record.status !== "not-started");
  const current = getCurrentTopic(topics, progress);
  const toReview = topics.filter((topic) => progress[topic.slug]?.status === "review");
  const availableTopics = topics.filter((topic) => topic.contentStatus !== "outline");
  const mastered = availableTopics.filter((topic) => progress[topic.slug]?.status === "mastered").length;
  const overall = getOverallProgress(topics, progress);
  const recentTopics = [...topics]
    .filter((topic) => progress[topic.slug]?.lastOpenedAt)
    .sort((a, b) =>
      (progress[b.slug]?.lastOpenedAt || "").localeCompare(progress[a.slug]?.lastOpenedAt || "")
    )
    .slice(0, 3);
  const upcomingTasks = sortStudyTasks(studyTasks.filter((task) => task.status !== "completed"));
  const nearestTask = upcomingTasks[0];
  const nearestExam = [...exams]
    .filter((exam) => daysUntil(exam.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  const trackProgress = FEATURED_TRACKS.map((track) => ({
    track,
    ...getTrackProgress(topics, progress, track)
  }));

  if (loading) return <p className="text-sm text-muted-c">Загружаем учебные данные…</p>;

  return (
    <div className="flex flex-col gap-11 md:gap-14">
      <section className="min-h-[230px] border-b border-c pb-8 md:min-h-[300px] md:pb-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-xl text-[15px] leading-7 text-muted-c md:text-base">
            Учебная платформа по логопедии, нейропсихологии, клинической насмотренности и развитию ребёнка.
          </p>
          <Link
            href="/search"
            className="flex w-full max-w-xs items-center justify-between rounded-xl border border-c bg-surface px-4 py-3 text-sm text-muted-c hover:border-accent-blue/45"
          >
            <span>Поиск по материалам</span>
            <Search size={16} strokeWidth={1.7} />
          </Link>
        </div>
      </section>

      {current ? (
        <section className="premium-panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-c">Продолжить обучение</p>
            <h1 className="mt-2 text-xl font-semibold tracking-[-0.03em] md:text-2xl">{current.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-c">{TRACK_LABELS[current.track]}</p>
              <StatusBadge status={progress[current.slug]?.status ?? "not-started"} />
            </div>
          </div>
          <Link href={`/modules/${current.slug}`} className={buttonClassName({ variant: "primary", className: "w-full sm:w-auto" })}>
            Открыть тему
            <ArrowRight size={15} strokeWidth={1.8} />
          </Link>
        </section>
      ) : hasStarted ? (
        <section className="premium-panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-c">Обучение</p>
            <h2 className="mt-2 text-lg font-semibold">Все начатые темы завершены</h2>
            <p className="mt-2 text-sm leading-6 text-muted-c">Можно выбрать следующую тему или вернуться к материалам для повторения.</p>
          </div>
          <Link href="/modules" className={buttonClassName({ variant: "primary" })}>Открыть модули <ArrowRight size={15} /></Link>
        </section>
      ) : null}

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-c">На сегодня</p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Актуальное</h2>
          </div>
        </div>

        <div className="grid border-y border-c md:grid-cols-3">
          <div className="py-6 md:pr-7">
            <p className="text-xs text-muted-c">Ближайший дедлайн</p>
            {nearestTask ? (() => {
              const deadline = getDeadlineInfo(nearestTask);
              return (
                <div className="mt-3">
                  <Link href="/study-tasks" className="text-[15px] font-semibold hover:text-accent-blue">{nearestTask.title}</Link>
                  <p className="mt-1 text-xs text-muted-c">{formatDateTime(nearestTask.dueAt)}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className={`text-xs font-medium ${deadline.textClassName}`}>{deadline.label}</span>
                    <button
                      type="button"
                      onClick={() => void saveStudyTask({ ...nearestTask, status: "completed", completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })}
                      className="inline-flex items-center gap-1 text-xs text-muted-c hover:text-accent-blue"
                    >
                      <Check size={13} /> Готово
                    </button>
                  </div>
                </div>
              );
            })() : (
              <div className="mt-3">
                <p className="text-sm text-muted-c">Ближайших задач нет.</p>
                <Link href="/study-tasks" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-blue">Добавить задачу <ArrowRight size={13} /></Link>
              </div>
            )}
          </div>

          <div className="border-t border-c py-6 md:border-l md:border-t-0 md:px-7">
            <p className="text-xs text-muted-c">Ближайший экзамен</p>
            {nearestExam ? (() => {
              const examProgress = getExamProgress(nearestExam);
              const days = daysUntil(nearestExam.date);
              return (
                <div className="mt-3">
                  <Link href={`/exams/${nearestExam.id}`} className="text-[15px] font-semibold hover:text-accent-blue">{nearestExam.title}</Link>
                  <p className="mt-1 text-xs text-muted-c">{formatDate(nearestExam.date)} · {days === 0 ? "сегодня" : `через ${days} дн.`}</p>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-[11px] text-muted-c">
                      <span>Освоено</span><span>{examProgress.mastered} из {examProgress.total}</span>
                    </div>
                    <ProgressBar value={examProgress.percent} />
                  </div>
                </div>
              );
            })() : (
              <div className="mt-3">
                <p className="text-sm text-muted-c">Экзамены пока не добавлены.</p>
                <Link href="/exams" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-blue">Добавить экзамен <ArrowRight size={13} /></Link>
              </div>
            )}
          </div>

          <div className="border-t border-c py-6 md:border-l md:border-t-0 md:pl-7">
            <p className="text-xs text-muted-c">Общий прогресс</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{overall}%</p>
            <div className="mt-4"><ProgressBar value={overall} /></div>
            <p className="mt-3 text-xs text-muted-c">Освоено {mastered} из {availableTopics.length} доступных тем</p>
          </div>
        </div>
      </section>

      <section className="grid gap-9 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <div>
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-c">Динамика</p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Моё обучение</h2>
          </div>

          <div className="space-y-5 border-y border-c py-6">
            {trackProgress.map((item) => (
              <div key={item.track}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span>{TRACK_LABELS[item.track]}</span>
                  <span className="text-xs text-muted-c">{item.percent}%</span>
                </div>
                <ProgressBar value={item.percent} />
              </div>
            ))}
          </div>

          {!hasStarted && (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-c">Вы пока не начали обучение.</p>
              <Link href="/modules" className="inline-flex items-center gap-1 text-sm font-medium text-accent-blue">Открыть модули <ArrowRight size={14} /></Link>
            </div>
          )}
        </div>

        <div>
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-c">Вернуться</p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Повторение</h2>
          </div>

          <div className="divide-y divide-[rgb(var(--border-c))] border-y border-c">
            {toReview.slice(0, 4).map((topic) => (
              <Link key={topic.slug} href={`/modules/${topic.slug}`} className="flex items-center justify-between gap-4 py-4 text-sm hover:text-accent-blue">
                <span>{topic.title}</span><ArrowRight size={14} className="shrink-0 text-muted-c" />
              </Link>
            ))}
            {!toReview.length && <p className="py-5 text-sm text-muted-c">Материалов для повторения пока нет.</p>}
          </div>
        </div>
      </section>

      <section className="grid gap-9 lg:grid-cols-2 lg:gap-12">
        <div>
          <h2 className="mb-4 text-base font-semibold">Недавно открытые темы</h2>
          <div className="divide-y divide-[rgb(var(--border-c))] border-y border-c">
            {recentTopics.length ? recentTopics.map((topic) => (
              <Link key={topic.slug} href={`/modules/${topic.slug}`} className="flex items-center justify-between gap-4 py-4 text-sm hover:text-accent-blue">
                <span>{topic.title}</span>
                <StatusBadge status={progress[topic.slug]?.status ?? "not-started"} />
              </Link>
            )) : <p className="py-5 text-sm text-muted-c">Здесь появятся темы после первого открытия.</p>}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-base font-semibold">Последние конспекты</h2>
          <div className="divide-y divide-[rgb(var(--border-c))] border-y border-c">
            {notes.slice(0, 3).map((note) => (
              <Link key={note.id} href={`/notes?note=${note.id}`} className="block py-4 hover:text-accent-blue">
                <p className="text-sm font-medium">{note.title}</p>
                <p className="mt-1 text-xs text-muted-c">Обновлён {new Date(note.updatedAt).toLocaleDateString("ru-RU")}</p>
              </Link>
            ))}
            {!notes.length && <p className="py-5 text-sm text-muted-c">Конспектов пока нет.</p>}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-c">Навигация</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Быстрый доступ</h2>
        </div>
        <div className="grid border-y border-c sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map(([href, label], index) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between gap-4 border-b border-c py-5 text-sm font-medium hover:text-accent-blue sm:px-5 ${index % 2 === 1 ? "sm:border-l" : ""}`}
            >
              <span>{label}</span>
              <ArrowRight size={15} className="shrink-0 text-muted-c" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
