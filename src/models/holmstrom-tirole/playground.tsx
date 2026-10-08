"use client";
import { useContext } from "react";
import { HighlightContext } from "@/components/Math";
import { parameters, money } from "./parameters";
import { borrowingOutcome, type Parameters } from "./math";
import { plotExtent } from "./Charts";
export function LoanControl({
  p,
  onChange,
  onStart,
  onEnd,
  max,
}: {
  p: Parameters;
  onChange: (value: number) => void;
  onStart: () => void;
  onEnd: () => void;
  max?: number;
}) {
  const { set } = useContext(HighlightContext);
  const result = borrowingOutcome(p.N, p.R, p.B);
  const end = max ?? plotExtent(p);
  return (
    <div className="loan-control">
      <label htmlFor="loan-slider">
        <span>
          Explore a loan <span className="symbol-label">L</span>
        </span>
        <output>{money(p.L)}</output>
      </label>
      <input
        id="loan-slider"
        type="range"
        min={0}
        max={Math.ceil(end / 100) * 100}
        step={100}
        value={Math.min(p.L, end)}
        onFocus={() => set("loan")}
        onBlur={() => {
          set(null);
          onEnd();
        }}
        onPointerDown={onStart}
        onPointerUp={onEnd}
        onPointerCancel={onEnd}
        onKeyDown={(e) => {
          if (
            [
              "ArrowLeft",
              "ArrowRight",
              "Home",
              "End",
              "PageUp",
              "PageDown",
            ].includes(e.key)
          )
            onStart();
        }}
        onKeyUp={onEnd}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={money(p.L)}
        style={
          {
            "--range-progress": `${Math.min(p.L / end, 1) * 100}%`,
          } as React.CSSProperties
        }
      />
      <div className="slider-bounds">
        <span>$0</span>
        {result.kind === "finite" && (
          <button
            type="button"
            onClick={() => {
              onStart();
              onChange(result.maxLoan);
              onEnd();
            }}
          >
            Jump to L* · {money(result.maxLoan)}
          </button>
        )}
        <span>{money(end)}</span>
      </div>
    </div>
  );
}
export function Playground({
  p,
  onChange,
  onStart,
  onEnd,
  onReset,
  note,
}: {
  p: Parameters;
  onChange: (key: keyof Parameters, value: number) => void;
  onStart: () => void;
  onEnd: () => void;
  onReset: () => void;
  note: string;
}) {
  const result = borrowingOutcome(p.N, p.R, p.B);
  return (
    <section className="playground">
      <div className="chart-topline">
        <span className="eyebrow">YOUR TURN · CHANGE THE WORLD</span>
        <button type="button" className="text-button" onClick={onReset}>
          Reset ↺
        </button>
      </div>
      {parameters.map((def) => {
        const min = typeof def.min === "function" ? def.min(p) : def.min,
          max = typeof def.max === "function" ? def.max(p) : def.max;
        return (
          <div className="parameter-control" key={def.key}>
            <label htmlFor={`parameter-${def.key}`}>
              <span>
                {def.name} <span className="symbol-label">{def.symbol}</span>
              </span>
              <output>{def.format(p[def.key])}</output>
            </label>
            <input
              id={`parameter-${def.key}`}
              type="range"
              min={min}
              max={max}
              step={def.step}
              value={p[def.key]}
              onPointerDown={onStart}
              onPointerUp={onEnd}
              onPointerCancel={onEnd}
              onKeyDown={(e) => {
                if (
                  [
                    "ArrowLeft",
                    "ArrowRight",
                    "Home",
                    "End",
                    "PageUp",
                    "PageDown",
                  ].includes(e.key)
                )
                  onStart();
              }}
              onKeyUp={onEnd}
              onChange={(e) => onChange(def.key, Number(e.target.value))}
              aria-valuetext={def.format(p[def.key])}
              style={
                {
                  "--range-progress": `${((p[def.key] - min) / (max - min)) * 100}%`,
                } as React.CSSProperties
              }
            />
            <div className="slider-bounds">
              <span>{def.format(min)}</span>
              <span>{def.format(max)}</span>
            </div>
          </div>
        );
      })}
      <p className="parameter-note" role="status">
        {note ||
          "B stays between R − 1 and R. Changing R may move B to keep it in range."}
      </p>
      {result.kind !== "finite" && (
        <p className="boundary-note">
          {result.kind === "unbounded"
            ? "At B = R − 1, borrowed dollars add no temptation. There is no finite borrowing limit."
            : "At B = R, her own money gives no honesty premium. Any positive loan makes shirking strictly better."}
        </p>
      )}
    </section>
  );
}
