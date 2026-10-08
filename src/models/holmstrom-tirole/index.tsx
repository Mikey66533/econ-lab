"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Header, Footer } from "@/components/Chrome";
import { HighlightContext, SourceTag, type Highlight } from "@/components/Math";
import { steps } from "./steps";
import { DEFAULTS, normalizeParameters, money, decimal } from "./parameters";
import {
  borrowingOutcome,
  behavePayoff,
  shirkPayoff,
  totalHonestyPremium,
  type Parameters,
} from "./math";
import {
  IncentiveChart,
  HonestyMeter,
  PerDollar,
  BalanceSheet,
  FundingFlow,
  ChoiceCards,
  EvidenceChart,
  ThreeWorlds,
  plotExtent,
} from "./Charts";
import { Playground, LoanControl } from "./playground";
import { Assumptions } from "./Assumptions";
import { Predictions } from "./PredictionPanel";
import { sources, slidePagesToPdf } from "./sources";
type Scenario = "normal" | "own-break" | "parallel" | "diverge";
function ResultStrip({
  p,
  before,
}: {
  p: Parameters;
  before: Parameters | null;
}) {
  const r = borrowingOutcome(p.N, p.R, p.B),
    old = before ? borrowingOutcome(before.N, before.R, before.B) : null;
  return (
    <div className="result-strip">
      <div>
        <span>Maximum loan</span>
        <strong>
          {r.kind === "unbounded" ? "No finite limit" : money(r.maxLoan)}
        </strong>
        {old && (
          <small>
            Before:{" "}
            {old.kind === "unbounded" ? "no finite limit" : money(old.maxLoan)}
          </small>
        )}
      </div>
      <div>
        <span>Leverage</span>
        <strong>
          {r.kind === "unbounded" ? "Unbounded" : `${decimal(r.leverage)}×`}
        </strong>
        {old && (
          <small>
            Before:{" "}
            {old.kind === "unbounded"
              ? "unbounded"
              : `${decimal(old.leverage)}×`}
          </small>
        )}
      </div>
    </div>
  );
}
export default function HolmstromTirole() {
  const [p, setP] = useState<Parameters>(DEFAULTS),
    [step, setStep] = useState(0),
    [before, setBefore] = useState<Parameters | null>(null);
  const [active, setActive] = useState<Highlight>(null),
    [ready, setReady] = useState(false),
    [note, setNote] = useState("");
  const [scenario, setScenario] = useState<Scenario>("normal"),
    [answers, setAnswers] = useState<Record<string, number>>({});
  const [loanDomain, setLoanDomain] = useState(plotExtent(DEFAULTS));
  const [view, setView] = useState<"incentives" | "meter" | "worlds">(
      "incentives",
    ),
    [copied, setCopied] = useState(false);
  const dragging = useRef(false),
    pRef = useRef(p),
    loanMax = useRef(plotExtent(DEFAULTS));
  const reduced = useReducedMotion();
  pRef.current = p;
  useEffect(() => {
    const read = () => {
      const q = new URLSearchParams(window.location.search);
      const raw: Partial<Parameters> = {};
      for (const key of ["N", "R", "B", "L"] as const) {
        const v = q.get(key.toLowerCase());
        if (v !== null && v.trim() !== "") raw[key] = Number(v);
      }
      const clean = normalizeParameters(raw);
      setP(clean);
      loanMax.current = plotExtent(clean);
      setLoanDomain(plotExtent(clean));
      const n = Number(q.get("step") ?? 1);
      setStep(
        Number.isFinite(n) ? Math.max(0, Math.min(8, Math.round(n) - 1)) : 0,
      );
      const s = q.get("case");
      setScenario(
        ["own-break", "parallel", "diverge"].includes(s ?? "")
          ? (s as Scenario)
          : "normal",
      );
      if (
        Object.entries(raw).some(
          ([key, value]) => clean[key as keyof Parameters] !== value,
        )
      )
        setNote(
          "Some shared values were outside this playground’s range and have been adjusted.",
        );
      setReady(true);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      const q = new URLSearchParams();
      q.set("n", String(p.N));
      q.set("r", String(+p.R.toFixed(4)));
      q.set("b", String(+p.B.toFixed(4)));
      q.set("l", String(+p.L.toFixed(2)));
      q.set("step", String(step + 1));
      if (scenario !== "normal" && step === 6) q.set("case", scenario);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${q}${window.location.hash}`,
      );
    }, 120);
    return () => clearTimeout(timer);
  }, [p, step, scenario, ready]);
  const start = () => {
    if (!dragging.current) {
      setBefore({ ...pRef.current });
      loanMax.current = plotExtent(pRef.current);
      dragging.current = true;
    }
  };
  const end = () => {
    dragging.current = false;
    const nextExtent = plotExtent(pRef.current);
    loanMax.current = nextExtent;
    setLoanDomain(nextExtent);
  };
  const change = (key: keyof Parameters, value: number) => {
    if (!dragging.current) start();
    const prev = pRef.current;
    const next = normalizeParameters({ ...prev, [key]: value });
    if (key === "R" && Math.abs(next.B - prev.B) > 0.00001)
      setNote(`B moved to $${next.B.toFixed(2)} to stay between R − 1 and R.`);
    else setNote("");
    pRef.current = next;
    setP(next);
  };
  const navigate = (i: number) => {
    setStep(i);
    setScenario("normal");
    setActive(null);
    dragging.current = false;
    if (i === 7) {
      const outcome = borrowingOutcome(p.N, p.R, p.B);
      if (outcome.kind === "finite") {
        setBefore({ ...p });
        setP({ ...p, L: outcome.maxLoan });
        loanMax.current = plotExtent({ ...p, L: outcome.maxLoan });
        setLoanDomain(loanMax.current);
      }
    }
    requestAnimationFrame(() =>
      document.getElementById("lesson-workspace")?.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
        block: "start",
      }),
    );
  };
  const reset = () => {
    setBefore({ ...p });
    setP(DEFAULTS);
    loanMax.current = plotExtent(DEFAULTS);
    setLoanDomain(plotExtent(DEFAULTS));
    setNote("");
    setScenario("normal");
  };
  const scenarioP =
    step !== 6 || scenario === "normal"
      ? p
      : {
          ...p,
          B:
            scenario === "own-break"
              ? p.R + 0.2
              : scenario === "parallel"
                ? p.R - 1
                : Math.max(0.01, p.R - 1 - 0.1),
        };
  const shown = step === 6 ? scenarioP : p,
    context = { p: shown },
    lesson = steps[step];
  const onChartLoan = (value: number, commit = false) => {
    start();
    change("L", value);
    if (commit) end();
  };
  const loanControl = (
    <LoanControl
      p={p}
      onChange={(value) => change("L", value)}
      onStart={start}
      onEnd={end}
      max={Math.max(loanDomain, p.L)}
    />
  );
  const limit = borrowingOutcome(p.N, p.R, p.B);
  async function copyLink() {
    try {
      const q = new URLSearchParams({
        n: String(p.N),
        r: String(p.R),
        b: String(p.B),
        l: String(p.L),
        step: String(step + 1),
      });
      if (step === 6 && scenario !== "normal") q.set("case", scenario);
      await navigator.clipboard.writeText(
        `${window.location.origin}${window.location.pathname}?${q}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setNote(
        "The current values are in your address bar. Copy that URL to share.",
      );
    }
  }
  return (
    <HighlightContext.Provider value={{ active, set: setActive }}>
      <Header lesson />
      <main id="main" className="model-page">
        <div className="model-intro">
          <div>
            <p className="eyebrow">
              MODEL 01 <span className="eyebrow-divider">/</span> FINANCE & THE
              REAL ECONOMY
            </p>
            <h1>
              Why can’t a good idea
              <br />
              <em>just get funded?</em>
            </h1>
            <p className="model-deck">
              Holmström–Tirole. A bank, a borrower, and the money she puts in
              herself.
            </p>
          </div>
          <div className="model-intro-aside">
            <span className="model-number">01</span>
            <span>9 steps · 12–18 minutes</span>
            <a href="#sources">Course notes & sources ↗</a>
          </div>
        </div>
        <div className="course-note">
          <span className="note-dot" />
          The simplified model taught in Columbia’s GU4710—not the full 1997
          paper.
          <button type="button" onClick={copyLink}>
            {copied ? "Link copied ✓" : "Share this view ↗"}
          </button>
        </div>
        <section id="lesson-workspace" className="lesson-workspace">
          <nav className="step-nav" aria-label="Lesson steps">
            {steps.map((s, i) => (
              <button
                type="button"
                key={s.id}
                aria-current={i === step ? "step" : undefined}
                onClick={() => navigate(i)}
                title={s.title}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>{s.shortTitle}</span>
              </button>
            ))}
          </nav>
          <div className="lesson-grid">
            <section className="lesson-copy" aria-labelledby="step-title">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: reduced ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.16 }}
                >
                  <div className="step-kicker">
                    <span>STEP {String(step + 1).padStart(2, "0")}</span>
                    <span>{step + 1} / 9</span>
                  </div>
                  <h2 id="step-title">{lesson.title}</h2>
                  <div className="why-step">
                    <span>WHY THIS STEP</span>
                    <p>{lesson.why}</p>
                  </div>
                  <div className="step-english">{lesson.english(context)}</div>
                  <div className="math-section">
                    <h3 className="section-label">
                      THE MATH, WITH YOUR NUMBERS
                    </h3>
                    {lesson.math(context)}
                  </div>
                  <aside className="notice">
                    <span className="notice-icon">↗</span>
                    <div>
                      <strong>On the chart</strong>
                      <p>{lesson.notice}</p>
                    </div>
                  </aside>
                  <details className="algebra" key={`algebra-${step}`}>
                    <summary>
                      Show the math <span>+</span>
                    </summary>
                    <div>{lesson.algebra(context)}</div>
                  </details>
                  {step === 1 && <Assumptions />}
                  {step === 7 && (
                    <Predictions
                      ids={["benefit", "return"]}
                      answers={answers}
                      onAnswer={(id, value) =>
                        setAnswers((a) => ({ ...a, [id]: value }))
                      }
                    />
                  )}{" "}
                  {step === 8 && (
                    <>
                      <Predictions
                        ids={["wealth", "boundary"]}
                        answers={answers}
                        onAnswer={(id, value) =>
                          setAnswers((a) => ({ ...a, [id]: value }))
                        }
                      />
                      <div className="coming-next">
                        <span className="eyebrow">NEXT IN THE NOTEBOOK</span>
                        <h3>What happens when net worth suddenly falls?</h3>
                        <p>Leverage amplifies losses. Coming soon.</p>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="lesson-pagination">
                <button
                  type="button"
                  onClick={() => navigate(step - 1)}
                  disabled={step === 0}
                >
                  ← Back
                </button>
                <span>{step + 1} of 9</span>
                {step < 8 ? (
                  <button
                    type="button"
                    className="next-button"
                    onClick={() => navigate(step + 1)}
                  >
                    Next step <span>→</span>
                  </button>
                ) : (
                  <a href="#sources" className="next-button">
                    View sources ↗
                  </a>
                )}
              </div>
            </section>
            <aside
              className="visual-column"
              aria-label="Interactive model visuals"
            >
              <div className="visual-paper">
                <div className="visual-paper-header">
                  <span className="eyebrow">THE MODEL, MADE VISIBLE</span>
                  <span className="live-dot">
                    {step < 3 ? "OBSERVE" : "INTERACTIVE"}
                  </span>
                </div>
                {step === 0 && <EvidenceChart />}
                {step === 1 && (
                  <>
                    <FundingFlow p={p} />
                    <BalanceSheet p={p} />
                    <p className="chart-caption">
                      Every project dollar comes from someone. The bank just
                      wants its contribution back. <SourceTag page={4} />
                    </p>
                  </>
                )}
                {step === 2 && (
                  <>
                    <ChoiceCards p={p} />
                    <p className="chart-caption">
                      Behaving pays {money(behavePayoff(p.N, p.R, p.L))};
                      shirking gives a private benefit of{" "}
                      {money(shirkPayoff(p.N, p.B, p.L))}.{" "}
                      <SourceTag page={6} />
                    </p>
                  </>
                )}
                {(step === 3 || step === 4) && (
                  <>
                    <IncentiveChart
                      p={p}
                      before={before}
                      onLoan={onChartLoan}
                      extent={Math.max(loanMax.current, p.L * 1.1)}
                    />
                    {loanControl}
                    {step === 4 && (
                      <div
                        className={`premium-readout ${active === "premium" ? "highlighted" : ""}`}
                        tabIndex={0}
                        onFocus={() => setActive("premium")}
                        onBlur={() => setActive(null)}
                        onPointerEnter={() => setActive("premium")}
                        onPointerLeave={() => setActive(null)}
                      >
                        <span>
                          Total honesty premium
                          <strong>
                            {money(totalHonestyPremium(p.N, p.R, p.B, p.L))}
                          </strong>
                        </span>
                        <span>
                          Repayment to cover<strong>{money(p.L)}</strong>
                        </span>
                      </div>
                    )}
                    <p className="chart-caption">
                      {step === 3
                        ? "Green starts higher. Purple grows faster. The crossing sets the limit."
                        : "The premium covers repayment precisely when green is at least as high as purple."}{" "}
                      <SourceTag page={6} />
                    </p>
                  </>
                )}
                {step === 5 && (
                  <>
                    <PerDollar p={p} />
                    <HonestyMeter
                      p={p}
                      before={before}
                      loanExtent={loanDomain}
                    />
                    {loanControl}
                  </>
                )}
                {step === 6 && (
                  <>
                    <div
                      className="scenario-buttons"
                      role="group"
                      aria-label="Break an assumption"
                    >
                      <button
                        type="button"
                        aria-pressed={scenario === "normal"}
                        onClick={() => setScenario("normal")}
                      >
                        Restore the model
                      </button>
                      <button
                        type="button"
                        aria-pressed={scenario === "own-break"}
                        onClick={() => setScenario("own-break")}
                      >
                        B &gt; R
                      </button>
                      <button
                        type="button"
                        aria-pressed={scenario === "parallel"}
                        onClick={() => setScenario("parallel")}
                      >
                        B = R − 1
                      </button>
                      <button
                        type="button"
                        aria-pressed={scenario === "diverge"}
                        onClick={() => setScenario("diverge")}
                      >
                        B &lt; R − 1
                      </button>
                    </div>
                    <IncentiveChart
                      p={shown}
                      before={scenario === "normal" ? null : p}
                    />
                    <div className="scenario-explanation" role="status">
                      <strong>
                        {scenario === "normal"
                          ? limit.kind === "finite"
                            ? "The interesting case"
                            : "Your current parameters are at a boundary"
                          : scenario === "own-break"
                            ? "Even her own money cannot keep her honest"
                            : scenario === "parallel"
                              ? "Parallel lines. No crossing."
                              : "Borrowed dollars now favor behaving."}
                      </strong>
                      <p>
                        {scenario === "normal"
                          ? limit.kind === "finite"
                            ? `Private benefits of $${decimal(p.B)} sit strictly between R − 1 and R. Green starts above purple, but purple rises faster.`
                            : limit.kind === "unbounded"
                              ? "At B = R − 1, the lines are parallel. This constraint gives no finite borrowing limit."
                              : "At B = R, the lines start together. Any positive loan makes shirking better, so the bank offers no positive loan."
                          : scenario === "own-break"
                            ? `With B = $${decimal(shown.B)}, purple starts above green and rises faster. There is no positive loan the bank would make.`
                            : scenario === "parallel"
                              ? `With B = $${decimal(shown.B)}, each borrowed dollar adds $0 of temptation. The positive gap from her own money stays fixed.`
                              : `With B = $${decimal(shown.B)}, the honesty premium is larger than the $1 repayment. The gap widens as borrowing grows.`}
                      </p>
                      <SourceTag page={6} derived />
                    </div>
                  </>
                )}
                {step === 7 && (
                  <>
                    <IncentiveChart
                      p={p}
                      before={before}
                      onLoan={onChartLoan}
                    />
                    <ResultStrip p={p} before={null} />
                    <HonestyMeter p={p} />
                    <BalanceSheet
                      p={
                        limit.kind === "finite" ? { ...p, L: limit.maxLoan } : p
                      }
                    />
                    <p className="chart-caption">
                      The $80k / $120k / $200k balance sheet matches the slide
                      example at the defaults. Our chosen R and B produce its
                      2.5× leverage. <SourceTag page={13} />
                      <SourceTag id="original" label="Our parameter choices" />
                    </p>
                    {loanControl}
                  </>
                )}
                {step === 8 && (
                  <>
                    <div
                      className="view-tabs"
                      role="group"
                      aria-label="Playground visual"
                    >
                      <button
                        type="button"
                        aria-pressed={view === "incentives"}
                        onClick={() => setView("incentives")}
                      >
                        Payoffs
                      </button>
                      <button
                        type="button"
                        aria-pressed={view === "meter"}
                        onClick={() => setView("meter")}
                      >
                        Honesty meter
                      </button>
                      <button
                        type="button"
                        aria-pressed={view === "worlds"}
                        onClick={() => setView("worlds")}
                      >
                        Three worlds
                      </button>
                    </div>
                    {view === "incentives" ? (
                      <IncentiveChart
                        p={p}
                        before={before}
                        onLoan={onChartLoan}
                      />
                    ) : view === "meter" ? (
                      <>
                        <PerDollar p={p} />
                        <HonestyMeter
                          p={p}
                          before={before}
                          loanExtent={loanDomain}
                        />
                      </>
                    ) : (
                      <ThreeWorlds p={p} />
                    )}
                    <ResultStrip p={p} before={before} />
                    {view !== "meter" && (
                      <div className="mini-meter">
                        <HonestyMeter
                          p={p}
                          before={before}
                          loanExtent={loanDomain}
                        />
                      </div>
                    )}
                    <Playground
                      p={p}
                      onChange={change}
                      onStart={start}
                      onEnd={end}
                      onReset={reset}
                      note={note}
                    />
                    {loanControl}
                    <p className="before-key">
                      <span />
                      Dashed and faded marks show the state before your last
                      change.
                    </p>
                  </>
                )}
                {step >= 3 && step <= 7 && (
                  <div className="current-parameters">
                    <span>
                      Her money <strong>{money(shown.N)}</strong>
                    </span>
                    <span>
                      Return <strong>${shown.R.toFixed(2)}</strong>
                    </span>
                    <span>
                      Private benefit <strong>${shown.B.toFixed(2)}</strong>
                    </span>
                  </div>
                )}
              </div>
              <p className="visual-footnote">
                Intuition first. Math always available.{" "}
                <a href="#source-original">What we added ↗</a>
              </p>
            </aside>
          </div>
        </section>
        <section id="sources" className="sources-section">
          <div className="sources-intro">
            <p className="eyebrow">THE MARGINAL NOTES</p>
            <h2>Sources & what we added.</h2>
            <p>
              A simplified course model, carefully attributed. Original examples
              and diagrams make the mechanism visible; they are not new
              empirical evidence.
            </p>
          </div>
          <div className="sources-grid">
            {sources.map((s) => (
              <article key={s.id} id={`source-${s.id}`}>
                <span className="source-kind">
                  {s.kind === "original"
                    ? "ECON LAB ADDITIONS"
                    : s.kind === "lecture"
                      ? "COURSE SLIDES"
                      : "RESEARCH PAPER"}
                </span>
                <h3>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.title} ↗
                    </a>
                  ) : (
                    s.title
                  )}
                </h3>
                <p>{s.detail}</p>
                {s.kind === "lecture" && (
                  <details>
                    <summary>Find the cited page in your PDF</summary>
                    <p className="page-map">
                      {Object.entries(slidePagesToPdf[s.id] ?? {})
                        .map(
                          ([printed, pdf]) =>
                            `Slide ${printed} → PDF page ${pdf}`,
                        )
                        .join(" · ")}
                    </p>
                  </details>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </HighlightContext.Provider>
  );
}
