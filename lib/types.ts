export type TopicStatus =
  | "not-started"
  | "exploring"
  | "learning"
  | "needs-practice"
  | "review"
  | "mastered";

export const TOPIC_STATUS_LABELS: Record<TopicStatus, string> = {
  "not-started": "Не начато",
  exploring: "Знакомлюсь",
  learning: "Изучаю",
  "needs-practice": "Нужна практика",
  review: "Повторить",
  mastered: "Освоено"
};

export type Track =
  | "child-development"
  | "speech-ontogenesis"
  | "speech-therapy"
  | "neuropsychology"
  | "special-pedagogy"
  | "clinical-basics";

export const TRACK_LABELS: Record<Track, string> = {
  "child-development": "Нормальное развитие ребёнка",
  "speech-ontogenesis": "Онтогенез речи",
  "speech-therapy": "Логопедия",
  neuropsychology: "Нейропсихология",
  "special-pedagogy": "Специальная педагогика",
  "clinical-basics": "Клинические основы"
};

export interface MiniTestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Topic {
  slug: string;
  track: Track;
  title: string;
  summary: string;
  updatedAt: string;
  goals: string[];
  keyConcepts: string[];
  theory: string;
  practicalSigns: string;
  norm: string;
  redFlags: string;
  limitations: string;
  differentialQuestions: string[];
  videoIds: string[];
  sourceIds: string[];
  caseSlugs: string[];
  miniTest: MiniTestQuestion[];
}

export type ReliabilityLevel = "A" | "B" | "C" | "D";

export const RELIABILITY_LABELS: Record<ReliabilityLevel, string> = {
  A: "Официальные рекомендации, систематические обзоры",
  B: "Современные учебники, рецензируемые статьи",
  C: "Классические и исторические материалы",
  D: "Блоги и материалы без доказательной базы"
};

export interface Source {
  id: string;
  title: string;
  author: string;
  organization?: string;
  year: number;
  type: string;
  language: string;
  url?: string;
  summary: string;
  topicSlugs: string[];
  reliability: ReliabilityLevel;
  checkedAt: string;
  isCurrent: boolean;
  studyStatus: "not-started" | "in-progress" | "done";
  minAge?: number;
  maxAge?: number;
}

export interface ObservationCard {
  slug: string;
  title: string;
  ageRange: string;
  context: string;
  canBeNormalVariant: boolean;
  possibleExplanations: string[];
  whatToCheck: string[];
  redFlags: string[];
  specialists: string[];
  topicSlugs: string[];
  sourceIds: string[];
}

export interface ClinicalCase {
  slug: string;
  title: string;
  age: string;
  reason: string;
  history: string;
  skills: string;
  difficulties: string;
  speech: string;
  communication: string;
  play: string;
  motor: string;
  hearingVision: string;
  behavior: string;
  questions: string[];
  analysis: string;
  topicSlugs: string[];
  sourceIds: string[];
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  shortDefinition: string;
  simpleExplanation: string;
  example: string;
  status: string;
  synonyms: string[];
  relatedTerms: string[];
  differences: string;
  ruTerm: string;
  intlTerm: string;
  sourceIds: string[];
}

export interface Video {
  id: string;
  title: string;
  source: string;
  url?: string;
  ageRange: string;
  topicSlugs: string[];
  durationMinutes: number;
  language: string;
  subtitles: boolean;
  whatToObserve: string;
  timecodes: string[];
  summary: string;
  limitations: string;
}

export interface Note {
  id: string;
  title: string;
  date: string;
  topicSlug?: string;
  mainIdea: string;
  newFacts: string;
  unclear: string;
  toCheck: string;
  example: string;
  reviewQuestion: string;
  nextReviewDate?: string;
}
