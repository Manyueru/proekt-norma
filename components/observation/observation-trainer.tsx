"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, RotateCcw, Save } from "lucide-react";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/input";
import type { ObservationAttempt, ObservationCard } from "@/lib/types";

function emptyAttempt(slug: string): ObservationAttempt {
  const timestamp = new Date().toISOString();
  return {
    observationSlug: slug,
    signsNoticed: "",
    normAndConcern: "",
    missingInformation: "",
    nextChecks: "",
    specialistsReasoning: "",
    analysisRevealed: false,
    status: "draft",
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function reviewDateIn(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ObservationTrainer({ observation }: { observation: ObservationCard }) {
  const { observationAttempts, saveObservationAttempt, deleteObservationAttempt } = usePersonalData();
  const saved = observationAttempts[observation.slug];
  const [draft, setDraft] = useState<ObservationAttempt>(() => saved ?? emptyAttempt(observation.slug));
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (saved) setDraft(saved);
  }, [saved]);

  const hasDraftContent = useMemo(
    () => [draft.signsNoticed, draft.normAndConcern, draft.missingInformation, draft.nextChecks, draft.specialistsReasoning]
      .some((value) => value.trim().length > 0),
    [draft]
  );
  const canRevealAnalysis = useMemo(
    () => draft.signsNoticed.trim().length >= 20
      && draft.missingInformation.trim().length >= 15
      && draft.nextChecks.trim().length >= 15,
    [draft.missingInformation, draft.nextChecks, draft.signsNoticed]
  );

  function patch(values: Partial<ObservationAttempt>) {
    setDraft((current) => ({ ...current, ...values }));
    setMessage("");
  }

  async function persist(values: Partial<ObservationAttempt> = {}) {
    const next: ObservationAttempt = {
      ...draft,
      ...values,
      updatedAt: new Date().toISOString()
    };
    setDraft(next);
    await saveObservationAttempt(next);
    setMessage("Ответ сохранён в этом браузере.");
  }

  async function revealAnalysis() {
    await persist({ analysisRevealed: true, status: "reviewed" });
  }

  async function complete() {
    await persist({
      analysisRevealed: true,
      status: "completed",
      reviewDate: reviewDateIn(7)
    });
    setMessage("Тренировка завершена. Повтор запланирован через 7 дней.");
  }

  async function reset() {
    if (!window.confirm("Очистить ваш ответ и пройти карточку заново?")) return;
    const next = emptyAttempt(observation.slug);
    setDraft(next);
    await deleteObservationAttempt(observation.slug);
    setMessage("Карточка очищена и снова считается новой.");
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-c">Тренажёр наблюдения</p>
            <h2 className="mt-1 text-lg font-semibold">Сначала сформулируйте собственную гипотезу</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-c">
              Здесь не требуется угадать диагноз. Задача — заметить признаки, определить недостающие данные и предложить безопасный следующий шаг.
            </p>
          </div>
          <Badge tone={draft.status === "completed" ? "sage" : draft.status === "reviewed" ? "blue" : "neutral"}>
            {draft.status === "completed" ? "Пройдено" : draft.status === "reviewed" ? "Разбор открыт" : "Черновик"}
          </Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="1. Какие признаки вы заметили?" hint="Отделяйте наблюдаемый факт от интерпретации.">
            <Textarea
              rows={5}
              value={draft.signsNoticed}
              onChange={(event) => patch({ signsNoticed: event.target.value })}
              placeholder="Например: ребёнок не откликнулся в нескольких ситуациях, но реагировал на другой звук…"
            />
          </FormField>

          <FormField label="2. Что может быть вариантом нормы, а что настораживает?" hint="Учитывайте частоту, устойчивость и сочетание признаков.">
            <Textarea
              rows={5}
              value={draft.normAndConcern}
              onChange={(event) => patch({ normAndConcern: event.target.value })}
            />
          </FormField>

          <FormField label="3. Каких данных не хватает?" hint="Возраст, анамнез, слух, условия наблюдения, другие линии развития.">
            <Textarea
              rows={5}
              value={draft.missingInformation}
              onChange={(event) => patch({ missingInformation: event.target.value })}
            />
          </FormField>

          <FormField label="4. Что вы проверите дальше?" hint="Сформулируйте последовательность наблюдения или обследования.">
            <Textarea
              rows={5}
              value={draft.nextChecks}
              onChange={(event) => patch({ nextChecks: event.target.value })}
            />
          </FormField>
        </div>

        <FormField label="5. Нужны ли другие специалисты и зачем?" hint="Не просто перечислите специалистов — объясните основание направления.">
          <Textarea
            rows={4}
            value={draft.specialistsReasoning}
            onChange={(event) => patch({ specialistsReasoning: event.target.value })}
          />
        </FormField>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void persist()} disabled={!hasDraftContent}><Save size={16} />Сохранить черновик</Button>
          {!draft.analysisRevealed && (
            <Button variant="primary" onClick={() => void revealAnalysis()} disabled={!canRevealAnalysis}>
              <Eye size={16} />Открыть разбор
            </Button>
          )}
          {draft.analysisRevealed && draft.status !== "completed" && (
            <Button variant="primary" onClick={() => void complete()}>
              <CheckCircle2 size={16} />Завершить тренировку
            </Button>
          )}
          <Button variant="ghost" onClick={() => void reset()}><RotateCcw size={16} />Начать заново</Button>
        </div>
        {!draft.analysisRevealed && hasDraftContent && !canRevealAnalysis && (
          <p className="text-xs leading-5 text-muted-c">Чтобы открыть разбор, опишите наблюдаемые признаки, недостающие сведения и следующий шаг чуть подробнее.</p>
        )}
        {message && <p className="text-xs text-muted-c" role="status">{message}</p>}
      </Card>

      {draft.analysisRevealed && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-c">Разбор специалиста</p>
            <h2 className="mt-1 text-lg font-semibold">Сопоставьте свою логику с ориентиром</h2>
            <p className="mt-2 text-sm leading-6 text-muted-c">
              Это не единственно возможный ответ. Важны полнота наблюдения, осторожность выводов и обоснованный следующий шаг.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h3 className="text-sm font-semibold">Возможные объяснения</h3>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-6">
                {observation.possibleExplanations.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold">Что необходимо уточнить</h3>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-6">
                {observation.whatToCheck.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Card>

            <Card className="border-amber-300/50 bg-amber-50/40 dark:bg-amber-950/10">
              <h3 className="text-sm font-semibold">Признаки, повышающие настороженность</h3>
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-6">
                {observation.redFlags.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold">Кого можно подключить</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {observation.specialists.map((specialist) => <Badge key={specialist}>{specialist}</Badge>)}
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-c">
                Направление зависит от совокупности данных. Само наличие признака не означает конкретного диагноза.
              </p>
            </Card>
          </div>

          {draft.reviewDate && (
            <p className="text-xs text-muted-c">Дата повторения: {new Date(`${draft.reviewDate}T12:00:00`).toLocaleDateString("ru-RU")}.</p>
          )}
        </div>
      )}
    </div>
  );
}
