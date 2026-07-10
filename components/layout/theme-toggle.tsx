"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  compact?: boolean;
  className?: string;
};

export function ThemeToggle({ compact = false, className }: ThemeToggleProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("norma:theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;

    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;

    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("norma:theme", next ? "dark" : "light");
  }

  const label = dark ? "Включить светлую тему" : "Включить тёмную тему";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        compact ? "h-9 w-9 justify-center p-0" : "w-full justify-start",
        className
      )}
    >
      {dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
      {!compact && (dark ? "Светлая тема" : "Тёмная тема")}
    </Button>
  );
}
