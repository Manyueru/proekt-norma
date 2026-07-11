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
  explanation?: string;
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

export interface UserProfile {
  id: string;
  displayName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicProgressRecord {
  topicId: string;
  status: TopicStatus;
  startedAt?: string;
  lastOpenedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export type NoteMode = "quick" | "study";

export interface Note {
  id: string;
  mode: NoteMode;
  title: string;
  topicSlug?: string;
  sourceId?: string;
  body: string;
  mainIdea: string;
  keyFacts: string;
  unclearQuestions: string;
  contradictions: string;
  practicalValue: string;
  reviewQuestion: string;
  reviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClinicalCaseAnswerStatus = "draft" | "solved" | "review";

export interface ClinicalCaseAnswer {
  caseId: string;
  answerText: string;
  analysisRevealed: boolean;
  status: ClinicalCaseAnswerStatus;
  reviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestAttempt {
  id: string;
  quizId: string;
  topicSlug: string;
  answers: Record<string, number>;
  score: number;
  total: number;
  completedAt: string;
}

export type StudyTaskStatus = "not-started" | "in-progress" | "waiting" | "completed";
export type StudyTaskPriority = "low" | "normal" | "high";
export type StudyTaskType =
  | "essay"
  | "report"
  | "presentation"
  | "test"
  | "practice"
  | "exam-prep"
  | "reading"
  | "other";

export const STUDY_TASK_STATUS_LABELS: Record<StudyTaskStatus, string> = {
  "not-started": "Не начато",
  "in-progress": "В работе",
  waiting: "Жду проверки",
  completed: "Выполнено"
};

export const STUDY_TASK_PRIORITY_LABELS: Record<StudyTaskPriority, string> = {
  low: "Низкий",
  normal: "Обычный",
  high: "Высокий"
};

export const STUDY_TASK_TYPE_LABELS: Record<StudyTaskType, string> = {
  essay: "Реферат",
  report: "Доклад",
  presentation: "Презентация",
  test: "Контрольная",
  practice: "Практическая работа",
  "exam-prep": "Подготовка к экзамену",
  reading: "Чтение",
  other: "Другое"
};

export interface StudyTaskSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  discipline: string;
  teacher: string;
  type: StudyTaskType;
  dueAt: string;
  priority: StudyTaskPriority;
  status: StudyTaskStatus;
  examId?: string;
  topicSlugs: string[];
  subtasks: StudyTaskSubtask[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type ExamFormat = "oral" | "written" | "test" | "mixed";
export type ExamQuestionStatus =
  | "not-started"
  | "read"
  | "understand"
  | "with-prompt"
  | "independent"
  | "review"
  | "mastered";

export const EXAM_FORMAT_LABELS: Record<ExamFormat, string> = {
  oral: "Устный",
  written: "Письменный",
  test: "Тест",
  mixed: "Смешанный"
};

export const EXAM_QUESTION_STATUS_LABELS: Record<ExamQuestionStatus, string> = {
  "not-started": "Не начато",
  read: "Прочитано",
  understand: "Понимаю",
  "with-prompt": "Отвечаю с подсказкой",
  independent: "Отвечаю самостоятельно",
  review: "Нужно повторить",
  mastered: "Освоено"
};

export interface ExamQuestion {
  id: string;
  title: string;
  shortAnswer: string;
  fullAnswer: string;
  outline: string;
  keyTerms: string;
  commonMistakes: string;
  teacherQuestions: string;
  status: ExamQuestionStatus;
  lastReviewedAt?: string;
  reviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  title: string;
  discipline: string;
  teacher: string;
  date: string;
  format: ExamFormat;
  questionsPerTicket: number;
  notes: string;
  questions: ExamQuestion[];
  createdAt: string;
  updatedAt: string;
}
