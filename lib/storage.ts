"use client";

import { Note, TopicStatus } from "./types";

const PROGRESS_KEY = "norma:progress";
const NOTES_KEY = "norma:notes";
const BACKUP_VERSION = 1;

type ProgressMap = Record<string, TopicStatus>;

export interface NormaBackup {
  version: number;
  exportedAt: string;
  progress: ProgressMap;
  notes: Note[];
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function notifyAll() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("norma:progress-changed"));
  window.dispatchEvent(new Event("norma:notes-changed"));
}

export function getProgress(): ProgressMap {
  return readJson<ProgressMap>(PROGRESS_KEY, {});
}

export function setTopicStatus(slug: string, status: TopicStatus) {
  const progress = getProgress();
  progress[slug] = status;
  writeJson(PROGRESS_KEY, progress);
  window.dispatchEvent(new Event("norma:progress-changed"));
}

export function getTopicStatus(slug: string): TopicStatus {
  return getProgress()[slug] ?? "not-started";
}

export function getNotes(): Note[] {
  return readJson<Note[]>(NOTES_KEY, []);
}

export function saveNote(note: Note) {
  const notes = getNotes();
  const index = notes.findIndex((n) => n.id === note.id);
  if (index >= 0) notes[index] = note;
  else notes.unshift(note);
  writeJson(NOTES_KEY, notes);
  window.dispatchEvent(new Event("norma:notes-changed"));
}

export function deleteNote(id: string) {
  writeJson(
    NOTES_KEY,
    getNotes().filter((n) => n.id !== id)
  );
  window.dispatchEvent(new Event("norma:notes-changed"));
}

export function createBackup(): NormaBackup {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    progress: getProgress(),
    notes: getNotes()
  };
}

export function downloadBackup() {
  const backup = createBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `norma-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function isBackup(value: unknown): value is NormaBackup {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<NormaBackup>;
  return (
    candidate.version === BACKUP_VERSION &&
    typeof candidate.exportedAt === "string" &&
    !!candidate.progress &&
    typeof candidate.progress === "object" &&
    Array.isArray(candidate.notes)
  );
}

export async function importBackup(file: File) {
  const parsed = JSON.parse(await file.text()) as unknown;
  if (!isBackup(parsed)) {
    throw new Error("Файл не похож на резервную копию проекта «Норма».");
  }
  writeJson(PROGRESS_KEY, parsed.progress);
  writeJson(NOTES_KEY, parsed.notes);
  notifyAll();
}

export function resetLocalData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROGRESS_KEY);
  window.localStorage.removeItem(NOTES_KEY);
  notifyAll();
}
