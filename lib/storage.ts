"use client";

import {
  createLocalBackup,
  restoreLocalBackup,
  resetLocalData as reset,
  type LocalBackupV2,
  type LocalBackupV3
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

function hasBaseShape(candidate: Partial<LocalBackupV2 | LocalBackupV3>) {
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

function isBackup(value: unknown): value is LocalBackupV2 | LocalBackupV3 {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LocalBackupV2 | LocalBackupV3>;
  if (!hasBaseShape(candidate)) return false;
  if (candidate.version === 2) return true;
  return candidate.version === 3 && Array.isArray(candidate.studyTasks) && Array.isArray(candidate.exams);
}

export async function importBackup(file: File) {
  const parsed = JSON.parse(await file.text()) as unknown;
  if (!isBackup(parsed)) {
    throw new Error("Файл не похож на резервную копию проекта «Норма» версии 2 или 3.");
  }
  restoreLocalBackup(parsed);
}

export function resetLocalData() {
  reset();
}
