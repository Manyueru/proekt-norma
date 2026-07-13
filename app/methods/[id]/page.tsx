import { notFound } from "next/navigation";
import { BookOpen, FileText } from "lucide-react";
import { getMethod, getSourcesByIds, getTopicsBySlugs, methods } from "@/lib/data";
import { METHOD_EVIDENCE_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RelatedLinks } from "@/components/shared/related-links";
import { TopicSection } from "@/components/topic/topic-section";

export function generateStaticParams() {
  return methods.map((method) => ({ id: method.id }));
}

export default async function MethodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const method = getMethod(id);
  if (!method) notFound();

  const sources = getSourcesByIds(method.sourceIds);
  const topics = getTopicsBySlugs(method.topicSlugs);
  const links = [
    ...topics.map((topic) => ({ href: `/modules/${topic.slug}`, label: topic.title, icon: BookOpen })),
    ...sources.map((source) => ({ href: `/sources#${source.id}`, label: source.title, icon: FileText }))
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={method.origin === "Россия" ? "blue" : "violet"}>{method.origin}</Badge>
          <Badge tone={method.evidenceStatus === "well-supported" ? "sage" : "neutral"}>{METHOD_EVIDENCE_LABELS[method.evidenceStatus]}</Badge>
          {method.contentStatus === "outline" && <Badge tone="amber">Разбор дополняется</Badge>}
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{method.title}</h1>
        <p className="mt-1 text-sm text-muted-c">{method.authors}</p>
      </div>

      <Card className="grid gap-4 md:grid-cols-3">
        <div><p className="text-xs text-muted-c">Область</p><p className="mt-1 text-sm font-medium">{method.area}</p></div>
        <div><p className="text-xs text-muted-c">Возраст и профиль</p><p className="mt-1 text-sm font-medium">{method.ageRange}</p></div>
        <div><p className="text-xs text-muted-c">Тип</p><p className="mt-1 text-sm font-medium">{method.kind}</p></div>
      </Card>

      <TopicSection title="Суть подхода">{method.summary}</TopicSection>
      <TopicSection title="Теоретическая основа" tone="muted">{method.theoreticalBasis}</TopicSection>

      <TopicSection title="Для какого профиля рассматривается">
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          {method.targetProfile.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </TopicSection>

      {method.steps.length > 0 && (
        <TopicSection title="Общая логика работы">
          <ol className="flex list-decimal flex-col gap-1.5 pl-5">
            {method.steps.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </TopicSection>
      )}

      <TopicSection title="Что известно о доказательной базе">
        <p>{method.evidenceSummary}</p>
        <p className="mt-3 text-xs text-muted-c">Статус: {METHOD_EVIDENCE_LABELS[method.evidenceStatus]}.</p>
      </TopicSection>

      <TopicSection title="Ограничения и риски ошибочного применения" tone="warning">
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          {method.limitations.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </TopicSection>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card><h2 className="text-sm font-semibold">Подготовка специалиста</h2><p className="mt-2 text-sm leading-6 text-muted-c">{method.trainingRequirements}</p></Card>
        <Card><h2 className="text-sm font-semibold">Применимость в российской практике</h2><p className="mt-2 text-sm leading-6 text-muted-c">{method.russianApplicability}</p></Card>
      </div>

      {links.length > 0 && <div><h2 className="mb-3 text-sm font-medium">Темы и источники</h2><RelatedLinks items={links} /></div>}

      <p className="border-t border-c pt-4 text-xs leading-5 text-muted-c">
        Карточка не является инструкцией для самостоятельного применения. Конкретный подход выбирают после обследования и с учётом профессиональной подготовки специалиста.
      </p>
    </div>
  );
}
