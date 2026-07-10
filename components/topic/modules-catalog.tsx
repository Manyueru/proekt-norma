"use client";

import { useMemo, useState } from "react";
import type { Topic, TopicStatus, Track } from "@/lib/types";
import { TOPIC_STATUS_LABELS, TRACK_LABELS } from "@/lib/types";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Input, Select } from "@/components/ui/input";
import { TopicCard } from "./topic-card";

export function ModulesCatalog({ topics }: { topics: Topic[] }) {
  const { progress } = usePersonalData();
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<Track | "all">("all");
  const [status, setStatus] = useState<TopicStatus | "all">("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return topics.filter((topic) => {
      if (normalized && !`${topic.title} ${topic.summary} ${TRACK_LABELS[topic.track]}`.toLowerCase().includes(normalized)) return false;
      if (track !== "all" && topic.track !== track) return false;
      const topicStatus = progress[topic.slug]?.status ?? "not-started";
      if (status !== "all" && topicStatus !== status) return false;
      return true;
    });
  }, [progress, query, status, topics, track]);

  const grouped = Object.entries(TRACK_LABELS)
    .map(([trackId, label]) => ({
      track: trackId as Track,
      label,
      topics: filtered.filter((topic) => topic.track === trackId)
    }))
    .filter((group) => group.topics.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <Input placeholder="Поиск по темам" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Select value={track} onChange={(event) => setTrack(event.target.value as Track | "all")} aria-label="Фильтр по направлению">
          <option value="all">Все направления</option>
          {Object.entries(TRACK_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value as TopicStatus | "all")} aria-label="Фильтр по статусу">
          <option value="all">Все статусы</option>
          {Object.entries(TOPIC_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
      </div>
      <p className="text-xs text-muted-c" role="status">Найдено тем: {filtered.length}</p>
      {grouped.map((group) => (
        <section key={group.track}>
          <h2 className="mb-3 text-sm font-medium text-muted-c">{group.label}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.topics.map((topic) => <TopicCard key={topic.slug} topic={topic} />)}
          </div>
        </section>
      ))}
      {!grouped.length && <p className="text-sm text-muted-c">По выбранным фильтрам ничего не найдено.</p>}
    </div>
  );
}
