"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, CircleDashed } from "lucide-react";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { LearningModule, Topic } from "@/lib/types";

const AREAS = [
  {
    id: "profession",
    title: "Профессия, этика и доказательность",
    description: "Границы компетенции логопеда, междисциплинарная работа, профессиональные и правовые основания.",
    moduleIds: ["01", "04"],
    skills: ["Различать педагогическое заключение, рабочую гипотезу и медицинский диагноз", "Проверять качество источников", "Понимать границы компетенции"]
  },
  {
    id: "speech-foundations",
    title: "Анатомия, физиология и механизмы речи",
    description: "Речевой аппарат, слух, дыхание, голос, моторное программирование и мозговая организация речевой деятельности.",
    moduleIds: ["05", "06", "07"],
    skills: ["Объяснять механизмы речи без упрощения «одна зона — одна функция»", "Связывать симптом с возможным уровнем нарушения", "Выбирать данные для дальнейшего обследования"]
  },
  {
    id: "ontogenesis",
    title: "Онтогенез ребёнка и речи",
    description: "Общее, коммуникативное, речевое, когнитивное, игровое и моторное развитие с учётом вариативности.",
    moduleIds: ["08", "09", "10"],
    skills: ["Знать последовательность развития", "Отличать ориентир от диагностического срока", "Замечать значимые сочетания признаков"]
  },
  {
    id: "dysontogenesis",
    title: "Дизонтогенез, ОВЗ и клинические основы",
    description: "Варианты нарушенного развития, категории ОВЗ, заболевания и состояния, способные влиять на развитие и речь.",
    moduleIds: ["11", "12", "18"],
    skills: ["Видеть ребёнка целостно", "Учитывать сочетанные нарушения", "Понимать основания для направления к другим специалистам"]
  },
  {
    id: "assessment",
    title: "Логопедическое обследование",
    description: "Анамнез, наблюдение, обследование компонентов речи, интерпретация данных и дифференциальные гипотезы.",
    moduleIds: ["13"],
    skills: ["Планировать обследование", "Описывать профиль сильных сторон и трудностей", "Не делать выводов по одному заданию"]
  },
  {
    id: "speech-sound",
    title: "Звукопроизношение, моторная речь и голос",
    description: "Фонетические и фонологические нарушения, дизартрия, детская апраксия речи, ринолалия и голос.",
    moduleIds: ["14"],
    skills: ["Различать основные механизмы", "Подбирать обследование по профилю", "Строить обоснованный коррекционный маршрут"]
  },
  {
    id: "fluency",
    title: "Темп, ритм и плавность",
    description: "Нормальная неплавность, заикание, клаттеринг и связанные коммуникативные реакции.",
    moduleIds: ["15"],
    skills: ["Отличать типы неплавности", "Оценивать влияние на участие и качество жизни", "Работать с ребёнком, семьёй и средой"]
  },
  {
    id: "language",
    title: "Системные нарушения устной речи",
    description: "Алалия, языковые нарушения, ОНР и DLD, понимание и порождение речи, неговорящий ребёнок.",
    moduleIds: ["16"],
    skills: ["Анализировать языковую систему", "Разводить российские и международные термины", "Строить дифференциальные гипотезы"]
  },
  {
    id: "literacy",
    title: "Чтение и письмо",
    description: "Предпосылки грамотности, дислексия, дисграфия, дизорфография и понимание письменного текста.",
    moduleIds: ["17"],
    skills: ["Анализировать ошибки", "Различать декодирование и понимание языка", "Подбирать вмешательство под профиль трудностей"]
  },
  {
    id: "intervention",
    title: "Коррекционная работа и методики",
    description: "Цели, выбор подхода, структура занятий, перенос навыков, оценка динамики и работа с семьёй.",
    moduleIds: ["19"],
    skills: ["Ставить функциональные цели", "Сравнивать методики по механизму и доказательности", "Менять программу по данным динамики"]
  },
  {
    id: "practice",
    title: "Насмотренность и профессиональная практика",
    description: "Наблюдение, клинические задачи, документация, профессиональное рассуждение и подготовка к реальной работе.",
    moduleIds: ["20", "21", "22"],
    skills: ["Отделять наблюдение от интерпретации", "Формулировать несколько гипотез", "Выбирать безопасный следующий шаг"]
  }
] as const;

export function CompetencyMap({ topics, modules }: { topics: Topic[]; modules: LearningModule[] }) {
  const { progress } = usePersonalData();

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {AREAS.map((area) => {
        const areaTopics = topics.filter((topic) => area.moduleIds.some((moduleId) => moduleId === topic.moduleId));
        const available = areaTopics.filter((topic) => topic.contentStatus !== "outline");
        const mastered = available.filter((topic) => progress[topic.slug]?.status === "mastered").length;
        const learning = available.filter((topic) => progress[topic.slug] && progress[topic.slug]?.status !== "not-started" && progress[topic.slug]?.status !== "mastered").length;
        const readiness = areaTopics.length > 0 ? Math.round((available.length / areaTopics.length) * 100) : 0;
        const completion = available.length > 0 ? Math.round((mastered / available.length) * 100) : 0;
        const relatedModules = modules.filter((module) => area.moduleIds.some((moduleId) => moduleId === module.id));

        return (
          <Card key={area.id} className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold">{area.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-c">{area.description}</p>
              </div>
              {available.length === 0 ? (
                <Badge tone="amber"><AlertCircle size={13} className="mr-1" />Материалы готовятся</Badge>
              ) : mastered === available.length ? (
                <Badge tone="sage"><CheckCircle2 size={13} className="mr-1" />Доступное освоено</Badge>
              ) : learning > 0 ? (
                <Badge tone="blue"><CircleDashed size={13} className="mr-1" />В процессе</Badge>
              ) : (
                <Badge tone="neutral">Не начато</Badge>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="flex justify-between text-xs text-muted-c"><span>Готовность материалов</span><span>{available.length}/{areaTopics.length}</span></div>
                <div className="mt-2"><ProgressBar value={readiness} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-c"><span>Ваше освоение доступного</span><span>{mastered}/{available.length}</span></div>
                <div className="mt-2"><ProgressBar value={completion} /></div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-c">Что обязательно уметь</p>
              <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-6">
                {area.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </div>

            {relatedModules.length > 0 && (
              <Link href={`/modules?modules=${relatedModules.map((module) => module.id).join(",")}`} className="mt-auto border-t border-c pt-3 text-sm font-medium text-accent-blue hover:underline">
                Открыть связанные модули
              </Link>
            )}
          </Card>
        );
      })}
    </div>
  );
}
