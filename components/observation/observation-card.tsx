import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ObservationCard as ObservationCardType } from "@/lib/types";

export function ObservationCard({ observation }: { observation: ObservationCardType }) {
  return (
    <Link href={`/observations/${observation.slug}`}>
      <Card className="flex flex-col gap-2 hover:border-accent-blue/40 transition-colors h-full">
        <h3 className="text-sm font-medium">{observation.title}</h3>
        <p className="text-xs text-muted-c">{observation.ageRange}</p>
        <p className="text-sm text-muted-c leading-6 line-clamp-3">{observation.context}</p>
        {observation.canBeNormalVariant && <Badge tone="sage">Может быть вариантом нормы</Badge>}
      </Card>
    </Link>
  );
}
