import type { ComponentType, ReactNode } from "react";

export interface ModelMetadata {
  slug: string;
  title: string;
  question: string;
  description: string;
  status: "live" | "coming-soon";
  order: number;
  category: string;
  duration?: string;
  steps?: number;
  lecture: string;
}
export interface ParameterDefinition<P> {
  key: keyof P;
  name: string;
  symbol: string;
  min: number | ((p: P) => number);
  max: number | ((p: P) => number);
  step: number;
  format: (n: number) => string;
}
export interface TeachingStep<C> {
  id: string;
  title: string;
  shortTitle: string;
  why: string;
  english: (context: C) => ReactNode;
  math: (context: C) => ReactNode;
  notice: string;
  algebra: (context: C) => ReactNode;
}
export interface PredictionQuestion<P> {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  why: string;
  before: P;
  after: P;
}
export interface Citation {
  id: string;
  title: string;
  detail: string;
  url?: string;
  kind: "lecture" | "paper" | "original";
}
export interface ModelModule {
  default: ComponentType;
}
