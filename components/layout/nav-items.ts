export const NAV_ITEMS = [
  { href: "/", label: "Главная", icon: "Home" },
  { href: "/modules", label: "Модули", icon: "BookOpen" },
  { href: "/observations", label: "Насмотренность", icon: "Eye" },
  { href: "/cases", label: "Задачи", icon: "ClipboardList" },
  { href: "/sources", label: "Источники", icon: "FileText" },
  { href: "/videos", label: "Видеотека", icon: "Video" },
  { href: "/glossary", label: "Словарь", icon: "SpellCheck" },
  { href: "/notes", label: "Конспекты", icon: "NotebookText" }
] as const;

export const MOBILE_NAV_ITEMS = [
  { href: "/", label: "Главная", icon: "Home" },
  { href: "/modules", label: "Модули", icon: "BookOpen" },
  { href: "/search", label: "Поиск", icon: "Search" },
  { href: "/notes", label: "Конспекты", icon: "NotebookText" }
] as const;
