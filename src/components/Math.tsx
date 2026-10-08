"use client";
import katex from "katex";
import { createContext, useContext, useMemo, type ReactNode } from "react";
export type Highlight =
  "behave" | "shirk" | "skin" | "temptation" | "loan" | "premium" | null;
export const HighlightContext = createContext<{
  active: Highlight;
  set: (h: Highlight) => void;
}>({ active: null, set: () => {} });
export function MathText({
  tex,
  display = false,
}: {
  tex: string;
  display?: boolean;
}) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        trust: false,
        output: "htmlAndMathml",
      }),
    [tex, display],
  );
  return (
    <span
      className={display ? "math-display" : "math-inline"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
export function Term({
  id,
  tex,
  children,
}: {
  id: Exclude<Highlight, null>;
  tex?: string;
  children?: ReactNode;
}) {
  const { active, set } = useContext(HighlightContext);
  return (
    <button
      type="button"
      className={`math-term term-${id} ${active === id ? "term-active" : ""}`}
      aria-label={`Highlight ${id} in the diagram`}
      onPointerEnter={() => set(id)}
      onPointerLeave={() => set(null)}
      onFocus={() => set(id)}
      onBlur={() => set(null)}
      onClick={() => set(active === id ? null : id)}
    >
      {tex ? <MathText tex={tex} /> : children}
    </button>
  );
}
export function SourceTag({
  page,
  deck = 2,
  derived = false,
  id,
  label,
}: {
  page?: number;
  deck?: 1 | 2;
  derived?: boolean;
  id?: string;
  label?: string;
}) {
  const target = id ?? `slides-${deck}`;
  return (
    <a className="source-tag" href={`#source-${target}`}>
      {label ??
        `${derived ? "From " : ""}Slides ${deck}${page ? `, p. ${page}` : ""}`}{" "}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
