"use client";

import { useMemo, useState } from "react";
import type { ObservationCard as ObservationType } from "@/lib/types";
import { topics } from "@/lib/data";
import { Input, Select } from "@/components/ui/input";
import { ObservationCard } from "./observation-card";

export function ObservationsCatalog({ observations }: { observations: ObservationType[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [age, setAge] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const normalizedAge = age.trim().toLowerCase();
    return observations.filter((observation) => {
      if (normalized && !`${observation.title} ${observation.context} ${observation.possibleExplanations.join(" ")}`.toLowerCase().includes(normalized)) return false;
      if (topic !== "all" && !observation.topicSlugs.includes(topic)) return false;
      if (normalizedAge && !observation.ageRange.toLowerCase().includes(normalizedAge)) return false;
      return true;
    });
  }, [age, observations, query, topic]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по признакам" />
        <Input value={age} onChange={(event) => setAge(event.target.value)} placeholder="Возраст, например 2 года" className="sm:w-48" />
        <Select value={topic} onChange={(event) => setTopic(event.target.value)} aria-label="Фильтр по теме">
          <option value="all">Все темы</option>
          {topics.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
        </Select>
      </div>
      <p className="text-xs text-muted-c" role="status">Найдено карточек: {filtered.length}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((observation) => <ObservationCard key={observation.slug} observation={observation} />)}
      </div>
      {!filtered.length && <p className="text-sm text-muted-c">По выбранным условиям ничего не найдено.</p>}
    </div>
  );
}
