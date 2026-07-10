"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, Save } from "lucide-react";
import type { ClinicalCase, ClinicalCaseAnswer } from "@/lib/types";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { TopicSection } from "@/components/topic/topic-section";

const FIELDS: [keyof ClinicalCase, string][] = [
  ["reason", "Причина обращения"],
  ["history", "Анамнез"],
  ["skills", "Навыки"],
  ["difficulties", "Трудности"],
  ["speech", "Речь"],
  ["communication", "Коммуникация"],
  ["play", "Игра"],
  ["motor", "Двигательная сфера"],
  ["hearingVision", "Слух и зрение"],
  ["behavior", "Поведение"]
];

function createAnswer(caseId: string): ClinicalCaseAnswer {
  const timestamp = new Date().toISOString();
  return {
    caseId,
    answerText: "",
    analysisRevealed: false,
    status: "draft",
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function CaseView({ clinicalCase }: { clinicalCase: ClinicalCase }) {
  const { caseAnswers, saveCaseAnswer } = usePersonalData();
  const saved = caseAnswers[clinicalCase.slug];
  const initial = useMemo(() => saved ?? createAnswer(clinicalCase.slug), [clinicalCase.slug, saved]);
  const [answer, setAnswer] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => setAnswer(initial), [initial]);

  function patch(values: Partial<ClinicalCaseAnswer>) {
    setAnswer((current) => ({ ...current, ...values }));
    setMessage(null);
  }

  async function persist(values: Partial<ClinicalCaseAnswer> = {}) {
    const next = { ...answer, ...values, updatedAt: new Date().toISOString() };
    setAnswer(next);
    await saveCaseAnswer(next);
    setMessage("Ответ сохранён.");
  }

  async function revealAnalysis() {
    await persist({ analysisRevealed: true });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map(([key, label]) => (
          <div key={key} className="rounded-card border border-c bg-surface p-4">
            <p className="text-xs text-muted-c mb-1">{label}</p>
            <p className="text-sm leading-6">{clinicalCase[key] as string}</p>
          </div>
        ))}
      </div>

      <TopicSection title="Вопросы студенту">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          {clinicalCase.questions.map((question) => <li key={question}>{question}</li>)}
        </ul>
      </TopicSection>

      <div className="flex flex-col gap-4 rounded-card border border-c bg-surface p-5">
        <FormField label="Ваш ответ" hint="Сохраните рассуждения до открытия разбора. После открытия текст не исчезнет.">
          <Textarea
            rows={8}
            placeholder="Что соответствует возрасту? Что настораживает? Каких данных не хватает?"
            value={answer.answerText}
            onChange={(event) => patch({ answerText: event.target.value })}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Статус задачи">
            <Select className="w-full" value={answer.status} onChange={(event) => patch({ status: event.target.value as ClinicalCaseAnswer["status"] })}>
              <option value="draft">Черновик</option>
              <option value="solved">Решена</option>
              <option value="review">Повторить</option>
            </Select>
          </FormField>
          <FormField label="Дата повторения" hint="Необязательно.">
            <Input type="date" value={answer.reviewDate ?? ""} onChange={(event) => patch({ reviewDate: event.target.value || undefined })} />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => void persist()}><Save size={16} />Сохранить ответ</Button>
          {!answer.analysisRevealed && <Button onClick={() => void revealAnalysis()}><Eye size={16} />Показать разбор</Button>}
          {answer.analysisRevealed && answer.status !== "solved" && <Button onClick={() => void persist({ status: "solved" })}><CheckCircle2 size={16} />Отметить решённой</Button>}
        </div>
        {message && <p className="text-xs text-muted-c" role="status">{message}</p>}
      </div>

      {answer.analysisRevealed && (
        <TopicSection title="Разбор" tone="muted">
          {clinicalCase.analysis}
        </TopicSection>
      )}
    </div>
  );
}
