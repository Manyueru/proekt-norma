"use client";

import Link from "next/link";
import { cases as allCases } from "@/lib/data";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CasesCatalog() {
  const { caseAnswers } = usePersonalData();
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {allCases.map((clinicalCase) => {
        const saved = caseAnswers[clinicalCase.slug];
        return (
          <Link key={clinicalCase.slug} href={`/cases/${clinicalCase.slug}`}>
            <Card className="flex flex-col gap-2 h-full hover:border-accent-blue/40 transition-colors">
              <div className="flex items-start justify-between gap-3"><h3 className="text-sm font-medium">{clinicalCase.title}</h3>{saved && <Badge tone={saved.status === "solved" ? "sage" : saved.status === "review" ? "amber" : "neutral"}>{saved.status === "solved" ? "Решена" : saved.status === "review" ? "Повторить" : "Черновик"}</Badge>}</div>
              <p className="text-xs text-muted-c">{clinicalCase.age}</p>
              <p className="text-sm text-muted-c leading-6 line-clamp-2">{clinicalCase.reason}</p>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
