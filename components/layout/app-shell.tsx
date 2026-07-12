"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, configured } = useAuth();

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-c bg-[rgb(var(--bg)/0.92)] px-4 backdrop-blur-xl md:hidden">
          <Link href="/" className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-[-0.02em]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-current/20 text-[10px]">Н</span>
            Норма
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href={user || !configured ? "/account" : "/auth/login"}
              className="rounded-lg px-2 py-2 text-xs text-muted-c transition-colors hover:text-[rgb(var(--fg))]"
            >
              {user || !configured ? "Кабинет" : "Войти"}
            </Link>
            <ThemeToggle compact />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1180px] px-4 py-7 pb-28 sm:px-7 md:px-12 md:py-12 md:pb-14 xl:px-16">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
