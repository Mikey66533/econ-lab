import type { Parameters } from "./math";
import type { ParameterDefinition } from "@/lib/model";
export const DEFAULTS: Parameters = { N: 80000, R: 1.6, B: 1, L: 80000 };
export const money = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
export const compactMoney = (v: number) =>
  Math.abs(v) >= 1e6
    ? `$${+(v / 1e6).toFixed(1)}m`
    : Math.abs(v) >= 1000
      ? `$${+(v / 1000).toFixed(1)}k`
      : money(v);
export const decimal = (v: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(v);
export const parameters: ParameterDefinition<Parameters>[] = [
  {
    key: "N",
    name: "Her own money",
    symbol: "N",
    min: 10000,
    max: 500000,
    step: 1000,
    format: money,
  },
  {
    key: "R",
    name: "Project return per dollar",
    symbol: "R",
    min: 1.05,
    max: 2,
    step: 0.01,
    format: (v) => `$${v.toFixed(2)}`,
  },
  {
    key: "B",
    name: "Private benefit per dollar",
    symbol: "B",
    min: (p) => +(p.R - 1).toFixed(2),
    max: (p) => p.R,
    step: 0.01,
    format: (v) => `$${v.toFixed(2)}`,
  },
];
export function normalizeParameters(raw: Partial<Parameters>): Parameters {
  const value = (key: keyof Parameters) =>
    Number.isFinite(raw[key]) ? raw[key]! : DEFAULTS[key];
  const R = Math.max(1.05, Math.min(2, Math.round(value("R") * 100) / 100));
  return {
    N: Math.max(10000, Math.min(500000, Math.round(value("N") / 1000) * 1000)),
    R,
    B: Math.max(R - 1, Math.min(R, Math.round(value("B") * 100) / 100)),
    L: Math.max(0, Math.min(1e9, value("L"))),
  };
}
