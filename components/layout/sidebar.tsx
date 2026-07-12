"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "./nav-items";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";

export function Sidebar() {
  const pathname = usePathname();
  const { user, profile, configured } = useAuth();

  return (
    <aside className="sidebar-shell hidden md:sticky md:top-0 md:flex md:h-screen md:w-[248px] md:flex-col">
      <div className="px-7 pb-8 pt-8">
        <Link href="/" className="inline-flex items-center gap-3 text-[17px] font-semibold tracking-[-0.02em] text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-xs font-semibold">Н</span>
          <span>Норма</span>
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-5">
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.label ?? "main"} className={cn(groupIndex > 0 && "pt-1")}>
            {group.label && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                      active
                        ? "bg-white/[0.09] text-white"
                        : "text-white/58 hover:bg-white/[0.05] hover:text-white/88"
                    )}
                  >
                    <span className={cn("mr-3 h-1.5 w-1.5 rounded-full transition-colors", active ? "bg-accent-blue" : "bg-white/20 group-hover:bg-white/45")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-5">
        <Link
          href={user || !configured ? "/account" : "/auth/login"}
          className="block truncate px-2 text-xs text-white/50 transition-colors hover:text-white/80"
        >
          {user ? profile?.displayName || user.email : configured ? "Войти для синхронизации" : "Локальный кабинет"}
        </Link>
        <ThemeToggle className="mt-2 text-white/55 hover:bg-white/[0.06] hover:text-white/90" />
      </div>
    </aside>
  );
}
