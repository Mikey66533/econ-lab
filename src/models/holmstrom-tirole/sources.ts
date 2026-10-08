import type { Citation } from "@/lib/model";
export const sources: Citation[] = [
  {
    id: "slides-2",
    title: "GU4710 · Slides 2: Leverage Constraints",
    kind: "lecture",
    detail:
      "Primary course source. Printed pp. 2–3: opening puzzle; pp. 4–5: setup and choices; p. 6: incentives and assumptions; pp. 7–8: solution and leverage; p. 9: three worlds; p. 11: investment evidence; p. 13: balance-sheet example. Printed page numbers differ from PDF positions. The privately supplied lecture PDF is not distributed here.",
  },
  {
    id: "slides-1",
    title: "GU4710 · Slides 1: Lending to Firms",
    kind: "lecture",
    detail:
      "Printed p. 3: in the perfect-financial-markets benchmark, optimal investment depends on productivity, not initial wealth. That model has decreasing returns and a financing cost; it differs from this constant-return teaching model. The privately supplied PDF is not distributed here.",
  },
  {
    id: "hurst",
    title: "Hurst & Lusardi (2004)",
    kind: "paper",
    detail:
      "Liquidity Constraints, Household Wealth, and Entrepreneurship. Journal of Political Economy 112(2), 319–347. The wealth–entry relationship is mostly flat, rising after the 95th percentile; the authors caution against interpreting it as general evidence of binding borrowing constraints.",
    url: "https://doi.org/10.1086/381478",
  },
  {
    id: "chaney",
    title: "Chaney, Sraer & Thesmar (2012)",
    kind: "paper",
    detail:
      "The Collateral Channel: How Real Estate Shocks Affect Corporate Investment. American Economic Review 102(6), 2381–2409. Table 10, column 1, and p. 2407: the 1.8 percentage-point estimate uses accumulated investment over 2000–2006 relative to initial assets. It is a reported empirical estimate, not a direct test of this exact hidden-action model.",
    url: "https://faculty.haas.berkeley.edu/dsraer/JobMarketPaper_sraer.pdf",
  },
  {
    id: "holmstrom",
    title: "Holmström & Tirole (1997)",
    kind: "paper",
    detail:
      "Financial Intermediation, Loanable Funds, and the Real Sector. Quarterly Journal of Economics 112(3), 663–691. Intellectual background; this lesson explains the simplified model taught in GU4710, not the full paper.",
    url: "https://doi.org/10.1162/003355397555316",
  },
  {
    id: "original",
    title: "What Econ Lab adds",
    kind: "original",
    detail:
      "The names “honesty premium” and “temptation per borrowed dollar”; the honesty-meter and per-dollar framing; the numerical R = 1.6 and B = 1.0 choices; the initial illustrative loan of $80,000; all original chart designs; the qualitative wealth schematic and perfect-market panel; the teaching narrative, algebra walkthroughs, assumption illustrations, prediction scenarios, slider ranges, and real-world analogies. “Skin in the game” and the $80k/$120k/$200k balance sheet already appear in the slides.",
  },
];
export const slidePagesToPdf: Record<string, Record<number, number>> = {
  "slides-1": { 1: 3, 2: 4, 3: 5 },
  "slides-2": {
    1: 2,
    2: 3,
    3: 4,
    4: 6,
    5: 7,
    6: 8,
    7: 9,
    8: 10,
    9: 11,
    10: 13,
    11: 14,
    12: 15,
    13: 17,
    14: 18,
    15: 19,
    16: 20,
    17: 21,
    18: 22,
  },
};
