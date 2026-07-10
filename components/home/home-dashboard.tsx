"use client";

import Link from "next/link";
import { Topic, TOPIC_STATUS_LABELS, TRACK_LABELS } from "@/lib/types";
import { useAllProgress } from "@/lib/use-topic-status";
import { StatusBadge } from "@/components/topic/status-badge";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export function HomeDashboard({ topics }: { topics: Topic[] }) {
  const progress = useAllProgress();

  const sorted = [...topics].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const current =
    topics.find((t) => progress[t.slug] === "learning") ?? sorted[0];

  const recent = sorted.slice(0, 3);
  const toReview = topics.filter((t) => progress[t.slug] === "review");

  const mastered = topics.filter((t) => progress[t.slug] === "mastered").length;
  const overall = topics.length ? Math.round((mastered / topics.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-medium">Добро пожаловать</h1>
          <p className="text-sm text-muted-c mt-1">
            Системное изучение развития ребёнка, логопедии и нейропсихологии
          </p>
        </div>
        {current && (
          <Link href={`/modules/${current.slug}`}>
            <Button variant="primary">
              <PlayCircle size={16} />
              Продолжить обучение
            </Button>
          </Link>
        )}
      </div>

      {current && (
        <Card className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-muted-c">Сейчас изучаю</p>
            <p className="text-[15px] font-medium mt-0.5">{current.title}</p>
            <p className="text-xs text-muted-c mt-0.5">{TRACK_LABELS[current.track]}</p>
          </div>
          <StatusBadge status={progress[current.slug] ?? "not-started"} />
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-xs text-muted-c">Общий прогресс</p>
          <p className="text-2xl font-medium mt-1">{overall}%</p>
          <div className="mt-2">
            <ProgressBar value={overall} />
          </div>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-c">Тем освоено</p>
          <p className="text-2xl font-medium mt-1">
            {mastered} <span className="text-sm text-muted-c font-normal">из {topics.length}</span>
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-c">К повторению</p>
          <p className="text-2xl font-medium mt-1">{toReview.length}</p>
        </Card>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3">Недавно добавлено</h2>
        <div className="flex flex-col gap-2">
          {recent.map((t) => (
            <Link
              key={t.slug}
              href={`/modules/${t.slug}`}
              className="flex items-center justify-between rounded-lg border border-c px-4 py-3 text-sm hover:border-accent-blue/40"
            >
              <span>{t.title}</span>
              <span className="text-xs text-muted-c">{t.updatedAt}</span>
            </Link>
          ))}
        </div>
      </div>

      {toReview.length > 0 && (
        <div>
          <h2 className="text-sm font-medium mb-3">Темы для повторения</h2>
          <div className="flex gap-2 flex-wrap">
            {toReview.map((t) => (
              <Link
                key={t.slug}
                href={`/modules/${t.slug}`}
                className="text-xs rounded-lg border border-c px-3 py-2 text-muted-c hover:border-accent-blue/40"
              >
                {t.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium mb-3">Быстрые ссылки</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            ["/modules", "Модули"],
            ["/observations", "Насмотренность"],
            ["/cases", "Задачи"],
            ["/sources", "Источники"],
            ["/glossary", "Словарь"],
            ["/notes", "Конспекты"],
            ["/videos", "Видеотека"],
            ["/search", "Поиск"]
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-c px-3 py-2 text-sm text-center hover:border-accent-blue/40"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
