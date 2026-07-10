"use client";

import { useState } from "react";
import { ClinicalCase } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
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

export function CaseView({ clinicalCase }: { clinicalCase: ClinicalCase }) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [answer, setAnswer] = useState("");

  return (
    <div className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-3">
        {FIELDS.map(([key, label]) => (
          <div key={key} className="rounded-card border border-c bg-surface p-4">
            <p className="text-xs text-muted-c mb-1">{label}</p>
            <p className="text-sm">{clinicalCase[key] as string}</p>
          </div>
        ))}
      </div>

      <TopicSection title="Вопросы студенту">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          {clinicalCase.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </TopicSection>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Ваш ответ</p>
        <Textarea
          rows={5}
          placeholder="Запишите свои рассуждения перед тем, как открыть разбор"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>

      {!showAnalysis ? (
        <Button variant="primary" onClick={() => setShowAnalysis(true)} className="w-fit">
          Показать разбор
        </Button>
      ) : (
        <TopicSection title="Разбор" tone="muted">
          {clinicalCase.analysis}
        </TopicSection>
      )}
    </div>
  );
}
