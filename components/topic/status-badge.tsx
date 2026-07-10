import { Badge } from "@/components/ui/badge";
import { TOPIC_STATUS_LABELS, TopicStatus } from "@/lib/types";

const TONE: Record<TopicStatus, "blue" | "sage" | "violet" | "amber" | "neutral"> = {
  "not-started": "neutral",
  exploring: "violet",
  learning: "blue",
  "needs-practice": "amber",
  review: "amber",
  mastered: "sage"
};

export function StatusBadge({ status }: { status: TopicStatus }) {
  return <Badge tone={TONE[status]}>{TOPIC_STATUS_LABELS[status]}</Badge>;
}
