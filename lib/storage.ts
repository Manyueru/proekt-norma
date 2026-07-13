"use client";

import {
  createLocalBackup,
  restoreLocalBackup,
  resetLocalData as reset,
  type LocalBackupV2,
  type LocalBackupV3,
  type LocalBackupV4
} from "./local-data";

export function downloadBackup() {
  const backup = createLocalBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `norma-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function hasBaseShape(candidate: Partial<LocalBackupV2 | LocalBackupV3 | LocalBackupV4>) {
  return (
    typeof candidate.exportedAt === "string" &&
    !!candidate.progress &&
    typeof candidate.progress === "object" &&
    Array.isArray(candidate.notes) &&
    !!candidate.caseAnswers &&
    typeof candidate.caseAnswers === "object" &&
    Array.isArray(candidate.testAttempts)
  );
}

function isBackup(value: unknown): value is LocalBackupV2 | LocalBackupV3 | LocalBackupV4 {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LocalBackupV2 | LocalBackupV3 | LocalBackupV4>;
  if (!hasBaseShape(candidate)) return false;
  if (candidate.version === 2) return true;
  if (candidate.version === 3) return Array.isArray(candidate.studyTasks) && Array.isArray(candidate.exams);
  return (
    candidate.version === 4 &&
    Array.isArray(candidate.studyTasks) &&
    Array.isArray(candidate.exams) &&
    !!candidate.observationAttempts &&
    typeof candidate.observationAttempts === "object" &&
    !!candidate.bookProgress &&
    typeof candidate.bookProgress === "object"
  );
}

export async function importBackup(file: File) {
  const parsed = JSON.parse(await file.text()) as unknown;
  if (!isBackup(parsed)) {
    throw new Error("Файл не похож на резервную копию проекта «Норма» версии 2, 3 или 4.");
  }
  restoreLocalBackup(parsed);
}

export function resetLocalData() {
  reset();
}
