import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReliabilityBadge } from "./reliability-badge";
import { Source } from "@/lib/types";

export function SourceCard({ source }: { source: Source }) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium">{source.title}</h3>
        <ReliabilityBadge level={source.reliability} />
      </div>
      <p className="text-xs text-muted-c">
        {source.author}
        {source.organization ? `, ${source.organization}` : ""} · {source.year}
      </p>
      <p className="text-sm text-muted-c leading-6">{source.summary}</p>
      <div className="flex gap-2 flex-wrap mt-1">
        <Badge>{source.type}</Badge>
        <Badge>{source.language}</Badge>
        {!source.isCurrent && <Badge tone="amber">Требует проверки актуальности</Badge>}
        {!source.url && <Badge tone="amber">Ссылка требует проверки</Badge>}
      </div>
      {source.url ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex w-fit items-center gap-1 text-sm text-accent-blue hover:underline"
        >
          Открыть источник <ExternalLink size={14} />
        </a>
      ) : (
        <p className="mt-1 text-xs text-muted-c">Ссылка пока не добавлена.</p>
      )}
    </Card>
  );
}
