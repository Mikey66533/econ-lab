"use client";
import { SourceTag } from "@/components/Math";
const assumptions = [
  {
    name: "She puts her own money into the project",
    baseline: "Her capital is at stake",
    alternative: "No own money invested",
    detail:
      "If she contributed no own money, she would have no skin in the game. In the usual parameter range, no positive loan would satisfy the incentive constraint. Actual leverage at zero equity is undefined.",
    page: 6,
    kind: "equity",
  },
  {
    name: "She behaves when the two choices tie",
    baseline: "Tie: bank lends",
    alternative: "Tie: she shirks",
    detail:
      "The lecture uses a weak inequality: behaving is enough when both payoffs are equal. If she chose shirking at a tie, the bank would lend just below the crossing. The crossing would be an upper bound rather than an attained maximum.",
    page: 6,
    kind: "tie",
  },

  {
    name: "The bank cannot watch her action",
    baseline: "Hidden action",
    alternative: "Action observable",
    detail:
      "If the bank could observe and enforce behaving, this hidden-action constraint would disappear. Other financing limits could still exist.",
    page: 5,
    kind: "observe",
  },
  {
    name: "The bank charges zero interest",
    baseline: "Repay $1 per $1",
    alternative: "Repay more than $1",
    detail:
      "Positive interest raises what she must repay per borrowed dollar. With the same behavior and returns, avoiding repayment becomes more tempting.",
    page: 4,
    kind: "interest",
  },
  {
    name: "She has limited liability",
    baseline: "Failure: bank gets $0",
    alternative: "Other assets at risk",
    detail:
      "With enforceable recourse to additional personal assets, failure could cost her more. That would change the payoffs and might strengthen incentives to behave; it is outside this contract.",
    page: 4,
    kind: "liability",
  },
  {
    name: "Behavior determines success",
    baseline: "Behave → success",
    alternative: "Behave → possible failure",
    detail:
      "If even a well-run project could fail, we would compare expected payoffs. A default would no longer tell us that she shirked.",
    page: 5,
    kind: "risk",
  },
  {
    name: "Each invested dollar has the same return and benefit",
    baseline: "Straight lines",
    alternative: "Curved payoffs",
    detail:
      "With diminishing returns or a private benefit that does not scale with the project, payoffs need not be straight lines. The simple constant leverage formula would need to be re-derived.",
    page: 4,
    kind: "linear",
  },
  {
    name: "The project returns more than $1 per dollar",
    baseline: "More borrowing pays",
    alternative: "R ≤ 1: no extra gain",
    detail:
      "If returns were at most $1, an extra borrowed dollar would add no positive payoff after repayment. The borrower would no longer strictly want the largest feasible loan.",
    page: 4,
    kind: "return",
  },
];
export function Assumptions() {
  return (
    <section className="assumption-list">
      <h3>A small world, on purpose.</h3>
      <p className="small muted">
        Each simplification does a job. Open one to see what changes without it.
        These are conceptual illustrations, not additional solved models.
      </p>
      {assumptions.map((a) => (
        <details key={a.kind}>
          <summary>
            {a.name}
            <span>What if? +</span>
          </summary>
          <div className="assumption-content">
            <svg
              viewBox="0 0 380 76"
              role="img"
              aria-label={`${a.baseline} changes to ${a.alternative}`}
            >
              <rect x="0" y="9" width="157" height="54" rx="3" fill="#e8eee7" />
              <rect
                x="216"
                y="9"
                width="164"
                height="54"
                rx="3"
                fill="#eee7f1"
              />
              <text x="78" y="40" textAnchor="middle" className="svg-label">
                {a.baseline}
              </text>
              <path d="M174 36h24m-6-5 6 5-6 5" fill="none" stroke="#8b659d" />
              <text x="298" y="40" textAnchor="middle" className="svg-label">
                {a.alternative}
              </text>
            </svg>
            {a.kind === "linear" && (
              <svg
                viewBox="0 0 380 72"
                role="img"
                aria-label="A straight increasing payoff becomes a curved increasing payoff"
              >
                <path
                  d="M20 61L137 10M234 61Q245 12 361 10"
                  stroke="#34715b"
                  fill="none"
                  strokeWidth="2"
                />
              </svg>
            )}
            <p>{a.detail}</p>
            <SourceTag page={a.page} />
            <SourceTag id="original" label="Our counterfactual" />
          </div>
        </details>
      ))}
    </section>
  );
}
