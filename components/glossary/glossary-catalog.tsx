"use client";

import { useMemo, useState } from "react";
import type { GlossaryTerm } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function GlossaryCatalog({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");
  const letters = Array.from(new Set(terms.map((term) => term.term[0].toUpperCase()))).sort((a, b) => a.localeCompare(b, "ru"));
  const [letter, setLetter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...terms]
      .sort((a, b) => a.term.localeCompare(b.term, "ru"))
      .filter((term) => {
        if (letter && term.term[0].toUpperCase() !== letter) return false;
        if (normalized && !`${term.term} ${term.shortDefinition} ${term.simpleExplanation} ${term.intlTerm}`.toLowerCase().includes(normalized)) return false;
        return true;
      });
  }, [letter, query, terms]);

  return (
    <div className="flex flex-col gap-4">
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по термину или определению" />
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setLetter(null)} className={`rounded-md border px-2 py-1 text-xs ${letter === null ? "border-accent-blue text-accent-blue" : "border-c text-muted-c"}`}>Все</button>
        {letters.map((item) => <button type="button" key={item} onClick={() => setLetter(item)} className={`rounded-md border px-2 py-1 text-xs ${letter === item ? "border-accent-blue text-accent-blue" : "border-c text-muted-c"}`}>{item}</button>)}
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((term) => (
          <Card key={term.slug} id={term.slug} className="flex flex-col gap-2 scroll-mt-20">
            <div className="flex items-baseline justify-between gap-3 flex-wrap"><h3 className="text-sm font-medium">{term.term}</h3><span className="text-xs text-muted-c">{term.intlTerm}</span></div>
            <p className="text-sm">{term.shortDefinition}</p>
            <p className="text-sm text-muted-c leading-6">{term.simpleExplanation}</p>
            <p className="text-xs text-muted-c">Пример: {term.example}</p>
            {term.relatedTerms.length > 0 && <div className="flex gap-2 flex-wrap mt-1">{term.relatedTerms.map((related) => <Badge key={related}>{related}</Badge>)}</div>}
          </Card>
        ))}
      </div>
      {!filtered.length && <p className="text-sm text-muted-c">Терминов по запросу не найдено.</p>}
    </div>
  );
}
