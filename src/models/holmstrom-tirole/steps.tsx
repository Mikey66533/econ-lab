import { MathText, SourceTag, Term } from "@/components/Math";
import type { TeachingStep } from "@/lib/model";
import { privateBenefitExample, realWorldExamples } from "./examples";
import { money, decimal } from "./parameters";
import {
  behavePayoff,
  shirkPayoff,
  honestyPremium,
  skinInTheGame,
  temptationPerBorrowedDollar,
  borrowingOutcome,
  type Parameters,
} from "./math";
export interface LessonContext {
  p: Parameters;
}
function Equation({
  children,
  live,
  page = 6,
  derived = false,
}: {
  children: React.ReactNode;
  live?: React.ReactNode;
  page?: number;
  derived?: boolean;
}) {
  return (
    <div className="equation-box">
      <div className="equation-symbols">{children}</div>
      {live && <div className="equation-live">{live}</div>}
      <SourceTag page={page} derived={derived} />
    </div>
  );
}
function Careful({ children }: { children: React.ReactNode }) {
  return (
    <aside className="careful">
      <strong>Careful:</strong> {children}
    </aside>
  );
}
export const steps: TeachingStep<LessonContext>[] = [
  {
    id: "puzzle",
    title: "Why can't a good idea just get funded?",
    shortTitle: "The puzzle",
    why: "We need a question worth building a model to answer.",
    english: () => (
      <>
        <p>
          Imagine two people with the same brilliant idea. One has savings. The
          other doesn’t. Should that change how much a bank is willing to lend?
        </p>
        <p>
          In the perfect-financial-markets world, only the idea determines the
          project’s size. <SourceTag deck={1} page={3} />
        </p>
        <p>
          The lecture observes that wealthy people are more likely to be
          entrepreneurs. But the evidence is subtler: Hurst and Lusardi find the
          relationship is mostly flat, rising mainly at the very top of the
          wealth distribution. They argue borrowing constraints matter less than
          is often assumed. <SourceTag page={2} />{" "}
          <SourceTag id="hurst" label="Hurst & Lusardi (2004)" />
        </p>
        <p className="key-sentence">
          So why <em>could</em> wealth matter? One answer: the bank can’t watch
          what you do with its money. <SourceTag page={3} />
        </p>
      </>
    ),
    math: () => (
      <Equation page={9}>
        <MathText tex="\text{Project size depends on: idea + wealth}" />
      </Equation>
    ),
    notice:
      "Look at how much of the wealth distribution is flat. This motivates a question; it does not identify the cause.",
    algebra: () => (
      <>
        <p>
          There is nothing to derive yet. We are separating a theoretical
          mechanism from an empirical claim.
        </p>
        <p>
          The three-world comparison is the lecture’s organizing idea. This
          lesson isolates one possible friction: an action the lender cannot
          observe. <SourceTag page={3} />
        </p>
      </>
    ),
  },
  {
    id: "setup",
    title: "One project. Two sources of money.",
    shortTitle: "The setup",
    why: "Build the simplest world where the bank cannot watch the borrower.",
    english: () => (
      <>
        <p>
          Her own money is <strong>net worth</strong>, written{" "}
          <MathText tex="N" />. The bank’s money is a <strong>loan</strong>,
          written <MathText tex="L" />. Together, they pay for the project.{" "}
          <SourceTag page={4} />
        </p>
        <p>
          The <strong>project return per dollar</strong> is <MathText tex="R" />
          , greater than $1. Behave, and the project always succeeds. Shirk, and
          it fails—but she receives a{" "}
          <strong>private benefit per dollar</strong>, written{" "}
          <MathText tex="B" />. <SourceTag page={5} />
        </p>
        <p>
          For example, that benefit could be {privateBenefitExample}.{" "}
          <SourceTag id="original" label="Our example" />
        </p>
        <Careful>
          The bank charges zero interest here. The limit we find is about
          incentives, even when the loan itself is free. <SourceTag page={4} />
        </Careful>
      </>
    ),
    math: ({ p }) => (
      <Equation
        page={4}
        live={`${money(p.N)} + ${money(p.L)} = ${money(p.N + p.L)}`}
      >
        <MathText tex="\text{Investment}=N+L" />
      </Equation>
    ),
    notice:
      "Her dollars and the bank’s dollars buy the same project. Keep their origins in mind: repayment changes their incentives.",
    algebra: () => (
      <>
        <p>
          This is a one-period, constant-return model. Every dollar invested
          produces the same return if she behaves, and the same private benefit
          if she shirks. There is no interest or uncertainty conditional on her
          action. <SourceTag page={4} /> <SourceTag page={5} />
        </p>
      </>
    ),
  },
  {
    id: "choices",
    title: "Two choices. Different consequences.",
    shortTitle: "Two choices",
    why: "See why shirking can be tempting even when it destroys the project.",
    english: () => (
      <>
        <p>
          If she behaves, the project returns money and she repays the loan. She
          keeps what is left. If she shirks, the project returns nothing and the
          bank gets nothing. She still receives the private benefit.{" "}
          <SourceTag page={4} /> <SourceTag page={5} />
        </p>
        <p>
          <strong>Limited liability</strong> means she does not have to repay
          the failed project’s debt from additional personal resources.{" "}
          <SourceTag page={4} />
        </p>
        <p className="key-sentence">
          Shirking destroys her invested capital too. But it lets her collect a
          private benefit and avoid repaying the bank.
        </p>
        <Careful>
          The figures compare her payoff under two choices after investing. The
          same initial contribution has already been made in either case.
          Private benefits need not be spendable cash.
        </Careful>
      </>
    ),
    math: ({ p }) => (
      <>
        <Equation
          page={6}
          live={`Behave: ${money(behavePayoff(p.N, p.R, p.L))}`}
        >
          <Term id="behave" tex="R(N+L)-L" />
        </Equation>
        <Equation page={6} live={`Shirk: ${money(shirkPayoff(p.N, p.B, p.L))}`}>
          <Term id="shirk" tex="B(N+L)" />
        </Equation>
      </>
    ),
    notice:
      "In the shirk card, the project pays zero but her private benefit is positive. The bank is exposed to that choice.",
    algebra: () => (
      <>
        <p>
          If we subtracted her initial contribution from both payoffs, their
          ranking would be unchanged. That is why we can compare the payoffs
          directly.
        </p>
        <MathText display tex="[R(N+L)-L-N]-[B(N+L)-N]" />
        <MathText display tex="=R(N+L)-L-B(N+L)" />
        <SourceTag page={6} derived />
      </>
    ),
  },
  {
    id: "bank-rule",
    title: "The bank has one rule.",
    shortTitle: "The bank’s rule",
    why: "Translate the borrower’s choice into a condition for lending.",
    english: () => (
      <>
        <p>
          The bank cannot monitor her behavior. In this contract, it chooses how
          much to lend and asks only for its money back. So it lends only when
          behaving is at least as attractive as shirking. <SourceTag page={6} />
        </p>
        <p>
          Economists call this an <strong>incentive constraint</strong>: the
          deal must make the desired choice worthwhile. The slides call it a
          “skin in the game” constraint. <SourceTag page={6} />
        </p>
        <p className="key-sentence">
          The bank isn’t asking whether she is a good person. It is asking which
          choice the deal rewards.
        </p>
      </>
    ),
    math: ({ p }) => (
      <Equation
        page={6}
        live={`${money(behavePayoff(p.N, p.R, p.L))} ${behavePayoff(p.N, p.R, p.L) >= shirkPayoff(p.N, p.B, p.L) - 0.01 ? "≥" : "<"} ${money(shirkPayoff(p.N, p.B, p.L))}`}
      >
        <Term id="behave" tex="R(N+L)-L" />
        <MathText tex="\ge" />
        <Term id="shirk" tex="B(N+L)" />
      </Equation>
    ),
    notice:
      "Drag the loan. To the left of the crossing, the green payoff wins. To the right, the purple payoff wins.",
    algebra: () => (
      <>
        <p>
          The green line starts at the project return on her own money. Each
          extra borrowed dollar adds the project return but requires $1
          repayment.
        </p>
        <MathText display tex="R(N+L)-L=RN+(R-1)L" />
        <p>
          The purple line starts at the private benefit on her own money and
          grows by that private benefit per borrowed dollar.
        </p>
        <MathText display tex="B(N+L)=BN+BL" />
        <SourceTag page={6} derived />
      </>
    ),
  },
  {
    id: "read-constraint",
    title: "What does honesty buy her?",
    shortTitle: "Read the constraint",
    why: "Rearrange the rule to reveal what drives her choice.",
    english: () => (
      <>
        <p>
          The <strong>honesty premium</strong> is the extra she gets per
          invested dollar by behaving instead of shirking, before repayment. Its
          symbol is <MathText tex="R-B" />. This is our plain-English name.{" "}
          <SourceTag id="original" label="Our framing" />
        </p>
        <p>
          Multiply that premium by the whole project and you get the extra
          benefit of behaving. Compare it with the repayment she could skip by
          shirking.
        </p>
        <p className="key-sentence">
          She behaves when the honesty premium on the project covers the
          repayment she could dodge.
        </p>
        <p className="terminology-note">
          The textbook term for the maximum repayment compatible with incentives
          is <em>pledgeable income</em>. Here it is the total honesty premium on
          the project.
        </p>
      </>
    ),
    math: ({ p }) => (
      <Equation
        derived
        live={`${decimal(honestyPremium(p.R, p.B))} × (${money(p.N)} + ${money(p.L)}) ${behavePayoff(p.N, p.R, p.L) >= shirkPayoff(p.N, p.B, p.L) - 0.01 ? "≥" : "<"} ${money(p.L)}`}
      >
        <Term id="premium" tex="(R-B)(N+L)" />
        <MathText tex="\ge" />
        <Term id="loan" tex="L" />
      </Equation>
    ),
    notice:
      "The difference between the green and purple payoffs equals the total honesty premium minus the loan repayment.",
    algebra: () => (
      <>
        <p>
          Subtract the private benefit from both sides. Then collect the two
          terms multiplying the project size.
        </p>
        <MathText display tex="R(N+L)-L\ge B(N+L)" />
        <MathText display tex="R(N+L)-B(N+L)\ge L" />
        <MathText display tex="(R-B)(N+L)\ge L" />
        <SourceTag page={6} derived />
      </>
    ),
  },
  {
    id: "meter",
    title: "Her money and borrowed money pull differently.",
    shortTitle: "Skin vs. temptation",
    why: "Separate the part that keeps her honest from the part that tempts her.",
    english: () => (
      <>
        <p>
          Each dollar of her own money earns the honesty premium, with nothing
          to repay. All those dollars together give her{" "}
          <strong>skin in the game</strong>: <MathText tex="(R-B)N" />.
        </p>
        <p>
          Each borrowed dollar also earns the honesty premium, but it comes with
          $1 to repay. What is left is the{" "}
          <strong>temptation per borrowed dollar</strong>:{" "}
          <MathText tex="1-(R-B)" />. <SourceTag page={6} derived />
        </p>
        <p className="key-sentence">
          The bank lends exactly until the temptation from its money matches her
          skin in the game.
        </p>
        <p className="small muted">
          The per-dollar explanation and honesty meter are Econ Lab’s teaching
          additions. <SourceTag id="original" label="Our framing" />
        </p>
      </>
    ),
    math: ({ p }) => (
      <Equation
        derived
        live={`${money(skinInTheGame(p.N, p.R, p.B))} ${behavePayoff(p.N, p.R, p.L) >= shirkPayoff(p.N, p.B, p.L) - 0.01 ? "≥" : "<"} ${decimal(temptationPerBorrowedDollar(p.R, p.B))} × ${money(p.L)}`}
      >
        <Term id="skin" tex="(R-B)N" />
        <MathText tex="\ge" />
        <Term id="temptation" tex="[1-(R-B)]L" />
      </Equation>
    ),
    notice:
      "Her skin-in-the-game bar stays fixed as you drag the loan. Only the temptation bar grows.",
    algebra: () => (
      <>
        <p>
          Expand the project into her money plus borrowed money. Move the
          honesty premium on borrowed money to the repayment side.
        </p>
        <MathText display tex="(R-B)N+(R-B)L\ge L" />
        <MathText display tex="(R-B)N\ge L-(R-B)L" />
        <MathText display tex="(R-B)N\ge [1-(R-B)]L" />
        <SourceTag page={6} derived />
      </>
    ),
  },
  {
    id: "assumptions",
    title: "The interesting case lives between two limits.",
    shortTitle: "Break the assumptions",
    why: "See why the model needs this particular range of private benefits.",
    english: () => (
      <>
        <p>
          <strong>
            First: private benefits are smaller than project returns.
          </strong>{" "}
          With only her own money, behaving wins. If private benefits exceed
          returns, she would shirk even with no loan. At equality, she is
          indifferent with no loan. <SourceTag page={6} />
        </p>
        <p>
          <strong>
            Second: private benefits exceed the return after repaying a borrowed
            dollar.
          </strong>{" "}
          Borrowed money then tempts her, so the purple line eventually catches
          the green line. <SourceTag page={6} />
        </p>
        <p>
          Break either assumption in the diagram. Then restore the interesting
          case.
        </p>
        <Careful>
          When borrowed dollars stop tempting her, this incentive constraint
          gives no finite loan limit. The model does not determine a finite
          optimal project size in that case.
        </Careful>
      </>
    ),
    math: () => (
      <Equation page={6}>
        <MathText tex="R-1<B<R" />
      </Equation>
    ),
    notice:
      "Compare both the starting points and the slopes. The finite crossing requires green to start higher and purple to climb faster.",
    algebra: () => (
      <>
        <MathText display tex="B<R\iff R-B>0" />
        <p>This gives a positive honesty premium.</p>
        <MathText display tex="B>R-1\iff 1-(R-B)>0" />
        <p>
          This gives positive temptation per borrowed dollar. The next step
          divides by that quantity, so its sign matters. At equality the lines
          are parallel, and below it they diverge.
        </p>
        <SourceTag page={6} derived />
      </>
    ),
  },
  {
    id: "answer",
    title: "A good idea needs something behind it.",
    shortTitle: "The answer",
    why: "Turn the two opposing pulls into the maximum loan.",
    english: () => (
      <>
        <p>
          Divide her skin in the game by the temptation per borrowed dollar.
          That tells us how many borrowed dollars her own money can support.
        </p>
        <p>
          With a project return above $1, every extra dollar she borrows raises
          her payoff while behaving. So she borrows up to the
          incentive-compatible limit. <SourceTag page={7} />
        </p>
        <p>
          <strong>Leverage</strong>, written <MathText tex="\lambda" />, is
          total assets divided by her own money. It tells us how many project
          dollars each of her dollars supports. <SourceTag page={8} />
        </p>
        <Careful>
          More wealth buys a bigger loan, not a better leverage ratio. The same
          multiplier is applied to a bigger base. <SourceTag page={8} derived />
        </Careful>
      </>
    ),
    math: ({ p }) => {
      const q = borrowingOutcome(p.N, p.R, p.B);
      return (
        <>
          <div className="word-equation">
            <span>Maximum loan</span>
            <strong>skin in the game</strong>
            <span className="fraction-line" />
            <strong>temptation per borrowed dollar</strong>
          </div>
          <Equation
            page={7}
            live={
              q.kind === "finite"
                ? `${money(skinInTheGame(p.N, p.R, p.B))} ÷ ${decimal(temptationPerBorrowedDollar(p.R, p.B))} = ${money(q.maxLoan)}`
                : q.kind === "unbounded"
                  ? "No finite borrowing limit"
                  : "No positive loan"
            }
          >
            <MathText tex="L^*=\frac{(R-B)N}{1-(R-B)}" />
          </Equation>
          <Equation
            page={8}
            live={
              q.kind === "finite"
                ? `Leverage = ${decimal(q.leverage)}×`
                : "The finite-interior formula does not apply here."
            }
          >
            <MathText tex="\lambda^*=\frac{N+L^*}{N}=\frac{1}{1-(R-B)}" />
          </Equation>
        </>
      );
    },
    notice:
      "At the maximum loan, the two payoff lines meet and the two meter bars balance. They are two pictures of the same condition.",
    algebra: () => (
      <>
        <p>
          In the interesting case, temptation is positive. Dividing therefore
          keeps the inequality pointing the same way.
        </p>
        <MathText display tex="L\le\frac{(R-B)N}{1-(R-B)}" />
        <MathText display tex="\frac{N+L^*}{N}=1+\frac{R-B}{1-(R-B)}" />
        <MathText display tex="=\frac{1}{1-(R-B)}" />
        <p>
          Net worth cancels from the ratio. At the exact crossing she is
          indifferent; following the slides, assume she behaves. If ties favored
          shirking, the bank would need a loan just below the limit.
        </p>
        <SourceTag page={7} /> <SourceTag page={8} />
      </>
    ),
  },
  {
    id: "so-what",
    title: "Your idea matters. So does your starting point.",
    shortTitle: "So what? + play",
    why: "Answer the opening puzzle—and see what changes when you change the world.",
    english: () => (
      <>
        <p className="key-sentence">
          Wealth can cap a loan because the bank needs skin in the game, and
          skin in the game grows with your own money. <SourceTag page={9} />
        </p>
        <p>
          This is one reason wealth could matter for starting or growing a
          business. It is not evidence that moral hazard is the main reason.
        </p>
        <div className="evidence-note">
          <span className="eyebrow">A CONNECTION TO THE REAL WORLD</span>
          <p>
            Chaney, Sraer and Thesmar report that a 10% local real-estate price
            increase was associated with a 1.8-percentage-point larger
            investment response for firms owning their headquarters than for
            firms renting them. The measure is accumulated investment over
            2000–2006 relative to initial assets.
          </p>
          <SourceTag page={11} />{" "}
          <SourceTag id="chaney" label="Paper · Table 10" />
          <p className="small muted">
            Consistent with a collateral channel; not a direct test of this
            exact model.
          </p>
        </div>
        <div className="real-world-examples">
          <h3 className="section-label">FOR EXAMPLE · OUR ANALOGIES</h3>
          {realWorldExamples.map((example) => (
            <details key={example.title}>
              <summary>{example.title}</summary>
              <p>{example.body}</p>
            </details>
          ))}
          <SourceTag id="original" label="Our examples" />
        </div>
      </>
    ),
    math: ({ p }) => {
      const q = borrowingOutcome(p.N, p.R, p.B);
      return (
        <Equation
          page={8}
          derived
          live={
            q.kind === "finite"
              ? `${money(p.N)} × ${decimal(q.leverage)} = ${money(p.N * q.leverage)} invested`
              : q.kind === "unbounded"
                ? "This constraint imposes no finite project-size limit."
                : "No bank-financed expansion."
          }
        >
          <MathText tex="\text{Project size}=\lambda^*N" />
        </Equation>
      );
    },
    notice:
      "Change one slider at a time. The faded version is where you were before the last change. Watch what scales and what changes shape.",
    algebra: () => (
      <>
        <p>
          The maximum loan scales one-for-one with net worth, holding the two
          per-dollar incentives fixed.
        </p>
        <MathText
          display
          tex="L^*(2N)=2L^*(N),\qquad\lambda^*(2N)=\lambda^*(N)"
        />
        <p>
          A higher return increases the honesty premium. A larger private
          benefit reduces it. That is why returns and temptation affect the
          leverage ratio, while net worth does not.
        </p>
        <SourceTag page={8} derived />
      </>
    ),
  },
];
