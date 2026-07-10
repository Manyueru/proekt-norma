"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";
import { usePersonalData } from "@/components/providers/personal-data-provider";

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { syncError, storageMode } = usePersonalData();

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-c bg-surface px-4 md:hidden">
          <Link href="/" className="text-sm font-medium">
            Проект Норма
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href={user ? "/account" : "/auth/login"}
              className="rounded-lg px-2 py-2 text-xs text-muted-c hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
            >
              {user ? "Кабинет" : "Войти"}
            </Link>
            <ThemeToggle compact />
          </div>
        </header>

        {(syncError || (!user && storageMode === "local")) && (
          <div className="border-b border-c bg-accent-violet/10 px-4 py-2 text-center text-xs text-muted-c md:px-8">
            {syncError || "Гостевой режим: данные сохраняются только в этом браузере. Войдите, чтобы синхронизировать их между устройствами."}
          </div>
        )}

        <main className="mx-auto w-full max-w-5xl px-4 py-6 pb-24 sm:px-6 md:px-10 md:py-10 md:pb-10">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
