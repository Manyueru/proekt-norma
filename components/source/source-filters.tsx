"use client";

import { useMemo, useState } from "react";
import { Source } from "@/lib/types";
import { Select, Input } from "@/components/ui/input";
import { SourceCard } from "./source-card";

const AGE_OPTIONS = [
  { value: "all", label: "Любой возраст" },
  { value: "0", label: "0 лет" },
  { value: "1", label: "1 год" },
  { value: "2", label: "2 года" },
  { value: "3", label: "3 года" },
  { value: "5", label: "5 лет" },
  { value: "7", label: "7 лет" }
];

export function SourceFilters({ sources }: { sources: Source[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [reliability, setReliability] = useState("all");
  const [language, setLanguage] = useState("all");
  const [age, setAge] = useState("all");

  const types = useMemo(() => Array.from(new Set(sources.map((s) => s.type))), [sources]);
  const languages = useMemo(() => Array.from(new Set(sources.map((s) => s.language))), [sources]);

  const filtered = sources.filter((s) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery && !`${s.title} ${s.author} ${s.summary}`.toLowerCase().includes(normalizedQuery)) return false;
    if (type !== "all" && s.type !== type) return false;
    if (reliability !== "all" && s.reliability !== reliability) return false;
    if (language !== "all" && s.language !== language) return false;
    if (age !== "all") {
      const selectedAge = Number(age);
      if (s.minAge !== undefined && selectedAge < s.minAge) return false;
      if (s.maxAge !== undefined && selectedAge > s.maxAge) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Input
          aria-label="Поиск по источникам"
          placeholder="Поиск по названию, автору или описанию"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select aria-label="Фильтр по типу" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">Все типы</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Select aria-label="Фильтр по надёжности" value={reliability} onChange={(e) => setReliability(e.target.value)}>
          <option value="all">Любая надёжность</option>
          <option value="A">Уровень A</option>
          <option value="B">Уровень B</option>
          <option value="C">Уровень C</option>
          <option value="D">Уровень D</option>
        </Select>
        <Select aria-label="Фильтр по языку" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="all">Любой язык</option>
          {languages.map((l) => <option key={l} value={l}>{l}</option>)}
        </Select>
        <Select aria-label="Фильтр по возрасту" value={age} onChange={(e) => setAge(e.target.value)}>
          {AGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </div>

      <p className="text-xs text-muted-c" role="status">Найдено источников: {filtered.length}</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((s) => <div key={s.id} id={s.id}><SourceCard source={s} /></div>)}
      </div>
      {filtered.length === 0 && <p className="text-sm text-muted-c">По выбранным фильтрам ничего не найдено.</p>}
    </div>
  );
}
