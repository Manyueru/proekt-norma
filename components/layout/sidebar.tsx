"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:gap-6 border-r border-c bg-surface px-4 py-6 md:h-screen md:sticky md:top-0">
      <Link href="/" className="px-2 text-[15px] font-medium">
        Проект Норма
      </Link>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = Icons[item.icon] as Icons.LucideIcon;
          const active = pathname === item.href;
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
      <div className="mt-auto px-2">
        <ThemeToggle />
      </div>
    </aside>
  );
}
