import { ResearchFeed } from "@/components/research/research-feed";

export default function ResearchPage() {
  return (
    <div className="flex flex-col gap-7">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-c">Научная лента</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Новые исследования</h1>
        <p className="mt-3 text-sm leading-6 text-muted-c">
          Свежие публикации по логопедии, развитию речи, коммуникации, чтению и письму. Сначала статья появляется как непроверенная запись; после разбора ей можно присвоить статус и связать с учебной темой.
        </p>
      </div>
      <ResearchFeed />
    </div>
  );
}
