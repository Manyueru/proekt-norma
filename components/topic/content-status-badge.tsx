import { Badge } from "@/components/ui/badge";
import { CONTENT_STATUS_LABELS, type ContentStatus } from "@/lib/types";

const tones: Record<ContentStatus, "neutral" | "amber" | "sage"> = {
  outline: "neutral",
  draft: "amber",
  verified: "sage"
};

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  return <Badge tone={tones[status]}>{CONTENT_STATUS_LABELS[status]}</Badge>;
}
