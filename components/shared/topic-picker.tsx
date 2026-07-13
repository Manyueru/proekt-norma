"use client";

import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { modules, topics } from "@/lib/data";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopicPickerProps {
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
  maxVisible?: number;
  emptyHint?: string;
}

export function TopicPicker({
  selectedSlugs,
  onChange,
  maxVisible = 24,
  emptyHint = "Выберите модуль или начните вводить название темы."
}: TopicPickerProps) {
  const [query, setQuery] = useState("");
  const [moduleId, setModuleId] = useState("all");

  const selectedTopics = useMemo(
    () => selectedSlugs.map((slug) => topics.find((topic) => topic.slug === slug)).filter(Boolean),
    [selectedSlugs]
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized && moduleId === "all") return [];

    return topics
      .filter((topic) => {
        if (moduleId !== "all" && topic.moduleId !== moduleId) return false;
        if (!normalized) return true;
        return `${topic.title} ${topic.moduleTitle} ${topic.summary}`.toLowerCase().includes(normalized);
      })
      .slice(0, maxVisible);
  }, [maxVisible, moduleId, query]);

  function toggle(slug: string) {
    onChange(
      selectedSlugs.includes(slug)
        ? selectedSlugs.filter((item) => item !== slug)
        : [...selectedSlugs, slug]
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {selectedTopics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTopics.map((topic) => topic && (
            <button
              key={topic.slug}
              type="button"
              onClick={() => toggle(topic.slug)}
              className="inline-flex items-center gap-1.5 rounded-full border border-c bg-surface-2 px-3 py-1.5 text-xs text-[rgb(var(--fg))] hover:border-accent-blue/45"
              aria-label={`Убрать тему «${topic.title}»`}
            >
              <span className="max-w-[240px] truncate">{topic.title}</span>
              <X size={13} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(220px,0.55fr)]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-c" size={16} />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по названию темы"
            className="pl-9"
          />
        </div>
        <Select value={moduleId} onChange={(event) => setModuleId(event.target.value)} aria-label="Выбор модуля">
          <option value="all">Все модули</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>{module.fullTitle}</option>
          ))}
        </Select>
      </div>

      {!query.trim() && moduleId === "all" && (
        <p className="rounded-xl border border-dashed border-c px-4 py-3 text-xs leading-5 text-muted-c">
          {emptyHint} Полный список из {topics.length} тем больше не выводится целиком.
        </p>
      )}

      {(query.trim() || moduleId !== "all") && (
        <div className="max-h-72 overflow-y-auto rounded-xl border border-c bg-surface">
          {filtered.length > 0 ? (
            <div className="divide-y divide-[rgb(var(--border-c))]">
              {filtered.map((topic) => {
                const checked = selectedSlugs.includes(topic.slug);
                return (
                  <button
                    type="button"
                    key={topic.slug}
                    onClick={() => toggle(topic.slug)}
                    aria-pressed={checked}
                    className={cn(
                      "flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.03]",
                      checked && "bg-[rgb(var(--accent)/0.07)]"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                        checked
                          ? "border-accent-blue bg-accent-blue text-white"
                          : "border-c text-transparent"
                      )}
                      aria-hidden="true"
                    >
                      <Check size={13} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{topic.title}</span>
                      <span className="mt-0.5 block text-xs text-muted-c">{topic.moduleTitle}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="px-4 py-5 text-sm text-muted-c">Подходящих тем не найдено.</p>
          )}
          {filtered.length === maxVisible && (
            <p className="border-t border-c px-4 py-2 text-xs text-muted-c">
              Показаны первые {maxVisible} результатов. Уточните запрос, чтобы сузить список.
            </p>
          )}
        </div>
      )}

      {selectedSlugs.length > 0 && (
        <div className="flex justify-end">
          <Button type="button" size="sm" variant="ghost" onClick={() => onChange([])}>
            Очистить выбор
          </Button>
        </div>
      )}
    </div>
  );
}
