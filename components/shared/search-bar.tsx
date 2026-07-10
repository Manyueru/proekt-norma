"use client";

import { useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { search, typeLabels } from "@/lib/search";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const results = search(query);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-c" />
        <Input
          className="pl-9"
          placeholder="Темы, термины, источники, признаки, задачи, видео"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-2">
        {results.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="flex flex-col gap-1 rounded-lg border border-c px-4 py-3 hover:border-accent-blue/40"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{r.title}</span>
              <Badge>{typeLabels[r.type]}</Badge>
            </div>
            <span className="text-xs text-muted-c line-clamp-1">{r.subtitle}</span>
          </Link>
        ))}
        {query && results.length === 0 && (
          <p className="text-sm text-muted-c">Ничего не найдено по запросу «{query}»</p>
        )}
      </div>
    </div>
  );
}
