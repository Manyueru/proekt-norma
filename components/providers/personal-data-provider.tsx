"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import {
  deleteLocalObservationAttempt,
  getLocalBookProgress,
  getLocalCaseAnswers,
  getLocalExams,
  getLocalNotes,
  getLocalObservationAttempts,
  getLocalProgress,
  getLocalStudyTasks,
  getLocalTestAttempts,
  setLocalBookProgress,
  setLocalCaseAnswer,
  setLocalExams,
  setLocalNotes,
  setLocalObservationAttempt,
  setLocalProgress,
  setLocalStudyTasks,
  setLocalTestAttempts
} from "@/lib/local-data";
import type {
  BookProgress,
  ClinicalCaseAnswer,
  Exam,
  Note,
  ObservationAttempt,
  StudyTask,
  TestAttempt,
  TopicProgressRecord,
  TopicStatus
} from "@/lib/types";

interface PersonalDataContextValue {
  loading: boolean;
  syncError: string | null;
  storageMode: "cloud" | "local";
  progress: Record<string, TopicProgressRecord>;
  bookProgress: Record<string, BookProgress>;
  notes: Note[];
  caseAnswers: Record<string, ClinicalCaseAnswer>;
  observationAttempts: Record<string, ObservationAttempt>;
  testAttempts: TestAttempt[];
  studyTasks: StudyTask[];
  exams: Exam[];
  updateTopicStatus: (topicId: string, status: TopicStatus) => Promise<void>;
  markTopicOpened: (topicId: string) => Promise<void>;
  saveBookProgress: (progress: BookProgress) => Promise<void>;
  saveNote: (note: Note) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  saveCaseAnswer: (answer: ClinicalCaseAnswer) => Promise<void>;
  saveObservationAttempt: (attempt: ObservationAttempt) => Promise<void>;
  deleteObservationAttempt: (observationSlug: string) => Promise<void>;
  saveTestAttempt: (attempt: TestAttempt) => Promise<void>;
  saveStudyTask: (task: StudyTask) => Promise<void>;
  deleteStudyTask: (taskId: string) => Promise<void>;
  saveExam: (exam: Exam) => Promise<void>;
  deleteExam: (examId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const PersonalDataContext = createContext<PersonalDataContextValue | null>(null);

function now() {
  return new Date().toISOString();
}

function storageErrorMessage(error: unknown) {
  const detail = error instanceof Error ? `: ${error.message}` : "";
  return `Не удалось сохранить данные в браузере${detail}. Сделайте резервную копию и проверьте настройки браузера.`;
}

export function PersonalDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, TopicProgressRecord>>({});
  const [bookProgress, setBookProgress] = useState<Record<string, BookProgress>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [caseAnswers, setCaseAnswers] = useState<Record<string, ClinicalCaseAnswer>>({});
  const [observationAttempts, setObservationAttempts] = useState<Record<string, ObservationAttempt>>({});
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  const loadLocal = useCallback(() => {
    setProgress(getLocalProgress());
    setBookProgress(getLocalBookProgress());
    setNotes(getLocalNotes());
    setCaseAnswers(getLocalCaseAnswers());
    setObservationAttempts(getLocalObservationAttempts());
    setTestAttempts(getLocalTestAttempts());
    setStudyTasks(getLocalStudyTasks());
    setExams(getLocalExams());
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      loadLocal();
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [loadLocal]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function updateTopicStatus(topicId: string, status: TopicStatus) {
    const previous = progress[topicId];
    const timestamp = now();
    const record: TopicProgressRecord = {
      topicId,
      status,
      startedAt: previous?.startedAt || (status !== "not-started" ? timestamp : undefined),
      lastOpenedAt: previous?.lastOpenedAt ?? timestamp,
      completedAt: status === "mastered" ? timestamp : undefined,
      updatedAt: timestamp
    };

    setProgress((current) => ({ ...current, [topicId]: record }));
    try {
      setLocalProgress(record);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function markTopicOpened(topicId: string) {
    const previous = progress[topicId];
    const timestamp = now();
    const record: TopicProgressRecord = {
      topicId,
      status: previous?.status ?? "not-started",
      startedAt: previous?.startedAt,
      lastOpenedAt: timestamp,
      completedAt: previous?.completedAt,
      updatedAt: previous?.updatedAt ?? timestamp
    };

    setProgress((current) => ({ ...current, [topicId]: record }));
    try {
      setLocalProgress(record);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function saveBookProgress(progressRecord: BookProgress) {
    setBookProgress((current) => ({ ...current, [progressRecord.bookId]: progressRecord }));
    try {
      setLocalBookProgress(progressRecord);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function saveNote(note: Note) {
    const nextNotes = [note, ...notes.filter((item) => item.id !== note.id)];
    setNotes(nextNotes);
    try {
      setLocalNotes(nextNotes);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function deleteNote(noteId: string) {
    const next = notes.filter((note) => note.id !== noteId);
    setNotes(next);
    try {
      setLocalNotes(next);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function saveCaseAnswer(answer: ClinicalCaseAnswer) {
    setCaseAnswers((current) => ({ ...current, [answer.caseId]: answer }));
    try {
      setLocalCaseAnswer(answer);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function saveObservationAttempt(attempt: ObservationAttempt) {
    setObservationAttempts((current) => ({ ...current, [attempt.observationSlug]: attempt }));
    try {
      setLocalObservationAttempt(attempt);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function deleteObservationAttempt(observationSlug: string) {
    setObservationAttempts((current) => {
      const next = { ...current };
      delete next[observationSlug];
      return next;
    });
    try {
      deleteLocalObservationAttempt(observationSlug);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function saveTestAttempt(attempt: TestAttempt) {
    const next = [attempt, ...testAttempts];
    setTestAttempts(next);
    try {
      setLocalTestAttempts(next);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function saveStudyTask(task: StudyTask) {
    const next = [task, ...studyTasks.filter((item) => item.id !== task.id)].sort((a, b) =>
      a.dueAt.localeCompare(b.dueAt)
    );
    setStudyTasks(next);
    try {
      setLocalStudyTasks(next);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function deleteStudyTask(taskId: string) {
    const next = studyTasks.filter((task) => task.id !== taskId);
    setStudyTasks(next);
    try {
      setLocalStudyTasks(next);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function saveExam(exam: Exam) {
    const next = [exam, ...exams.filter((item) => item.id !== exam.id)].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    setExams(next);
    try {
      setLocalExams(next);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  async function deleteExam(examId: string) {
    const nextExams = exams.filter((exam) => exam.id !== examId);
    const nextTasks = studyTasks.map((task) =>
      task.examId === examId ? { ...task, examId: undefined, updatedAt: now() } : task
    );

    setExams(nextExams);
    setStudyTasks(nextTasks);

    try {
      setLocalExams(nextExams);
      setLocalStudyTasks(nextTasks);
      setSyncError(null);
    } catch (error) {
      setSyncError(storageErrorMessage(error));
    }
  }

  return (
    <PersonalDataContext.Provider
      value={{
        loading,
        syncError,
        storageMode: "local",
        progress,
        bookProgress,
        notes,
        caseAnswers,
        observationAttempts,
        testAttempts,
        studyTasks,
        exams,
        updateTopicStatus,
        markTopicOpened,
        saveBookProgress,
        saveNote,
        deleteNote,
        saveCaseAnswer,
        saveObservationAttempt,
        deleteObservationAttempt,
        saveTestAttempt,
        saveStudyTask,
        deleteStudyTask,
        saveExam,
        deleteExam,
        refresh
      }}
    >
      {children}
    </PersonalDataContext.Provider>
  );
}

export function usePersonalData() {
  const context = useContext(PersonalDataContext);
  if (!context) throw new Error("usePersonalData must be used inside PersonalDataProvider");
  return context;
}
