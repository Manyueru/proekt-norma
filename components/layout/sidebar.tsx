"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";

export function Sidebar() {
  const pathname = usePathname();
  const { user, profile } = useAuth();

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:gap-5 border-r border-c bg-surface px-4 py-6 md:h-screen md:sticky md:top-0">
      <div className="px-2">
        <Link href="/" className="text-[15px] font-medium">
          Проект Норма
        </Link>
        <p className="mt-1 text-[11px] text-muted-c">Учебная платформа дефектолога</p>
      </div>

      <nav className="flex flex-col gap-1 overflow-y-auto pr-1">
        {NAV_ITEMS.map((item) => {
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
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent-blue/10 text-accent-blue"
                  : "text-muted-c hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 border-t border-c pt-4 px-2">
        <Link href={user ? "/account" : "/auth/login"} className="text-xs text-muted-c hover:text-accent-blue">
          {user ? profile?.displayName || user.email : "Войти для синхронизации"}
        </Link>
        <ThemeToggle />
      </div>
    </aside>
  );
}
