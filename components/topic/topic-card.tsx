"use client";

import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Topic } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { ContentStatusBadge } from "./content-status-badge";
import { useTopicStatus } from "@/lib/use-topic-status";

export function TopicCard({ topic }: { topic: Topic }) {
  const [status] = useTopicStatus(topic.slug);
  const isOutline = topic.contentStatus === "outline";

  return (
    <Link href={`/modules/${topic.slug}`}>
      <Card className="flex h-full flex-col gap-3 transition-colors hover:border-accent-blue/40">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] text-muted-c">Тема {topic.topicOrder}</p>
            <h3 className="text-sm font-medium leading-6">{topic.title}</h3>
          </div>
          {!isOutline && <StatusBadge status={status} />}
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-muted-c">{topic.summary}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <ContentStatusBadge status={topic.contentStatus} />
          {topic.estimatedMinutes ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-c">
              <Clock3 size={12} strokeWidth={1.7} />
              {topic.estimatedMinutes} мин
            </span>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
