"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Edit3, FileText, Plus, Search, Trash2 } from "lucide-react";
import type { Note, NoteMode } from "@/lib/types";
import { topics, sources } from "@/lib/data";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { TopicPicker } from "@/components/shared/topic-picker";
import { FormField } from "@/components/ui/form-field";

function createEmptyNote(mode: NoteMode = "quick"): Note {
  const timestamp = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    mode,
    title: "",
    body: "",
    mainIdea: "",
    keyFacts: "",
    unclearQuestions: "",
    contradictions: "",
    practicalValue: "",
    reviewQuestion: "",
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function notePreview(note: Note) {
  return note.body || note.mainIdea || note.keyFacts || "Пустой конспект";
}

export function NotesManager() {
  const searchParams = useSearchParams();
  const { notes, saveNote, deleteNote } = usePersonalData();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Note | null>(null);
  const [draft, setDraft] = useState<Note | null>(null);
  const [dirty, setDirty] = useState(false);
  const initializedFromQuery = useRef(false);

  useEffect(() => {
    if (initializedFromQuery.current) return;
    const requested = searchParams.get("note");
    if (requested) {
      const found = notes.find((note) => note.id === requested);
      if (found) {
        setActive(found);
        initializedFromQuery.current = true;
      }
      return;
    }

    const requestedMode = searchParams.get("new");
    if (requestedMode === "quick" || requestedMode === "study") {
      const note = createEmptyNote(requestedMode);
      note.topicSlug = searchParams.get("topic") || undefined;
      setDraft(note);
      initializedFromQuery.current = true;
    }
  }, [notes, searchParams]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return notes.filter((note) => {
      const linkedTopic = topics.find((topic) => topic.slug === note.topicSlug);
      const haystack = `${note.title} ${note.body} ${note.mainIdea} ${note.keyFacts} ${linkedTopic?.title ?? ""} ${linkedTopic?.moduleTitle ?? ""}`.toLowerCase();
      if (normalized && !haystack.includes(normalized)) return false;
      return true;
    });
  }, [notes, query]);

  function startNew(mode: NoteMode) {
    setActive(null);
    setDraft(createEmptyNote(mode));
    setDirty(false);
  }

  function editNote(note: Note) {
    setActive(note);
    setDraft({ ...note });
    setDirty(false);
  }

  function closeEditor() {
    if (dirty && !window.confirm("Закрыть форму и потерять несохранённые изменения?")) return;
    setDraft(null);
    setDirty(false);
  }

  function patch(values: Partial<Note>) {
    if (!draft) return;
    setDraft({ ...draft, ...values });
    setDirty(true);
  }

  async function handleSave() {
    if (!draft?.title.trim()) return;
    const saved = { ...draft, title: draft.title.trim(), updatedAt: new Date().toISOString() };
    await saveNote(saved);
    setActive(saved);
    setDraft(null);
    setDirty(false);
  }

  async function handleDelete(note: Note) {
    if (!window.confirm(`Удалить конспект «${note.title}»? Это действие нельзя отменить.`)) return;
    await deleteNote(note.id);
    if (active?.id === note.id) setActive(null);
  }

  if (draft) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-medium">{notes.some((note) => note.id === draft.id) ? "Редактирование конспекта" : "Новый конспект"}</h2>
            <p className="mt-1 text-xs text-muted-c">Поля с пояснениями можно заполнять в любом удобном порядке.</p>
          </div>
          <Button variant="ghost" onClick={closeEditor}>Закрыть</Button>
        </div>

        <Card className="flex flex-col gap-5">
          <div className="flex gap-2 rounded-lg bg-black/[0.03] p-1 dark:bg-white/[0.04]">
            <button type="button" onClick={() => patch({ mode: "quick" })} className={`flex-1 rounded-md px-3 py-2 text-sm ${draft.mode === "quick" ? "bg-surface shadow-sm" : "text-muted-c"}`}>Быстрый</button>
            <button type="button" onClick={() => patch({ mode: "study" })} className={`flex-1 rounded-md px-3 py-2 text-sm ${draft.mode === "study" ? "bg-surface shadow-sm" : "text-muted-c"}`}>Учебный</button>
          </div>

          <FormField label="Название конспекта" hint="Короткое название, по которому вы найдёте запись." required>
            <Input value={draft.title} onChange={(event) => patch({ title: event.target.value })} placeholder="Например: Совместное внимание — главное" />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Связанная тема" hint="Можно оставить без привязки.">
              <TopicPicker
                selectedSlugs={draft.topicSlug ? [draft.topicSlug] : []}
                onChange={(slugs) => patch({ topicSlug: slugs.at(-1) })}
                maxVisible={12}
                emptyHint="Найдите тему по названию или выберите её модуль."
              />
            </FormField>
            <FormField label="Источник" hint="Книга, статья, лекция или видео.">
              <Select className="w-full" value={draft.sourceId ?? ""} onChange={(event) => patch({ sourceId: event.target.value || undefined })}>
                <option value="">Источник не выбран</option>
                {sources.map((source) => <option key={source.id} value={source.id}>{source.title}</option>)}
              </Select>
            </FormField>
          </div>

          {draft.mode === "quick" ? (
            <FormField label="Текст конспекта" hint="Запишите основные мысли в свободной форме." required>
              <Textarea rows={12} value={draft.body} onChange={(event) => patch({ body: event.target.value })} placeholder="Что важно сохранить из изученного материала…" />
            </FormField>
          ) : (
            <>
              <FormField label="Главная мысль" hint="Сформулируйте основную идею своими словами."><Textarea rows={3} value={draft.mainIdea} onChange={(event) => patch({ mainIdea: event.target.value })} /></FormField>
              <FormField label="Ключевые факты" hint="Что необходимо запомнить? Можно писать списком."><Textarea rows={5} value={draft.keyFacts} onChange={(event) => patch({ keyFacts: event.target.value })} /></FormField>
              <FormField label="Что осталось непонятным" hint="Вопросы, к которым нужно вернуться."><Textarea rows={3} value={draft.unclearQuestions} onChange={(event) => patch({ unclearQuestions: event.target.value })} /></FormField>
              <FormField label="Противоречия или спорные моменты" hint="Что отличается в разных источниках или требует проверки?"><Textarea rows={3} value={draft.contradictions} onChange={(event) => patch({ contradictions: event.target.value })} /></FormField>
              <FormField label="Практическое значение" hint="Как это проявляется при наблюдении или работе с ребёнком?"><Textarea rows={3} value={draft.practicalValue} onChange={(event) => patch({ practicalValue: event.target.value })} /></FormField>
              <FormField label="Вопрос для повторения" hint="Вопрос, на который вы попробуете ответить без подсказки."><Input value={draft.reviewQuestion} onChange={(event) => patch({ reviewQuestion: event.target.value })} /></FormField>
            </>
          )}

          <FormField label="Дата повторения" hint="Необязательно. Конспект появится в списке материалов для повторения.">
            <Input type="date" value={draft.reviewDate ?? ""} onChange={(event) => patch({ reviewDate: event.target.value || undefined })} />
          </FormField>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => void handleSave()} disabled={!draft.title.trim()}>Сохранить изменения</Button>
            <Button variant="ghost" onClick={closeEditor}>Отмена</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (active) {
    const topic = topics.find((item) => item.slug === active.topicSlug);
    const source = sources.find((item) => item.id === active.sourceId);
    const sections = [
      ["Текст", active.body], ["Главная мысль", active.mainIdea], ["Ключевые факты", active.keyFacts],
      ["Что осталось непонятным", active.unclearQuestions], ["Противоречия", active.contradictions],
      ["Практическое значение", active.practicalValue], ["Вопрос для повторения", active.reviewQuestion]
    ].filter(([, value]) => value);

    return (
      <div className="flex flex-col gap-5">
        <button type="button" onClick={() => setActive(null)} className="w-fit text-xs text-accent-blue hover:underline">← Ко всем конспектам</button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div><h2 className="text-xl font-medium">{active.title}</h2><p className="mt-1 text-xs text-muted-c">Изменён {new Date(active.updatedAt).toLocaleString("ru-RU")}</p></div>
          <div className="flex gap-2"><Button onClick={() => editNote(active)}><Edit3 size={15} />Редактировать</Button><Button variant="ghost" onClick={() => void handleDelete(active)}><Trash2 size={15} />Удалить</Button></div>
        </div>
        {(topic || source || active.reviewDate) && <Card className="grid gap-3 sm:grid-cols-3">{topic&&<div><p className="text-xs text-muted-c">Тема</p><p className="mt-1 text-sm">{topic.title}</p></div>}{source&&<div><p className="text-xs text-muted-c">Источник</p><p className="mt-1 text-sm">{source.title}</p></div>}{active.reviewDate&&<div><p className="text-xs text-muted-c">Повторить</p><p className="mt-1 text-sm">{new Date(`${active.reviewDate}T12:00:00`).toLocaleDateString("ru-RU")}</p></div>}</Card>}
        {sections.map(([label, value]) => <section key={label}><h3 className="mb-2 text-sm font-medium">{label}</h3><div className="whitespace-pre-wrap rounded-card border border-c bg-surface p-4 text-sm leading-7">{value}</div></section>)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-3">
        <div className="flex items-start gap-3"><FileText size={18} className="mt-0.5 shrink-0 text-accent-blue" /><div><p className="text-sm font-medium">Какой конспект выбрать?</p><p className="mt-1 text-sm leading-6 text-muted-c"><b>Быстрый</b> — свободный текст. <b>Учебный</b> — структурированные поля для повторения и практики.</p></div></div>
        <div className="flex flex-wrap gap-2"><Button variant="primary" onClick={() => startNew("quick")}><Plus size={16} />Быстрый конспект</Button><Button onClick={() => startNew("study")}><Plus size={16} />Учебный конспект</Button></div>
      </Card>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-c" />
        <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по конспектам, теме или модулю" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((note) => {
          const topic = topics.find((item) => item.slug === note.topicSlug);
          return (
            <button key={note.id} type="button" className="h-full text-left" onClick={() => setActive(note)}>
              <Card className="flex h-full flex-col gap-2 transition-colors hover:border-accent-blue/40">
                <div className="flex items-start justify-between gap-3"><h3 className="text-sm font-medium">{note.title}</h3><span className="text-[10px] uppercase tracking-wide text-muted-c">{note.mode === "quick" ? "Быстрый" : "Учебный"}</span></div>
                {topic&&<p className="text-xs text-accent-blue">{topic.title}</p>}
                <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted-c">{notePreview(note)}</p>
                <p className="mt-auto text-xs text-muted-c">Обновлён {new Date(note.updatedAt).toLocaleDateString("ru-RU")}</p>
              </Card>
            </button>
          );
        })}
      </div>
      {!filtered.length && <p className="text-sm text-muted-c">Конспектов по выбранным условиям пока нет.</p>}
    </div>
  );
}
