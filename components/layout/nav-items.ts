export type NavIconName =
  | "Home"
  | "BookOpen"
  | "Eye"
  | "ClipboardList"
  | "GraduationCap"
  | "CalendarClock"
  | "NotebookText"
  | "FileText"
  | "Video"
  | "SpellCheck"
  | "UserRound"
  | "Search"
  | "Map"
  | "BookMarked"
  | "ListChecks"
  | "Microscope";

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconName;
};

type NavGroup = {
  label: string | null;
  items: readonly NavItem[];
};

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: null,
    items: [{ href: "/", label: "Главная", icon: "Home" }]
  },
  {
    label: "Обучение",
    items: [
      { href: "/modules", label: "Модули", icon: "BookOpen" },
      { href: "/competencies", label: "Карта знаний", icon: "Map" },
      { href: "/observations", label: "Насмотренность", icon: "Eye" },
      { href: "/cases", label: "Клинические задачи", icon: "ClipboardList" }
    ]
  },
  {
    label: "Организация",
    items: [
      { href: "/exams", label: "Экзамены", icon: "GraduationCap" },
      { href: "/study-tasks", label: "Дедлайны", icon: "CalendarClock" },
      { href: "/notes", label: "Конспекты", icon: "NotebookText" }
    ]
  },
  {
    label: "Библиотека",
    items: [
      { href: "/books", label: "Книги", icon: "BookMarked" },
      { href: "/methods", label: "Методики", icon: "ListChecks" },
      { href: "/research", label: "Новые исследования", icon: "Microscope" },
      { href: "/sources", label: "Источники", icon: "FileText" },
      { href: "/videos", label: "Видеотека", icon: "Video" },
      { href: "/glossary", label: "Словарь", icon: "SpellCheck" }
    ]
  },
  {
    label: "Личное",
    items: [
      { href: "/account", label: "Кабинет", icon: "UserRound" },
      { href: "/search", label: "Поиск", icon: "Search" }
    ]
  }
];

export const NAV_ITEMS: readonly NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

export const MOBILE_PRIMARY_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Главная", icon: "Home" },
  { href: "/modules", label: "Модули", icon: "BookOpen" },
  { href: "/study-tasks", label: "Дедлайны", icon: "CalendarClock" },
  { href: "/account", label: "Кабинет", icon: "UserRound" }
];
