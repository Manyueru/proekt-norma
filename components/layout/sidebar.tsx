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

  const accountHref = user || !configured ? "/account" : "/auth/login";
  const accountLabel = user
    ? profile?.displayName || "Кабинет"
    : configured
      ? "Войти"
      : "Кабинет";

  return (
    <aside className="sidebar-shell hidden md:sticky md:top-0 md:flex md:h-screen md:w-[276px] md:flex-col">
      <div className="px-8 pb-10 pt-9">
        <Link
          href="/"
          className="inline-flex text-[19px] font-semibold tracking-[-0.035em] text-white transition-opacity hover:opacity-80"
        >
          Норма
        </Link>
      </div>

      <nav className="sidebar-scroll flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-5 pb-6">
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.label ?? "main"} className={cn(groupIndex > 0 && "pt-0.5")}>
            {group.label && (
              <p className="mb-2.5 px-3 text-[11px] font-medium uppercase tracking-[0.11em] text-white/45">
                {group.label}
              </p>
            )}

            <div className="flex flex-col gap-0.5">
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
                      "relative flex min-h-10 items-center rounded-md py-2.5 pl-5 pr-3 text-[14px] font-medium transition-colors",
                      active
                        ? "bg-white/[0.035] text-white"
                        : "text-white/58 hover:bg-white/[0.025] hover:text-white/88"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute bottom-2.5 left-0 top-2.5 w-[2px] rounded-full bg-[rgb(var(--accent))] transition-opacity",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-7 py-6">
        <Link
          href={accountHref}
          className="block truncate text-[13px] font-medium text-white/60 transition-colors hover:text-white/90"
        >
          {accountLabel}
        </Link>
        <ThemeToggle className="mt-3 text-white/55 hover:bg-white/[0.04] hover:text-white/90" />
      </div>
    </aside>
  );
}
