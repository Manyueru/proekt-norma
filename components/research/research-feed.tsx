"use client";

import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";

const CATEGORIES = [
  ["all", "Логопедия и нарушения речи"],
  ["early", "Раннее развитие и помощь"],
  ["language", "Язык и DLD"],
  ["speech", "Звукопроизношение и моторная речь"],
  ["fluency", "Заикание и плавность"],
  ["literacy", "Чтение и письмо"],
  ["communication", "Коммуникация, РАС и AAC"]
] as const;

type ResearchItem = {
  id: string;
  title: string;
  journal: string;
  publishedAt: string;
  authors: string[];
  doi?: string;
  url: string;
};

type ResearchResponse = {
  category: string;
  checkedAt: string;
  items: ResearchItem[];
  error?: string;
};

export function ResearchFeed() {
  const [category, setCategory] = useState("all");
  const [data, setData] = useState<ResearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/research?category=${category}&limit=12`, { signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json()) as ResearchResponse;
        setData(payload);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setData({ category, checkedAt: new Date().toISOString(), items: [], error: "Не удалось загрузить ленту." });
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [category, requestKey]);

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-base font-semibold">Новые публикации PubMed</h2>
          <p className="mt-1 text-sm leading-6 text-muted-c">
            Это автоматическая лента метаданных. Появление статьи здесь не означает, что её выводы уже проверены или включены в курс.
          </p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <Select value={category} onChange={(event) => setCategory(event.target.value)} className="min-w-0 md:w-[300px]" aria-label="Направление научной ленты">
            {CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
          <Button variant="ghost" onClick={() => setRequestKey((value) => value + 1)} disabled={loading} aria-label="Повторить загрузку ленты">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </Card>

      {data?.checkedAt && (
        <p className="text-xs text-muted-c">Последняя попытка обновления: {new Date(data.checkedAt).toLocaleString("ru-RU")}</p>
      )}

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => <Card key={index} className="h-40 animate-pulse bg-black/[0.025] dark:bg-white/[0.035]" />)}
        </div>
      ) : data?.error ? (
        <Card><p className="text-sm text-amber-700 dark:text-amber-300">{data.error}</p></Card>
      ) : data && data.items.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.items.map((item) => (
            <Card key={item.id} className="flex h-full flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge tone="amber">Новая · не проверена</Badge>
                <Badge tone="neutral">PubMed</Badge>
              </div>
              <h3 className="text-base font-semibold leading-6">{item.title}</h3>
              <p className="text-xs leading-5 text-muted-c">
                {item.authors.length > 0 ? item.authors.join(", ") : "Авторы не указаны"}
              </p>
              <div className="mt-auto border-t border-c pt-3 text-xs leading-5 text-muted-c">
                <p>{item.journal}</p>
                <p>{item.publishedAt}{item.doi ? ` · DOI: ${item.doi}` : ""}</p>
              </div>
              <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-blue hover:underline">
                Открыть запись в PubMed <ExternalLink size={14} />
              </a>
            </Card>
          ))}
        </div>
      ) : (
        <Card><p className="text-sm text-muted-c">За выбранный период публикаций по этому запросу не найдено.</p></Card>
      )}

      <p className="border-t border-c pt-4 text-xs leading-5 text-muted-c">
        Лента использует библиографические метаданные PubMed через NCBI E-utilities.
        Правила и ограничения NCBI доступны в их <a href="https://www.ncbi.nlm.nih.gov/home/about/policies/" target="_blank" rel="noreferrer" className="text-accent-blue hover:underline">официальной политике</a>.
      </p>
    </div>
  );
}
