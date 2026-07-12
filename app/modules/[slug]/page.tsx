import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, ClipboardList, Video } from "lucide-react";
import { getSourcesByIds, getTopic, getCasesBySlugs, topics } from "@/lib/data";
import { TRACK_LABELS } from "@/lib/types";
import { TopicSection } from "@/components/topic/topic-section";
import { TopicProgressControls } from "@/components/topic/topic-progress-controls";
import { MiniTest } from "@/components/topic/mini-test";
import { RelatedLinks } from "@/components/shared/related-links";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }));
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const relatedSources = getSourcesByIds(topic.sourceIds);
  const relatedCases = getCasesBySlugs(topic.caseSlugs);

  const relatedItems = [
    ...topic.videoIds.map((id) => ({
      href: `/videos#${id}`,
      label: "Видео по теме",
      icon: Video
    })),
    ...relatedCases.map((c) => ({
      href: `/cases/${c.slug}`,
      label: `Клиническая задача: ${c.title}`,
      icon: ClipboardList
    })),
    ...relatedSources.map((s) => ({
      href: `/sources#${s.id}`,
      label: s.title,
      icon: FileText
    }))
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-muted-c mb-2">{TRACK_LABELS[topic.track]}</p>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{topic.title}</h1>
          <TopicProgressControls slug={topic.slug} />
        </div>
        <p className="text-xs text-muted-c mt-2">Обновлено {topic.updatedAt}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-c leading-7">{topic.summary}</p>
        <Link href={`/notes?new=study&topic=${topic.slug}`} className="shrink-0">
          <Button>Создать конспект по теме</Button>
        </Link>
      </div>

      <TopicSection title="Цели обучения">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          {topic.goals.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </TopicSection>

      <TopicSection title="Ключевые понятия">
        <div className="flex gap-2 flex-wrap">
          {topic.keyConcepts.map((c) => (
            <Badge key={c}>{c}</Badge>
          ))}
        </div>
      </TopicSection>

      <TopicSection title="Теория">{topic.theory}</TopicSection>
      <TopicSection title="Практические проявления">{topic.practicalSigns}</TopicSection>
      <TopicSection title="Норма">{topic.norm}</TopicSection>
      <TopicSection title="Тревожные признаки" tone="warning">
        {topic.redFlags}
      </TopicSection>
      <TopicSection title="Ограничения интерпретации">{topic.limitations}</TopicSection>

      <TopicSection title="Дифференциальные вопросы">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          {topic.differentialQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </TopicSection>

      {relatedItems.length > 0 && (
        <div>
          <h2 className="text-sm font-medium mb-3">Связанные материалы</h2>
          <RelatedLinks items={relatedItems} />
        </div>
      )}

      {topic.miniTest.length > 0 && (
        <div className="border-t border-c pt-6">
          <h2 className="text-sm font-medium mb-4">Мини-тест</h2>
          <MiniTest topicSlug={topic.slug} questions={topic.miniTest} />
        </div>
      )}
    </div>
  );
}
