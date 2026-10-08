/** GU4710's deterministic, zero-interest teaching model; dollars, not cents.
 * Sources: Slides 2, printed pp. 4–8. Rearrangements are Econ Lab exposition.
 * These functions return numbers; rounding belongs in the UI.
 */
export interface Parameters {
  N: number;
  R: number;
  B: number;
  L: number;
}
export type BorrowingOutcome =
  | { kind: "finite"; maxLoan: number; leverage: number }
  | { kind: "unbounded" }
  | {
      kind: "no-loan";
      maxLoan: 0;
      leverage: 1;
      ownMoneyChoice: "indifferent" | "shirk";
    };
const EPSILON = 1e-10;
export const projectSize = (N: number, L: number) => N + L;
export const projectReturn = (N: number, R: number, L: number) =>
  R * projectSize(N, L);
export const behavePayoff = (N: number, R: number, L: number) =>
  R * projectSize(N, L) - L;
export const shirkPayoff = (N: number, B: number, L: number) =>
  B * projectSize(N, L);
export const honestyPremium = (R: number, B: number) => R - B;
export const totalHonestyPremium = (
  N: number,
  R: number,
  B: number,
  L: number,
) => honestyPremium(R, B) * projectSize(N, L);
export const skinInTheGame = (N: number, R: number, B: number) =>
  honestyPremium(R, B) * N;
export const temptationPerBorrowedDollar = (R: number, B: number) =>
  1 - honestyPremium(R, B);
export const borrowedMoneyTemptation = (R: number, B: number, L: number) =>
  temptationPerBorrowedDollar(R, B) * L;
export const incentiveMargin = (N: number, R: number, B: number, L: number) =>
  skinInTheGame(N, R, B) - borrowedMoneyTemptation(R, B, L);
export const behaves = (p: Parameters) =>
  incentiveMargin(p.N, p.R, p.B, p.L) >= -EPSILON * Math.max(1, p.N, p.L);
export function borrowingOutcome(
  N: number,
  R: number,
  B: number,
): BorrowingOutcome {
  if (![N, R, B].every(Number.isFinite) || N < 0 || R <= 1 || B < 0)
    throw new RangeError("This solved model requires N ≥ 0, R > 1, and B ≥ 0.");
  const premium = honestyPremium(R, B);
  if (premium <= EPSILON)
    return {
      kind: "no-loan",
      maxLoan: 0,
      leverage: 1,
      ownMoneyChoice: Math.abs(premium) <= EPSILON ? "indifferent" : "shirk",
    };
  if (1 - premium <= EPSILON) return { kind: "unbounded" };
  return {
    kind: "finite",
    maxLoan: (premium * N) / (1 - premium),
    leverage: 1 / (1 - premium),
  };
}
export function leverageAtLimit(
  N: number,
  R: number,
  B: number,
): number | null {
  const result = borrowingOutcome(N, R, B);
  return N === 0 || result.kind === "unbounded" ? null : result.leverage;
}
