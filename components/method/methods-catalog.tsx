"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import type { InterventionMethod, MethodEvidenceStatus } from "@/lib/types";
import { METHOD_EVIDENCE_LABELS } from "@/lib/types";

export function MethodsCatalog({ methods }: { methods: InterventionMethod[] }) {
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState("all");
  const [evidence, setEvidence] = useState<MethodEvidenceStatus | "all">("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return methods.filter((method) => {
      if (origin !== "all" && method.origin !== origin) return false;
      if (evidence !== "all" && method.evidenceStatus !== evidence) return false;
      if (normalized && !`${method.title} ${method.authors} ${method.area} ${method.summary}`.toLowerCase().includes(normalized)) return false;
      return true;
    });
  }, [evidence, methods, origin, query]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_220px_250px]">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-c" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по методике, автору или нарушению" className="pl-9" />
        </div>
        <Select value={origin} onChange={(event) => setOrigin(event.target.value)} aria-label="Страна или научная школа">
          <option value="all">Все страны и школы</option>
          <option value="Россия">Российские</option>
          <option value="Зарубежный подход">Зарубежные</option>
        </Select>
        <Select value={evidence} onChange={(event) => setEvidence(event.target.value as MethodEvidenceStatus | "all")} aria-label="Уровень доказательной базы">
          <option value="all">Любая доказательная база</option>
          {Object.entries(METHOD_EVIDENCE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
      </div>

      <p className="text-xs text-muted-c" role="status">Найдено карточек: {filtered.length}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((method) => (
          <Link key={method.id} href={`/methods/${method.id}`}>
            <Card className="flex h-full flex-col gap-3 transition-colors hover:border-accent-blue/40">
              <div className="flex flex-wrap gap-2">
                <Badge tone={method.origin === "Россия" ? "blue" : "violet"}>{method.origin}</Badge>
                <Badge tone={method.evidenceStatus === "well-supported" ? "sage" : method.evidenceStatus === "insufficient" ? "amber" : "neutral"}>
                  {METHOD_EVIDENCE_LABELS[method.evidenceStatus]}
                </Badge>
                {method.contentStatus === "outline" && <Badge tone="amber">Карточка дополняется</Badge>}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{method.title}</h2>
                <p className="mt-1 text-xs text-muted-c">{method.authors}</p>
              </div>
              <p className="text-sm leading-6 text-muted-c">{method.summary}</p>
              <div className="mt-auto border-t border-c pt-3 text-xs text-muted-c">{method.area} · {method.ageRange}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
