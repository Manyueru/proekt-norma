import Fuse from "fuse.js";
import { topics, sources, observations, cases, glossary, videos } from "./data";

export type SearchResultType =
  | "topic"
  | "source"
  | "observation"
  | "case"
  | "term"
  | "video"
  | "note"
  | "study-task"
  | "exam";

export interface SearchResult {
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
}

const typeLabels: Record<SearchResultType, string> = {
  topic: "Тема",
  source: "Источник",
  observation: "Признак",
  case: "Задача",
  term: "Термин",
  video: "Видео",
  note: "Конспект",
  "study-task": "Дедлайн",
  exam: "Экзамен"
};

export { typeLabels };

function buildIndex(): SearchResult[] {
  return [
    ...topics.map((t) => ({
      type: "topic" as const,
      title: t.title,
      subtitle: t.summary,
      href: `/modules/${t.slug}`
    })),
    ...sources.map((s) => ({
      type: "source" as const,
      title: s.title,
      subtitle: s.summary,
      href: `/sources#${s.id}`
    })),
    ...observations.map((o) => ({
      type: "observation" as const,
      title: o.title,
      subtitle: o.context,
      href: `/observations/${o.slug}`
    })),
    ...cases.map((c) => ({
      type: "case" as const,
      title: c.title,
      subtitle: c.reason,
      href: `/cases/${c.slug}`
    })),
    ...glossary.map((g) => ({
      type: "term" as const,
      title: g.term,
      subtitle: g.shortDefinition,
      href: `/glossary#${g.slug}`
    })),
    ...videos.map((v) => ({
      type: "video" as const,
      title: v.title,
      subtitle: v.summary,
      href: `/videos#${v.id}`
    }))
  ];
}

let fuse: Fuse<SearchResult> | null = null;

export function search(query: string): SearchResult[] {
  if (!query.trim()) return [];
  if (!fuse) {
    fuse = new Fuse(buildIndex(), {
      keys: ["title", "subtitle"],
      threshold: 0.35
    });
  }
  return fuse.search(query).map((r) => r.item);
}
