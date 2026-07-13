"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ObservationCard as ObservationType, ObservationCategory } from "@/lib/types";
import { OBSERVATION_CATEGORY_LABELS } from "@/lib/types";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Input, Select } from "@/components/ui/input";
import { ObservationCard } from "./observation-card";

export function ObservationsCatalog({ observations }: { observations: ObservationType[] }) {
  const { observationAttempts } = usePersonalData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ObservationCategory | "all">("all");
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState<"all" | "new" | "started" | "completed">("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return observations.filter((observation) => {
      const attempt = observationAttempts[observation.slug];
      if (
        normalized &&
        !`${observation.title} ${observation.ageRange} ${observation.context} ${observation.possibleExplanations.join(" ")} ${(observation.focusAreas ?? []).join(" ")}`
          .toLowerCase()
          .includes(normalized)
      ) return false;
      if (category !== "all" && observation.category !== category) return false;
      if (difficulty !== "all" && observation.difficulty !== difficulty) return false;
      if (status === "new" && attempt) return false;
      if (status === "started" && (!attempt || attempt.status === "completed")) return false;
      if (status === "completed" && attempt?.status !== "completed") return false;
      return true;
    });
  }, [category, difficulty, observationAttempts, observations, query, status]);

  const completedCount = observations.filter((observation) => observationAttempts[observation.slug]?.status === "completed").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_220px_180px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-c" size={16} />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по признакам, навыкам или возрасту"
            className="pl-9"
          />
        </div>
        <Select value={category} onChange={(event) => setCategory(event.target.value as ObservationCategory | "all")} aria-label="Фильтр по направлению">
          <option value="all">Все направления</option>
          {Object.entries(OBSERVATION_CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        <Select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} aria-label="Фильтр по сложности">
          <option value="all">Любая сложность</option>
          <option value="Базовый">Базовый</option>
          <option value="Средний">Средний</option>
          <option value="Продвинутый">Продвинутый</option>
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} aria-label="Фильтр по прогрессу">
          <option value="all">Любой прогресс</option>
          <option value="new">Не начато</option>
          <option value="started">В работе</option>
          <option value="completed">Пройдено</option>
        </Select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-c" role="status">
        <span>Найдено карточек: {filtered.length}</span>
        <span>Пройдено: {completedCount} из {observations.length}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((observation) => (
          <ObservationCard
            key={observation.slug}
            observation={observation}
            attempt={observationAttempts[observation.slug]}
          />
        ))}
      </div>
      {!filtered.length && <p className="text-sm text-muted-c">По выбранным условиям ничего не найдено.</p>}
    </div>
  );
}
