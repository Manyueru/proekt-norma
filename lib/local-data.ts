"use client";

import type {
  ClinicalCaseAnswer,
  Exam,
  Note,
  StudyTask,
  TestAttempt,
  TopicProgressRecord,
  TopicStatus
} from "./types";

const KEYS = {
  progress: "norma:v2:progress",
  notes: "norma:v2:notes",
  cases: "norma:v2:case-answers",
  tests: "norma:v2:test-attempts",
  studyTasks: "norma:v3:study-tasks",
  exams: "norma:v3:exams"
};

const LEGACY_PROGRESS_KEY = "norma:progress";
const LEGACY_NOTES_KEY = "norma:notes";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function now() {
  return new Date().toISOString();
}

export function getLocalProgress(): Record<string, TopicProgressRecord> {
  const current = read<Record<string, TopicProgressRecord>>(KEYS.progress, {});
  if (Object.keys(current).length > 0) return current;

  const legacy = read<Record<string, TopicStatus>>(LEGACY_PROGRESS_KEY, {});
  if (Object.keys(legacy).length === 0) return {};

  const migrated = Object.fromEntries(
    Object.entries(legacy).map(([topicId, status]) => [
      topicId,
      {
        topicId,
        status,
        startedAt: status !== "not-started" ? now() : undefined,
        completedAt: status === "mastered" ? now() : undefined,
        updatedAt: now()
      } satisfies TopicProgressRecord
    ])
  );
  write(KEYS.progress, migrated);
  return migrated;
}

export function setLocalProgress(record: TopicProgressRecord) {
  const all = getLocalProgress();
  all[record.topicId] = record;
  write(KEYS.progress, all);
}

interface LegacyNote {
  id: string;
  title: string;
  date?: string;
  topicSlug?: string;
  mainIdea?: string;
  newFacts?: string;
  unclear?: string;
  toCheck?: string;
  example?: string;
  reviewQuestion?: string;
  nextReviewDate?: string;
}

export function getLocalNotes(): Note[] {
  const current = read<Note[]>(KEYS.notes, []);
  if (current.length > 0) return current;

  const legacy = read<LegacyNote[]>(LEGACY_NOTES_KEY, []);
  if (legacy.length === 0) return [];

  const migrated: Note[] = legacy.map((note) => {
    const createdAt = note.date ? `${note.date}T12:00:00.000Z` : now();
    return {
      id: note.id,
      mode: "study",
      title: note.title,
      topicSlug: note.topicSlug,
      body: "",
      mainIdea: note.mainIdea ?? "",
      keyFacts: note.newFacts ?? "",
      unclearQuestions: note.unclear ?? "",
      contradictions: note.toCheck ?? "",
      practicalValue: note.example ?? "",
      reviewQuestion: note.reviewQuestion ?? "",
      reviewDate: note.nextReviewDate,
      createdAt,
      updatedAt: createdAt
    };
  });
  write(KEYS.notes, migrated);
  return migrated;
}

export function setLocalNotes(notes: Note[]) {
  write(KEYS.notes, notes);
}

export function getLocalCaseAnswers(): Record<string, ClinicalCaseAnswer> {
  return read<Record<string, ClinicalCaseAnswer>>(KEYS.cases, {});
}

export function setLocalCaseAnswer(answer: ClinicalCaseAnswer) {
  const all = getLocalCaseAnswers();
  all[answer.caseId] = answer;
  write(KEYS.cases, all);
}

export function getLocalTestAttempts(): TestAttempt[] {
  return read<TestAttempt[]>(KEYS.tests, []);
}

export function setLocalTestAttempts(attempts: TestAttempt[]) {
  write(KEYS.tests, attempts);
}


export function getLocalStudyTasks(): StudyTask[] {
  return read<StudyTask[]>(KEYS.studyTasks, []);
}

export function setLocalStudyTasks(tasks: StudyTask[]) {
  write(KEYS.studyTasks, tasks);
}

export function getLocalExams(): Exam[] {
  return read<Exam[]>(KEYS.exams, []);
}

export function setLocalExams(exams: Exam[]) {
  write(KEYS.exams, exams);
}

export interface LocalBackupV2 {
  version: 2;
  exportedAt: string;
  progress: Record<string, TopicProgressRecord>;
  notes: Note[];
  caseAnswers: Record<string, ClinicalCaseAnswer>;
  testAttempts: TestAttempt[];
}

export interface LocalBackupV3 {
  version: 3;
  exportedAt: string;
  progress: Record<string, TopicProgressRecord>;
  notes: Note[];
  caseAnswers: Record<string, ClinicalCaseAnswer>;
  testAttempts: TestAttempt[];
  studyTasks: StudyTask[];
  exams: Exam[];
}

export function createLocalBackup(): LocalBackupV3 {
  return {
    version: 3,
    exportedAt: now(),
    progress: getLocalProgress(),
    notes: getLocalNotes(),
    caseAnswers: getLocalCaseAnswers(),
    testAttempts: getLocalTestAttempts(),
    studyTasks: getLocalStudyTasks(),
    exams: getLocalExams()
  };
}

export function restoreLocalBackup(backup: LocalBackupV2 | LocalBackupV3) {
  write(KEYS.progress, backup.progress);
  write(KEYS.notes, backup.notes);
  write(KEYS.cases, backup.caseAnswers);
  write(KEYS.tests, backup.testAttempts);
  if (backup.version === 3) {
    write(KEYS.studyTasks, backup.studyTasks);
    write(KEYS.exams, backup.exams);
  }
}

export function resetLocalData() {
  Object.values(KEYS).forEach((key) => window.localStorage.removeItem(key));
  window.localStorage.removeItem(LEGACY_PROGRESS_KEY);
  window.localStorage.removeItem(LEGACY_NOTES_KEY);
}
