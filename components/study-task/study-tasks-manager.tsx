"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  Edit3,
  ListChecks,
  Plus,
  Trash2,
  X
} from "lucide-react";
import {
  STUDY_TASK_PRIORITY_LABELS,
  STUDY_TASK_STATUS_LABELS,
  STUDY_TASK_TYPE_LABELS,
  type StudyTask,
  type StudyTaskPriority,
  type StudyTaskStatus,
  type StudyTaskType
} from "@/lib/types";
import { formatDateTime, getDeadlineInfo, sortStudyTasks } from "@/lib/study-planner";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TopicPicker } from "@/components/shared/topic-picker";

function localDateTimeInput(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function emptyTask(): StudyTask {
  const timestamp = new Date().toISOString();
  const due = new Date();
  due.setDate(due.getDate() + 7);
  due.setHours(18, 0, 0, 0);
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    discipline: "",
    teacher: "",
    type: "other",
    dueAt: localDateTimeInput(due),
    priority: "normal",
    status: "not-started",
    topicSlugs: [],
    subtasks: [],
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

function normalizeForSave(task: StudyTask): StudyTask {
  const timestamp = new Date().toISOString();
  return {
    ...task,
    title: task.title.trim(),
    discipline: task.discipline.trim(),
    teacher: task.teacher.trim(),
    description: task.description.trim(),
    dueAt: new Date(task.dueAt).toISOString(),
    completedAt: task.status === "completed" ? task.completedAt ?? timestamp : undefined,
    updatedAt: timestamp
  };
}

function toEditorTask(task: StudyTask): StudyTask {
  return { ...task, dueAt: localDateTimeInput(new Date(task.dueAt)) };
}

export function StudyTasksManager() {
  const { studyTasks, exams, saveStudyTask, deleteStudyTask } = usePersonalData();
  const [draft, setDraft] = useState<StudyTask | null>(null);
  const [statusFilter, setStatusFilter] = useState<StudyTaskStatus | "active" | "all">("active");
  const [typeFilter, setTypeFilter] = useState<StudyTaskType | "all">("all");
  const [disciplineFilter, setDisciplineFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");

  const disciplines = useMemo(
    () => Array.from(new Set(studyTasks.map((task) => task.discipline).filter(Boolean))).sort(),
    [studyTasks]
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return sortStudyTasks(studyTasks).filter((task) => {
      if (!showCompleted && task.status === "completed") return false;
      if (statusFilter === "active" && task.status === "completed") return false;
      if (statusFilter !== "all" && statusFilter !== "active" && task.status !== statusFilter) return false;
      if (typeFilter !== "all" && task.type !== typeFilter) return false;
      if (disciplineFilter !== "all" && task.discipline !== disciplineFilter) return false;
      if (
        normalized &&
        !`${task.title} ${task.description} ${task.discipline} ${task.teacher}`
          .toLowerCase()
          .includes(normalized)
      ) return false;
      return true;
    });
  }, [disciplineFilter, query, showCompleted, statusFilter, studyTasks, typeFilter]);

  function patch(values: Partial<StudyTask>) {
    if (!draft) return;
    setDraft({ ...draft, ...values });
  }

  function addSubtask() {
    if (!draft || !newSubtask.trim()) return;
    patch({
      subtasks: [
        ...draft.subtasks,
        { id: crypto.randomUUID(), title: newSubtask.trim(), completed: false }
      ]
    });
    setNewSubtask("");
  }

  async function handleSave() {
    if (!draft?.title.trim() || !draft.dueAt) return;
    await saveStudyTask(normalizeForSave(draft));
    setDraft(null);
  }

  async function markCompleted(task: StudyTask) {
    const nextStatus: StudyTaskStatus = task.status === "completed" ? "in-progress" : "completed";
    await saveStudyTask(
      normalizeForSave({
        ...toEditorTask(task),
        status: nextStatus,
        completedAt: nextStatus === "completed" ? new Date().toISOString() : undefined
      })
    );
  }

  async function handleDelete(task: StudyTask) {
    if (!window.confirm(`Удалить задачу «${task.title}»?`)) return;
    await deleteStudyTask(task.id);
  }

  if (draft) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium">
              {studyTasks.some((task) => task.id === draft.id) ? "Редактирование задачи" : "Новая учебная задача"}
            </h2>
            <p className="mt-1 text-sm text-muted-c">
              Заполните главное: что нужно сделать и к какому сроку. Остальные поля можно оставить пустыми.
            </p>
          </div>
          <Button variant="ghost" onClick={() => setDraft(null)}><X size={16} />Закрыть</Button>
        </div>

        <Card className="flex flex-col gap-5">
          <FormField label="Что нужно сделать" hint="Например: «Реферат к Яковлевой» или «Выучить вопросы 1–10»." required>
            <Input value={draft.title} onChange={(event) => patch({ title: event.target.value })} placeholder="Реферат к Яковлевой" />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Дедлайн" hint="Дата и время, к которым задача должна быть выполнена." required>
              <Input type="datetime-local" value={draft.dueAt} onChange={(event) => patch({ dueAt: event.target.value })} />
            </FormField>
            <FormField label="Статус">
              <Select className="w-full" value={draft.status} onChange={(event) => patch({ status: event.target.value as StudyTaskStatus })}>
                {Object.entries(STUDY_TASK_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </Select>
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Дисциплина" hint="Например: логопедия.">
              <Input value={draft.discipline} onChange={(event) => patch({ discipline: event.target.value })} />
            </FormField>
            <FormField label="Преподаватель" hint="Можно указать фамилию.">
              <Input value={draft.teacher} onChange={(event) => patch({ teacher: event.target.value })} />
            </FormField>
            <FormField label="Тип работы">
              <Select className="w-full" value={draft.type} onChange={(event) => patch({ type: event.target.value as StudyTaskType })}>
                {Object.entries(STUDY_TASK_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </Select>
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Приоритет">
              <Select className="w-full" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as StudyTaskPriority })}>
                {Object.entries(STUDY_TASK_PRIORITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </Select>
            </FormField>
            <FormField label="Связанный экзамен" hint="Если задача относится к подготовке к конкретному экзамену.">
              <Select className="w-full" value={draft.examId ?? ""} onChange={(event) => patch({ examId: event.target.value || undefined })}>
                <option value="">Не связан с экзаменом</option>
                {exams.map((exam) => <option key={exam.id} value={exam.id}>{exam.title}</option>)}
              </Select>
            </FormField>
          </div>

          <FormField label="Связанные темы" hint="Найдите тему по названию или сначала выберите модуль. Привязка необязательна.">
            <TopicPicker
              selectedSlugs={draft.topicSlugs}
              onChange={(topicSlugs) => patch({ topicSlugs })}
            />
          </FormField>

          <FormField label="Описание" hint="Требования, объём, важные детали или ссылка на задание.">
            <Textarea rows={4} value={draft.description} onChange={(event) => patch({ description: event.target.value })} />
          </FormField>

          <div>
            <p className="text-sm font-medium">Подзадачи</p>
            <p className="mt-1 text-xs text-muted-c">Разбейте крупную работу на небольшие шаги.</p>
            <div className="mt-3 flex gap-2">
              <Input
                value={newSubtask}
                onChange={(event) => setNewSubtask(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSubtask();
                  }
                }}
                placeholder="Например: составить план"
              />
              <Button type="button" onClick={addSubtask}><Plus size={16} />Добавить</Button>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {draft.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 rounded-lg border border-c px-3 py-2">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => patch({ subtasks: draft.subtasks.map((item) => item.id === subtask.id ? { ...item, completed: !item.completed } : item) })}
                  />
                  <span className={cn("flex-1 text-sm", subtask.completed && "text-muted-c line-through")}>{subtask.title}</span>
                  <button type="button" aria-label="Удалить подзадачу" onClick={() => patch({ subtasks: draft.subtasks.filter((item) => item.id !== subtask.id) })} className="text-muted-c hover:text-red-500"><X size={15} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => void handleSave()} disabled={!draft.title.trim() || !draft.dueAt}><Check size={16} />Сохранить задачу</Button>
            <Button variant="ghost" onClick={() => setDraft(null)}>Отмена</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4 border-accent-blue/20 bg-accent-blue/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CalendarClock size={19} className="mt-0.5 shrink-0 text-accent-blue" />
          <div>
            <p className="text-sm font-medium">Учебные дела и дедлайны</p>
            <p className="mt-1 text-sm leading-6 text-muted-c">Срочные задачи автоматически поднимаются вверх и меняют оформление по мере приближения срока.</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setDraft(emptyTask())}><Plus size={16} />Добавить задачу</Button>
      </Card>

      <p className="rounded-lg border border-c bg-surface px-4 py-3 text-xs leading-5 text-muted-c">На этой тестовой версии дедлайны сохраняются только в текущем браузере и входят в резервную копию сайта.</p>

      <Card className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по задачам" />
        <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StudyTaskStatus | "active" | "all")}>
          <option value="active">Только активные</option>
          <option value="all">Все статусы</option>
          {Object.entries(STUDY_TASK_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as StudyTaskType | "all")}>
          <option value="all">Все типы</option>
          {Object.entries(STUDY_TASK_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Select value={disciplineFilter} onChange={(event) => setDisciplineFilter(event.target.value)}>
          <option value="all">Все дисциплины</option>
          {disciplines.map((discipline) => <option key={discipline} value={discipline}>{discipline}</option>)}
        </Select>
        <label className="flex items-center gap-2 rounded-lg border border-c px-3 text-sm">
          <input type="checkbox" checked={showCompleted} onChange={(event) => setShowCompleted(event.target.checked)} />
          Показывать выполненные
        </label>
      </Card>

      <div className="flex flex-col gap-3">
        {filtered.map((task) => {
          const deadline = getDeadlineInfo(task);
          const exam = exams.find((item) => item.id === task.examId);
          const doneSubtasks = task.subtasks.filter((item) => item.completed).length;
          return (
            <Card key={task.id} className={cn("flex flex-col gap-4", deadline.className)}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className={cn("text-base font-medium", task.status === "completed" && "text-muted-c line-through")}>{task.title}</h2>
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", deadline.textClassName)}>{deadline.label}</span>
                    {task.priority === "high" && <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] text-red-700 dark:text-red-300">Высокий приоритет</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-c">Срок: {formatDateTime(task.dueAt)}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-c">
                    {task.discipline && <span>{task.discipline}</span>}
                    {task.teacher && <span>Преподаватель: {task.teacher}</span>}
                    <span>{STUDY_TASK_TYPE_LABELS[task.type]}</span>
                    {exam && <span>Экзамен: {exam.title}</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => void markCompleted(task)}>
                    {task.status === "completed" ? <ChevronDown size={15} /> : <CheckCircle2 size={15} />}
                    {task.status === "completed" ? "Вернуть" : "Готово"}
                  </Button>
                  <Button size="sm" onClick={() => setDraft(toEditorTask(task))}><Edit3 size={15} />Изменить</Button>
                  <Button size="sm" variant="ghost" onClick={() => void handleDelete(task)}><Trash2 size={15} />Удалить</Button>
                </div>
              </div>

              {task.description && <p className="whitespace-pre-wrap text-sm leading-6 text-muted-c">{task.description}</p>}

              {task.subtasks.length > 0 && (
                <div className="rounded-lg border border-c/70 bg-surface/70 p-3">
                  <div className="flex items-center justify-between gap-3 text-xs text-muted-c">
                    <span className="flex items-center gap-1.5"><ListChecks size={14} />Подзадачи</span>
                    <span>{doneSubtasks} из {task.subtasks.length}</span>
                  </div>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {task.subtasks.map((subtask) => (
                      <label key={subtask.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => void saveStudyTask(normalizeForSave({
                            ...toEditorTask(task),
                            subtasks: task.subtasks.map((item) => item.id === subtask.id ? { ...item, completed: !item.completed } : item)
                          }))}
                        />
                        <span className={cn(subtask.completed && "text-muted-c line-through")}>{subtask.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {!filtered.length && (
        <Card className="text-center">
          <p className="text-sm font-medium">Задач по выбранным условиям нет</p>
          <p className="mt-1 text-sm text-muted-c">Можно немного выдохнуть или добавить новую учебную задачу.</p>
        </Card>
      )}
    </div>
  );
}
