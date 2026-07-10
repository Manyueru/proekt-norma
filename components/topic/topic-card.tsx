"use client";

import Link from "next/link";
import { Topic } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { useTopicStatus } from "@/lib/use-topic-status";

export function TopicCard({ topic }: { topic: Topic }) {
  const [status] = useTopicStatus(topic.slug);

  return (
    <Link href={`/modules/${topic.slug}`}>
      <Card className="flex flex-col gap-2 h-full hover:border-accent-blue/40 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium">{topic.title}</h3>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm text-muted-c leading-6 line-clamp-3">{topic.summary}</p>
      </Card>
    </Link>
  );
}
