import { Badge } from "@/components/ui/badge";
import { ReliabilityLevel } from "@/lib/types";

const TONE: Record<ReliabilityLevel, "sage" | "blue" | "amber" | "neutral"> = {
  A: "sage",
  B: "blue",
  C: "amber",
  D: "neutral"
};

export function ReliabilityBadge({ level }: { level: ReliabilityLevel }) {
  return <Badge tone={TONE[level]}>Уровень {level}</Badge>;
}
