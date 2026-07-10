"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { MOBILE_NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-c bg-surface py-2">
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = Icons[item.icon] as Icons.LucideIcon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-[11px]",
              active ? "text-accent-blue" : "text-muted-c"
            )}
          >
            <Icon size={19} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
