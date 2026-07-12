"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type {
  ContentStatus,
  LearningModule,
  Topic,
  TopicStatus,
  Track
} from "@/lib/types";
import {
  CONTENT_STATUS_LABELS,
  TOPIC_STATUS_LABELS,
  TRACK_LABELS
} from "@/lib/types";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { TopicCard } from "./topic-card";

export function ModulesCatalog({
  topics,
  modules
}: {
  topics: Topic[];
  modules: LearningModule[];
}) {
  const { progress } = usePersonalData();
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<Track | "all">("all");
  const [status, setStatus] = useState<TopicStatus | "all">("all");
  const [contentStatus, setContentStatus] = useState<ContentStatus | "all">("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return topics.filter((topic) => {
      const haystack = `${topic.title} ${topic.summary} ${topic.moduleTitle} ${TRACK_LABELS[topic.track]}`.toLowerCase();
      if (normalized && !haystack.includes(normalized)) return false;
      if (track !== "all" && topic.track !== track) return false;
      if (contentStatus !== "all" && topic.contentStatus !== contentStatus) return false;
      const topicStatus = progress[topic.slug]?.status ?? "not-started";
      if (status !== "all" && topicStatus !== status) return false;
      return true;
    });
  }, [contentStatus, progress, query, status, topics, track]);

  const grouped = modules
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((module) => {
      const allModuleTopics = topics.filter((topic) => topic.moduleId === module.id);
      const moduleTopics = filtered
        .filter((topic) => topic.moduleId === module.id)
        .sort((a, b) => a.topicOrder - b.topicOrder);
      const availableModuleTopics = allModuleTopics.filter(
        (topic) => topic.contentStatus !== "outline"
      );
      const mastered = availableModuleTopics.filter(
        (topic) => progress[topic.slug]?.status === "mastered"
      ).length;
      const verified = allModuleTopics.filter(
        (topic) => topic.contentStatus === "verified"
      ).length;
      return {
        module,
        allModuleTopics,
        availableModuleTopics,
        moduleTopics,
        mastered,
        verified,
        percent: availableModuleTopics.length
          ? Math.round((mastered / availableModuleTopics.length) * 100)
          : 0
      };
    })
    .filter((group) => group.moduleTopics.length > 0);

  const verifiedCount = topics.filter((topic) => topic.contentStatus === "verified").length;

  return (
    <div className="flex flex-col gap-7">
      <div className="grid gap-2 md:grid-cols-[minmax(220px,1fr)_auto_auto_auto]">
        <Input
          placeholder="Поиск по модулям и темам"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          value={track}
          onChange={(event) => setTrack(event.target.value as Track | "all")}
          aria-label="Фильтр по направлению"
        >
          <option value="all">Все направления</option>
          {Object.entries(TRACK_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        <Select
          value={contentStatus}
          onChange={(event) => setContentStatus(event.target.value as ContentStatus | "all")}
          aria-label="Фильтр по готовности содержания"
        >
          <option value="all">Любая готовность</option>
          {Object.entries(CONTENT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value as TopicStatus | "all")}
          aria-label="Фильтр по учебному статусу"
        >
          <option value="all">Все статусы обучения</option>
          {Object.entries(TOPIC_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="premium-panel p-4">
          <p className="text-xs text-muted-c">Модулей в программе</p>
          <p className="mt-1 text-2xl font-semibold">{modules.length}</p>
        </div>
        <div className="premium-panel p-4">
          <p className="text-xs text-muted-c">Тем в каркасе</p>
          <p className="mt-1 text-2xl font-semibold">{topics.length}</p>
        </div>
        <div className="premium-panel p-4">
          <p className="text-xs text-muted-c">Проверено для предпросмотра</p>
          <p className="mt-1 text-2xl font-semibold">{verifiedCount}</p>
        </div>
      </div>

      <p className="text-xs text-muted-c" role="status">
        По выбранным фильтрам найдено тем: {filtered.length}
      </p>

      <div className="flex flex-col gap-3">
        {grouped.map(({ module, allModuleTopics, availableModuleTopics, moduleTopics, mastered, verified, percent }) => (
          <details
            key={module.id}
            className="group overflow-hidden rounded-card border border-c bg-surface"
            open={query.trim() ? true : undefined}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 marker:content-none md:p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-c">
                    Модуль {module.id}
                  </span>
                  <Badge>{TRACK_LABELS[module.track]}</Badge>
                  {verified > 0 ? <Badge tone="sage">Проверено: {verified}</Badge> : null}
                </div>
                <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] md:text-xl">
                  {module.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-c">
                  {module.description}
                </p>
                <div className="mt-4 max-w-sm">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-muted-c">
                    <span>
                      {availableModuleTopics.length
                        ? `Освоено ${mastered} из ${availableModuleTopics.length} доступных`
                        : "Учебный текст готовится"}
                    </span>
                    <span>{availableModuleTopics.length ? `${percent}%` : "—"}</span>
                  </div>
                  <ProgressBar value={percent} />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs text-muted-c">
                <span>{moduleTopics.length} тем</span>
                <ChevronDown
                  size={18}
                  strokeWidth={1.7}
                  className="transition-transform group-open:rotate-180"
                />
              </div>
            </summary>

            <div className="border-t border-c bg-black/[0.012] p-4 dark:bg-white/[0.015] md:p-6">
              <div className="mb-4 flex flex-wrap gap-2 text-xs text-muted-c">
                <span>Траектория: {module.trajectory}</span>
                <span>·</span>
                <span>Глубина: {module.depth}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {moduleTopics.map((topic) => (
                  <TopicCard key={topic.slug} topic={topic} />
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>

      {!grouped.length ? (
        <p className="text-sm text-muted-c">По выбранным фильтрам ничего не найдено.</p>
      ) : null}
    </div>
  );
}
