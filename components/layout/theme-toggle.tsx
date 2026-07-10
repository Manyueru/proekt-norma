"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
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

  return (
    <Button variant="ghost" size="sm" onClick={toggle} className="w-full justify-start">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
      {dark ? "Светлая тема" : "Тёмная тема"}
    </Button>
  );
}
