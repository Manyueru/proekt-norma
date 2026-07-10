"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, LogIn, PlayCircle, RotateCcw } from "lucide-react";
import { topics } from "@/lib/data";
import { TRACK_LABELS } from "@/lib/types";
import { getCurrentTopic, getOverallProgress, getRecommendedTopic } from "@/lib/progress";
import { useAuth } from "@/components/providers/auth-provider";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { StatusBadge } from "@/components/topic/status-badge";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function HomeDashboard() {
  const { user, profile } = useAuth();
  const { progress, notes, loading } = usePersonalData();
  const hasStarted = Object.values(progress).some((record) => record.status !== "not-started");
  const current = getCurrentTopic(topics, progress);
  const recommended = getRecommendedTopic(topics);
  const toReview = topics.filter((topic) => progress[topic.slug]?.status === "review");
  const mastered = topics.filter((topic) => progress[topic.slug]?.status === "mastered").length;
  const overall = getOverallProgress(topics, progress);
  const recentTopics = [...topics]
    .filter((topic) => progress[topic.slug]?.lastOpenedAt)
    .sort((a, b) =>
      (progress[b.slug]?.lastOpenedAt || "").localeCompare(progress[a.slug]?.lastOpenedAt || "")
    )
    .slice(0, 3);

  if (loading) return <p className="text-sm text-muted-c">Загружаем учебные данные…</p>;

  return (
    <div className="flex flex-col gap-8">
      <section className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-medium">
            {user ? `Добро пожаловать, ${profile?.displayName || "пользователь"}` : "Добро пожаловать в проект «Норма»"}
          </h1>
          <p className="text-sm text-muted-c mt-1 max-w-2xl leading-6">
            Системное изучение развития ребёнка, логопедии, нейропсихологии и клинической насмотренности.
          </p>
        </div>
        {!user && (
          <Link href="/auth/login">
            <Button>
              <LogIn size={16} />
              Войти для синхронизации
            </Button>
          </Link>
        )}
      </section>

      {!hasStarted ? (
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-muted-c">Рекомендуемый первый шаг</p>
            <h2 className="mt-1 text-base font-medium">{recommended?.title}</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-c">
              Начните с одного пробного модуля: прочитайте материал, сделайте конспект и проверьте себя.
            </p>
          </div>
          {recommended && (
            <Link href={`/modules/${recommended.slug}`}>
              <Button variant="primary" className="whitespace-nowrap">
                <PlayCircle size={16} />
                Начать обучение
              </Button>
            </Link>
          )}
        </Card>
      ) : current ? (
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-muted-c">Текущая тема</p>
            <p className="text-[15px] font-medium mt-0.5">{current.title}</p>
            <p className="text-xs text-muted-c mt-0.5">{TRACK_LABELS[current.track]}</p>
            <div className="mt-2"><StatusBadge status={progress[current.slug]?.status ?? "not-started"} /></div>
          </div>
          <Link href={`/modules/${current.slug}`}>
            <Button variant="primary">
              <PlayCircle size={16} />
              Продолжить обучение
            </Button>
          </Link>
        </Card>
      ) : (
        <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-medium">Все начатые темы завершены</h2>
            <p className="text-sm text-muted-c mt-1">Выберите следующий модуль или вернитесь к материалу для повторения.</p>
          </div>
          <Link href="/modules"><Button variant="primary">Выбрать следующую тему <ArrowRight size={16} /></Button></Link>
        </Card>
      )}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-c">Общий прогресс</p>
          <p className="text-2xl font-medium mt-1">{overall}%</p>
          <div className="mt-2"><ProgressBar value={overall} /></div>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-c">Тем освоено</p>
          <p className="text-2xl font-medium mt-1">{mastered} <span className="text-sm text-muted-c font-normal">из {topics.length}</span></p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-c">К повторению</p>
          <p className="text-2xl font-medium mt-1">{toReview.length}</p>
        </Card>
      </section>

      {toReview.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2"><RotateCcw size={16} className="text-accent-violet" /><h2 className="text-sm font-medium">Темы для повторения</h2></div>
          <div className="flex gap-2 flex-wrap">
            {toReview.map((topic) => (
              <Link key={topic.slug} href={`/modules/${topic.slug}`} className="text-xs rounded-lg border border-c px-3 py-2 text-muted-c hover:border-accent-blue/40">
                {topic.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium mb-3">Недавно открытые темы</h2>
          <div className="flex flex-col gap-2">
            {recentTopics.length ? recentTopics.map((topic) => (
              <Link key={topic.slug} href={`/modules/${topic.slug}`} className="flex items-center justify-between rounded-lg border border-c px-4 py-3 text-sm hover:border-accent-blue/40">
                <span>{topic.title}</span><StatusBadge status={progress[topic.slug]?.status ?? "not-started"} />
              </Link>
            )) : <p className="text-sm text-muted-c">Здесь появятся темы после первого открытия.</p>}
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium mb-3">Последние конспекты</h2>
          <div className="flex flex-col gap-2">
            {notes.slice(0, 3).map((note) => (
              <Link key={note.id} href={`/notes?note=${note.id}`} className="rounded-lg border border-c px-4 py-3 hover:border-accent-blue/40">
                <p className="text-sm font-medium">{note.title}</p>
                <p className="mt-1 text-xs text-muted-c">Обновлён {new Date(note.updatedAt).toLocaleDateString("ru-RU")}</p>
              </Link>
            ))}
            {!notes.length && <p className="text-sm text-muted-c">Конспектов пока нет.</p>}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium mb-3">Быстрые переходы</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ["/modules", "Модули"], ["/observations", "Насмотренность"], ["/cases", "Задачи"], ["/sources", "Источники"],
            ["/glossary", "Словарь"], ["/notes", "Конспекты"], ["/videos", "Видеотека"], ["/account", "Личный кабинет"]
          ].map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg border border-c px-3 py-3 text-sm text-center hover:border-accent-blue/40">
              {label}
            </Link>
          ))}
        </div>
      </section>

      {!user && (
        <Card className="flex items-start gap-3 border-accent-blue/20 bg-accent-blue/5">
          <BookOpen size={18} className="mt-0.5 shrink-0 text-accent-blue" />
          <p className="text-sm leading-6 text-muted-c">
            В гостевом режиме прогресс хранится только в этом браузере. После подключения аккаунта он будет доступен на разных устройствах.
          </p>
        </Card>
      )}
    </div>
  );
}
