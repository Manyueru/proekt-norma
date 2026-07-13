import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ObservationAttempt, ObservationCard as ObservationCardType } from "@/lib/types";
import { OBSERVATION_CATEGORY_LABELS } from "@/lib/types";

export function ObservationCard({
  observation,
  attempt
}: {
  observation: ObservationCardType;
  attempt?: ObservationAttempt;
}) {
  return (
    <Link href={`/observations/${observation.slug}`}>
      <Card className="flex h-full flex-col gap-3 transition-colors hover:border-accent-blue/40">
        <div className="flex flex-wrap items-center gap-2">
          {observation.category && <Badge>{OBSERVATION_CATEGORY_LABELS[observation.category]}</Badge>}
          {observation.difficulty && <Badge tone="neutral">{observation.difficulty}</Badge>}
        </div>
        <div>
          <h3 className="text-sm font-medium">{observation.title}</h3>
          <p className="mt-1 text-xs text-muted-c">{observation.ageRange}</p>
        </div>
        <p className="line-clamp-4 text-sm leading-6 text-muted-c">{observation.context}</p>
        <div className="mt-auto flex items-center gap-2 border-t border-c pt-3 text-xs text-muted-c">
          {attempt?.status === "completed" ? (
            <><CheckCircle2 size={15} className="text-emerald-600" />Пройдено</>
          ) : attempt ? (
            <><Clock3 size={15} />Ответ сохранён</>
          ) : (
            <><Clock3 size={15} />Новая тренировка</>
          )}
        </div>
      </Card>
    </Link>
  );
}
