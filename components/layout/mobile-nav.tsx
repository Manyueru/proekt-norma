"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { Menu, X } from "lucide-react";
import { MOBILE_PRIMARY_ITEMS, NAV_GROUPS } from "./nav-items";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, profile, configured } = useAuth();

  return (
    <>
      <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 items-center px-1 py-2 md:hidden safe-bottom">
        {MOBILE_PRIMARY_ITEMS.map((item) => {
          const Icon = Icons[item.icon] as Icons.LucideIcon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-1 py-1 text-[10px] font-medium transition-colors",
                active ? "text-accent-blue" : "text-muted-c"
              )}
            >
              <Icon size={18} strokeWidth={1.7} />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex flex-col items-center gap-1 px-1 py-1 text-[10px] font-medium text-muted-c"
          aria-label="Открыть все разделы"
        >
          <Menu size={18} strokeWidth={1.7} />
          Ещё
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Все разделы">
          <button
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-y-auto rounded-t-[28px] border-t border-c bg-surface px-5 pb-9 pt-4 shadow-2xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-black/10 dark:bg-white/15" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold tracking-[-0.02em]">Разделы</p>
                <p className="mt-1 text-xs text-muted-c">
                  {user ? profile?.displayName || user.email : configured ? "Гостевой режим" : "Локальный кабинет"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-c p-2 text-muted-c transition-colors hover:text-[rgb(var(--fg))]"
                aria-label="Закрыть меню"
              >
                <X size={18} strokeWidth={1.7} />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.label ?? "main"}>
                  {group.label && (
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-c">
                      {group.label}
                    </p>
                  )}
                  <div className="divide-y divide-[rgb(var(--border-c))] border-y border-c">
                    {group.items.map((item) => {
                      const Icon = Icons[item.icon] as Icons.LucideIcon;
                      const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center justify-between py-3.5 text-sm transition-colors",
                            active ? "font-semibold text-accent-blue" : "text-[rgb(var(--fg))]"
                          )}
                        >
                          <span>{item.label}</span>
                          <Icon size={16} strokeWidth={1.6} className={active ? "text-accent-blue" : "text-muted-c"} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-c pt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
