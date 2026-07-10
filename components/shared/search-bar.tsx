"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { search, typeLabels, type SearchResult } from "@/lib/search";
import { usePersonalData } from "@/components/providers/personal-data-provider";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const { notes } = usePersonalData();

  const results = useMemo(() => {
    const staticResults = search(query);
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    const noteResults: SearchResult[] = notes
      .filter((note) => `${note.title} ${note.body} ${note.mainIdea} ${note.keyFacts}`.toLowerCase().includes(normalized))
      .map((note) => ({
        type: "note",
        title: note.title,
        subtitle: note.body || note.mainIdea || note.keyFacts || "Личный конспект",
        href: `/notes?note=${note.id}`
      }));
    return [...noteResults, ...staticResults];
  }, [notes, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-c" />
        <Input
          className="pl-9"
          placeholder="Темы, термины, источники, задачи и личные конспекты"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        {results.map((result, index) => (
          <Link
            key={`${result.type}-${result.href}-${index}`}
            href={result.href}
            className="flex flex-col gap-1 rounded-lg border border-c px-4 py-3 hover:border-accent-blue/40"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{result.title}</span>
              <Badge>{typeLabels[result.type]}</Badge>
            </div>
            <span className="text-xs text-muted-c line-clamp-1">{result.subtitle}</span>
          </Link>
        ))}
        {query && results.length === 0 && <p className="text-sm text-muted-c">Ничего не найдено по запросу «{query}».</p>}
        {!query && <p className="text-sm text-muted-c">Начните вводить запрос. Личные конспекты видит только их владелец.</p>}
      </div>
    </div>
  );
}
