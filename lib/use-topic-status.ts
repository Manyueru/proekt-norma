"use client";

import { usePersonalData } from "@/components/providers/personal-data-provider";
import type { TopicStatus } from "./types";

export function useTopicStatus(slug: string) {
  const { progress, updateTopicStatus } = usePersonalData();
  const status = progress[slug]?.status ?? "not-started";

  const update = (next: TopicStatus) => updateTopicStatus(slug, next);
  return [status, update] as const;
}

export function useAllProgress() {
  const { progress } = usePersonalData();
  return Object.fromEntries(
    Object.entries(progress).map(([slug, record]) => [slug, record.status])
  ) as Record<string, TopicStatus>;
}
