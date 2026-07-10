"use client";

import { Select } from "@/components/ui/input";
import { TOPIC_STATUS_LABELS, TopicStatus } from "@/lib/types";
import { useTopicStatus } from "@/lib/use-topic-status";

export function StatusSelect({ slug }: { slug: string }) {
  const [status, setStatus] = useTopicStatus(slug);

  return (
    <Select
      value={status}
      onChange={(e) => setStatus(e.target.value as TopicStatus)}
      aria-label="Статус изучения темы"
    >
      {Object.entries(TOPIC_STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
}
