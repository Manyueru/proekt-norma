import { glossary } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GlossaryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-medium">Словарь</h1>
        <p className="text-sm text-muted-c mt-1">Термины с простым объяснением и указанием международного эквивалента</p>
      </div>
      <div className="flex flex-col gap-3">
        {glossary.map((term) => (
          <Card key={term.slug} id={term.slug} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h3 className="text-sm font-medium">{term.term}</h3>
              <span className="text-xs text-muted-c">{term.intlTerm}</span>
            </div>
            <p className="text-sm">{term.shortDefinition}</p>
            <p className="text-sm text-muted-c leading-6">{term.simpleExplanation}</p>
            <p className="text-xs text-muted-c">Пример: {term.example}</p>
            {term.relatedTerms.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-1">
                {term.relatedTerms.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
