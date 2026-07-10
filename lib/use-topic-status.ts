"use client";

import { useEffect, useState, useCallback } from "react";
import { TopicStatus } from "./types";
import { getTopicStatus, setTopicStatus, getProgress } from "./storage";

export function useTopicStatus(slug: string) {
  const [status, setStatus] = useState<TopicStatus>("not-started");

  const sync = useCallback(() => setStatus(getTopicStatus(slug)), [slug]);

  useEffect(() => {
    sync();
    window.addEventListener("norma:progress-changed", sync);
    return () => window.removeEventListener("norma:progress-changed", sync);
  }, [sync]);

  const update = (next: TopicStatus) => {
    setTopicStatus(slug, next);
    setStatus(next);
  };

  return [status, update] as const;
}

export function useAllProgress() {
  const [progress, setProgress] = useState<Record<string, TopicStatus>>({});

  useEffect(() => {
    const sync = () => setProgress(getProgress());
    sync();
    window.addEventListener("norma:progress-changed", sync);
    return () => window.removeEventListener("norma:progress-changed", sync);
  }, []);

  return progress;
}
