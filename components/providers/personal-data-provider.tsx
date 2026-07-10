"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useAuth } from "./auth-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  getLocalCaseAnswers,
  getLocalNotes,
  getLocalProgress,
  getLocalTestAttempts,
  setLocalCaseAnswer,
  setLocalNotes,
  setLocalProgress,
  setLocalTestAttempts
} from "@/lib/local-data";
import type {
  ClinicalCaseAnswer,
  Note,
  TestAttempt,
  TopicProgressRecord,
  TopicStatus
} from "@/lib/types";

interface PersonalDataContextValue {
  loading: boolean;
  syncError: string | null;
  storageMode: "cloud" | "local";
  progress: Record<string, TopicProgressRecord>;
  notes: Note[];
  caseAnswers: Record<string, ClinicalCaseAnswer>;
  testAttempts: TestAttempt[];
  updateTopicStatus: (topicId: string, status: TopicStatus) => Promise<void>;
  markTopicOpened: (topicId: string) => Promise<void>;
  saveNote: (note: Note) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  saveCaseAnswer: (answer: ClinicalCaseAnswer) => Promise<void>;
  saveTestAttempt: (attempt: TestAttempt) => Promise<void>;
  refresh: () => Promise<void>;
}

const PersonalDataContext = createContext<PersonalDataContextValue | null>(null);

function now() {
  return new Date().toISOString();
}

function rowToProgress(row: Record<string, unknown>): TopicProgressRecord {
  return {
    topicId: String(row.topic_id),
    status: row.status as TopicStatus,
    startedAt: (row.started_at as string | null) ?? undefined,
    lastOpenedAt: (row.last_opened_at as string | null) ?? undefined,
    completedAt: (row.completed_at as string | null) ?? undefined,
    updatedAt: String(row.updated_at)
  };
}

function rowToNote(row: Record<string, unknown>): Note {
  return {
    id: String(row.id),
    mode: row.mode as Note["mode"],
    title: String(row.title),
    topicSlug: (row.topic_id as string | null) ?? undefined,
    sourceId: (row.source_id as string | null) ?? undefined,
    body: String(row.body ?? ""),
    mainIdea: String(row.main_idea ?? ""),
    keyFacts: String(row.key_facts ?? ""),
    unclearQuestions: String(row.unclear_questions ?? ""),
    contradictions: String(row.contradictions ?? ""),
    practicalValue: String(row.practical_value ?? ""),
    reviewQuestion: String(row.review_question ?? ""),
    reviewDate: (row.review_date as string | null) ?? undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

function rowToCaseAnswer(row: Record<string, unknown>): ClinicalCaseAnswer {
  return {
    caseId: String(row.case_id),
    answerText: String(row.answer_text ?? ""),
    analysisRevealed: Boolean(row.analysis_revealed),
    status: row.status as ClinicalCaseAnswer["status"],
    reviewDate: (row.review_date as string | null) ?? undefined,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

function rowToTestAttempt(row: Record<string, unknown>): TestAttempt {
  return {
    id: String(row.id),
    quizId: String(row.quiz_id),
    topicSlug: String(row.topic_id),
    answers: (row.answers as Record<string, number>) ?? {},
    score: Number(row.score),
    total: Number(row.total),
    completedAt: String(row.completed_at)
  };
}

export function PersonalDataProvider({ children }: { children: ReactNode }) {
  const { user, configured, loading: authLoading } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [cloudAvailable, setCloudAvailable] = useState(true);
  const [progress, setProgress] = useState<Record<string, TopicProgressRecord>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [caseAnswers, setCaseAnswers] = useState<Record<string, ClinicalCaseAnswer>>({});
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);

  const storageMode = user && configured && supabase && cloudAvailable ? "cloud" : "local";

  const loadLocal = useCallback(() => {
    setProgress(getLocalProgress());
    setNotes(getLocalNotes());
    setCaseAnswers(getLocalCaseAnswers());
    setTestAttempts(getLocalTestAttempts());
    setSyncError(null);
  }, []);

  const refresh = useCallback(async () => {
    if (authLoading) return;
    setLoading(true);

    if (!user || !configured || !supabase) {
      loadLocal();
      setLoading(false);
      return;
    }

    const [progressResult, notesResult, casesResult, testsResult] = await Promise.all([
      supabase.from("topic_progress").select("*").eq("user_id", user.id),
      supabase.from("notes").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
      supabase.from("clinical_case_answers").select("*").eq("user_id", user.id),
      supabase.from("test_attempts").select("*").eq("user_id", user.id).order("completed_at", { ascending: false })
    ]);

    const firstError =
      progressResult.error || notesResult.error || casesResult.error || testsResult.error;

    if (firstError) {
      setSyncError(
        "Не удалось загрузить данные аккаунта. Проверьте, что в Supabase выполнен файл schema.sql. Временно показаны данные этого браузера."
      );
      setCloudAvailable(false);
      loadLocal();
      setLoading(false);
      return;
    }

    setCloudAvailable(true);
    setProgress(
      Object.fromEntries(
        (progressResult.data ?? []).map((row) => {
          const record = rowToProgress(row);
          return [record.topicId, record];
        })
      )
    );
    setNotes((notesResult.data ?? []).map(rowToNote));
    setCaseAnswers(
      Object.fromEntries(
        (casesResult.data ?? []).map((row) => {
          const record = rowToCaseAnswer(row);
          return [record.caseId, record];
        })
      )
    );
    setTestAttempts((testsResult.data ?? []).map(rowToTestAttempt));
    setSyncError(null);
    setLoading(false);
  }, [authLoading, configured, loadLocal, supabase, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function updateTopicStatus(topicId: string, status: TopicStatus) {
    const previous = progress[topicId];
    const timestamp = now();
    const record: TopicProgressRecord = {
      topicId,
      status,
      startedAt:
        previous?.startedAt || (status !== "not-started" ? timestamp : undefined),
      lastOpenedAt: previous?.lastOpenedAt ?? timestamp,
      completedAt: status === "mastered" ? timestamp : undefined,
      updatedAt: timestamp
    };

    setProgress((current) => ({ ...current, [topicId]: record }));

    if (storageMode === "cloud" && user && supabase) {
      const { error } = await supabase.from("topic_progress").upsert(
        {
          user_id: user.id,
          topic_id: topicId,
          status,
          started_at: record.startedAt ?? null,
          last_opened_at: record.lastOpenedAt ?? null,
          completed_at: record.completedAt ?? null,
          updated_at: timestamp
        },
        { onConflict: "user_id,topic_id" }
      );
      if (error) setSyncError(`Не удалось сохранить прогресс: ${error.message}`);
    } else {
      setLocalProgress(record);
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

    if (storageMode === "cloud" && user && supabase) {
      const { error } = await supabase.from("topic_progress").upsert(
        {
          user_id: user.id,
          topic_id: topicId,
          status: record.status,
          started_at: record.startedAt ?? null,
          last_opened_at: timestamp,
          completed_at: record.completedAt ?? null,
          updated_at: record.updatedAt
        },
        { onConflict: "user_id,topic_id" }
      );
      if (error) setSyncError(`Не удалось сохранить последнее открытие: ${error.message}`);
    } else {
      setLocalProgress(record);
    }
  }

  async function saveNote(note: Note) {
    const nextNotes = [note, ...notes.filter((item) => item.id !== note.id)];
    setNotes(nextNotes);

    if (storageMode === "cloud" && user && supabase) {
      const { error } = await supabase.from("notes").upsert({
        id: note.id,
        user_id: user.id,
        mode: note.mode,
        title: note.title,
        topic_id: note.topicSlug ?? null,
        source_id: note.sourceId ?? null,
        body: note.body,
        main_idea: note.mainIdea,
        key_facts: note.keyFacts,
        unclear_questions: note.unclearQuestions,
        contradictions: note.contradictions,
        practical_value: note.practicalValue,
        review_question: note.reviewQuestion,
        review_date: note.reviewDate ?? null,
        created_at: note.createdAt,
        updated_at: note.updatedAt
      });
      if (error) setSyncError(`Не удалось сохранить конспект: ${error.message}`);
    } else {
      setLocalNotes(nextNotes);
    }
  }

  async function deleteNote(noteId: string) {
    const next = notes.filter((note) => note.id !== noteId);
    setNotes(next);

    if (storageMode === "cloud" && user && supabase) {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", user.id);
      if (error) setSyncError(`Не удалось удалить конспект: ${error.message}`);
    } else {
      setLocalNotes(next);
    }
  }

  async function saveCaseAnswer(answer: ClinicalCaseAnswer) {
    setCaseAnswers((current) => ({ ...current, [answer.caseId]: answer }));

    if (storageMode === "cloud" && user && supabase) {
      const { error } = await supabase.from("clinical_case_answers").upsert(
        {
          user_id: user.id,
          case_id: answer.caseId,
          answer_text: answer.answerText,
          analysis_revealed: answer.analysisRevealed,
          status: answer.status,
          review_date: answer.reviewDate ?? null,
          created_at: answer.createdAt,
          updated_at: answer.updatedAt
        },
        { onConflict: "user_id,case_id" }
      );
      if (error) setSyncError(`Не удалось сохранить ответ: ${error.message}`);
    } else {
      setLocalCaseAnswer(answer);
    }
  }

  async function saveTestAttempt(attempt: TestAttempt) {
    const next = [attempt, ...testAttempts];
    setTestAttempts(next);

    if (storageMode === "cloud" && user && supabase) {
      const { error } = await supabase.from("test_attempts").insert({
        id: attempt.id,
        user_id: user.id,
        quiz_id: attempt.quizId,
        topic_id: attempt.topicSlug,
        answers: attempt.answers,
        score: attempt.score,
        total: attempt.total,
        completed_at: attempt.completedAt
      });
      if (error) setSyncError(`Не удалось сохранить результат теста: ${error.message}`);
    } else {
      setLocalTestAttempts(next);
    }
  }

  return (
    <PersonalDataContext.Provider
      value={{
        loading,
        syncError,
        storageMode,
        progress,
        notes,
        caseAnswers,
        testAttempts,
        updateTopicStatus,
        markTopicOpened,
        saveNote,
        deleteNote,
        saveCaseAnswer,
        saveTestAttempt,
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
