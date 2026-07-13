import topicsData from "@/data/topics.json";
import modulesData from "@/data/modules.json";
import sourcesData from "@/data/sources.json";
import observationsData from "@/data/observations.json";
import casesData from "@/data/cases.json";
import glossaryData from "@/data/glossary.json";
import videosData from "@/data/videos.json";
import booksData from "@/data/books.json";
import methodsData from "@/data/methods.json";
import {
  ClinicalCase,
  InterventionMethod,
  LearningModule,
  GlossaryTerm,
  ObservationCard,
  Source,
  StudyBook,
  Topic,
  Video
} from "./types";

export const topics = topicsData as Topic[];
export const modules = modulesData as LearningModule[];
export const sources = sourcesData as Source[];
export const observations = observationsData as ObservationCard[];
export const cases = casesData as ClinicalCase[];
export const glossary = glossaryData as GlossaryTerm[];
export const videos = videosData as Video[];
export const books = booksData as StudyBook[];
export const methods = methodsData as InterventionMethod[];

export function getModule(id: string): LearningModule | undefined {
  return modules.find((module) => module.id === id);
}

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}

export function getSourcesByIds(ids: string[]): Source[] {
  return sources.filter((s) => ids.includes(s.id));
}

export function getObservation(slug: string): ObservationCard | undefined {
  return observations.find((o) => o.slug === slug);
}

export function getCase(slug: string): ClinicalCase | undefined {
  return cases.find((c) => c.slug === slug);
}

export function getCasesBySlugs(slugs: string[]): ClinicalCase[] {
  return cases.filter((c) => slugs.includes(c.slug));
}

export function getTopicsBySlugs(slugs: string[]): Topic[] {
  return topics.filter((t) => slugs.includes(t.slug));
}

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossary.find((g) => g.slug === slug);
}

export function getBook(id: string): StudyBook | undefined {
  return books.find((book) => book.id === id);
}

export function getMethod(id: string): InterventionMethod | undefined {
  return methods.find((method) => method.id === id);
}
