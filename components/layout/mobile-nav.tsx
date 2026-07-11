"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { Menu, X } from "lucide-react";
import { MOBILE_PRIMARY_ITEMS, NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, profile, configured } = useAuth();

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 items-center border-t border-c bg-surface px-1 py-2 safe-bottom">
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
                "flex flex-col items-center gap-0.5 px-1 py-1 text-[10px]",
                active ? "text-accent-blue" : "text-muted-c"
              )}
            >
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex flex-col items-center gap-0.5 px-1 py-1 text-[10px] text-muted-c"
          aria-label="Открыть все разделы"
        >
          <Menu size={19} />
          Ещё
        </button>
      </nav>

      {open && (
        <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Все разделы">
          <button
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-y-auto rounded-t-2xl border-t border-c bg-surface p-5 pb-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Все разделы</p>
                <p className="text-xs text-muted-c mt-0.5">
                  {user ? profile?.displayName || user.email : configured ? "Гостевой режим" : "Локальный режим"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted-c hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                aria-label="Закрыть меню"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = Icons[item.icon] as Icons.LucideIcon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg border border-c px-3 py-3 text-sm hover:border-accent-blue/40"
                  >
                    <Icon size={17} className="text-accent-blue" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 border-t border-c pt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
