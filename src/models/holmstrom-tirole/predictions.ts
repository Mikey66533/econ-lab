import type { PredictionQuestion } from "@/lib/model";
import type { Parameters } from "./math";
import { DEFAULTS } from "./parameters";
export const predictions: PredictionQuestion<Parameters>[] = [
  {
    id: "benefit",
    prompt:
      "Shirking gets more tempting: B rises from $1.00 to $1.10. The maximum loan…",
    options: ["Falls", "Rises", "Stays the same"],
    answer: 0,
    why: "Each borrowed dollar tempts her more, and her own money provides less skin in the game.",
    before: DEFAULTS,
    after: { ...DEFAULTS, B: 1.1, L: 80000 },
  },
  {
    id: "return",
    prompt: "The project gets better: R rises from $1.60 to $1.70. Leverage…",
    options: ["Falls", "Rises", "Stays the same"],
    answer: 1,
    why: "The honesty premium grows: her skin in the game rises and temptation per borrowed dollar falls.",
    before: DEFAULTS,
    after: { ...DEFAULTS, R: 1.7, L: 80000 },
  },
  {
    id: "wealth",
    prompt:
      "Her net worth doubles. What happens to the maximum loan and leverage?",
    options: [
      "Both double",
      "The loan doubles; leverage stays the same",
      "Neither changes",
    ],
    answer: 1,
    why: "Twice the skin in the game supports twice the loan, but the same project-to-equity ratio.",
    before: DEFAULTS,
    after: { ...DEFAULTS, N: 160000, L: 80000 },
  },
  {
    id: "boundary",
    prompt: "What if B = R − 1 exactly?",
    options: [
      "No positive loan",
      "No finite borrowing limit",
      "The loan limit stays the same",
    ],
    answer: 1,
    why: "Borrowed dollars stop tempting her. The two payoff lines are parallel, so this constraint no longer caps borrowing.",
    before: DEFAULTS,
    after: { ...DEFAULTS, B: 0.6, L: 80000 },
  },
];
