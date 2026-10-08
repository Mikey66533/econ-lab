"use client";
import { scaleLinear } from "d3-scale";
import { useContext, useId, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HighlightContext, SourceTag } from "@/components/Math";
import {
  projectSize,
  projectReturn,
  behavePayoff,
  shirkPayoff,
  borrowingOutcome,
  skinInTheGame,
  borrowedMoneyTemptation,
  behaves,
  incentiveMargin,
  honestyPremium,
  temptationPerBorrowedDollar,
  type Parameters,
} from "./math";
import { money, compactMoney, decimal } from "./parameters";
const GREEN = "#34715b",
  PURPLE = "#8b659d",
  AMBER = "#b37327",
  INK = "#666961";
export function plotExtent(p: Parameters, before?: Parameters | null) {
  const result = borrowingOutcome(p.N, p.R, p.B),
    old = before ? borrowingOutcome(before.N, before.R, before.B) : null;
  return Math.max(
    p.N * 2,
    p.L * 1.15,
    result.kind === "finite" ? result.maxLoan * 1.4 : 0,
    before?.L ?? 0,
    old?.kind === "finite" ? old.maxLoan * 1.4 : 0,
    10000,
  );
}
export function IncentiveChart({
  p,
  before,
  onLoan,
  compact = false,
  extent,
}: {
  p: Parameters;
  before?: Parameters | null;
  onLoan?: (n: number, commit?: boolean) => void;
  compact?: boolean;
  extent?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null),
    clipId = useId().replace(/:/g, ""),
    reduced = useReducedMotion();
  const { active, set } = useContext(HighlightContext);
  const result = borrowingOutcome(p.N, p.R, p.B),
    max = extent ?? plotExtent(p, before);
  const W = 620,
    H = 350,
    left = 66,
    right = 27,
    top = 30,
    bottom = 62;
  const x = scaleLinear()
    .domain([0, max])
    .range([left, W - right]);
  const ymax =
    Math.max(
      behavePayoff(p.N, p.R, max),
      shirkPayoff(p.N, p.B, max),
      before ? behavePayoff(before.N, before.R, max) : 0,
      before ? shirkPayoff(before.N, before.B, max) : 0,
    ) * 1.12;
  const y = scaleLinear()
    .domain([0, ymax])
    .nice(4)
    .range([H - bottom, top]);
  const cap =
    result.kind === "finite"
      ? result.maxLoan
      : result.kind === "no-loan"
        ? 0
        : max;
  const pointX = x(Math.min(p.L, max)),
    greenY = y(behavePayoff(p.N, p.R, p.L)),
    purpleY = y(shirkPayoff(p.N, p.B, p.L));
  const path = (q: Parameters, kind: "behave" | "shirk") =>
    `M ${x(0)} ${y(kind === "behave" ? behavePayoff(q.N, q.R, 0) : shirkPayoff(q.N, q.B, 0))} L ${x(max)} ${y(kind === "behave" ? behavePayoff(q.N, q.R, max) : shirkPayoff(q.N, q.B, max))}`;
  const drag = (clientX: number, commit = false) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (box && onLoan)
      onLoan(
        Math.round(
          Math.max(
            0,
            Math.min(max, x.invert(((clientX - box.left) * W) / box.width)),
          ) / 100,
        ) * 100,
        commit,
      );
  };
  return (
    <div className={`incentive-chart ${compact ? "compact-chart" : ""}`}>
      <div className="chart-topline">
        <span className="eyebrow">THE INCENTIVE CHART</span>
        {!compact && (
          <span className={`status-pill ${behaves(p) ? "yes" : "no"}`}>
            {Math.abs(incentiveMargin(p.N, p.R, p.B, p.L)) < 0.01
              ? "Equally good"
              : behaves(p)
                ? "Behaving wins"
                : "Shirking wins"}
          </span>
        )}
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Loan size versus her payoff, in dollars. Maximum loan: ${result.kind === "finite" ? money(result.maxLoan) : result.kind === "unbounded" ? "no finite limit" : "zero"}. At a loan of ${money(p.L)}, behaving gives ${money(behavePayoff(p.N, p.R, p.L))}; shirking gives ${money(shirkPayoff(p.N, p.B, p.L))}.`}
      >
        <defs>
          <clipPath id={clipId}>
            <rect
              x={left}
              y={top}
              width={W - left - right}
              height={H - top - bottom}
            />
          </clipPath>
        </defs>
        <rect
          x={left}
          y={top}
          width={Math.max(0, x(cap) - left)}
          height={H - top - bottom}
          fill="#e9f0e9"
        />
        <rect
          x={x(cap)}
          y={top}
          width={Math.max(0, W - right - x(cap))}
          height={H - top - bottom}
          fill="#f0eeea"
        />
        {y.ticks(4).map((t) => (
          <g key={t}>
            <line
              x1={left}
              x2={W - right}
              y1={y(t)}
              y2={y(t)}
              stroke="#d9ded5"
              strokeWidth=".7"
            />
            <text
              x={left - 10}
              y={y(t) + 4}
              textAnchor="end"
              className="svg-tick"
            >
              {compactMoney(t)}
            </text>
          </g>
        ))}
        {x.ticks(4).map((t) => (
          <g key={t}>
            <line
              x1={x(t)}
              x2={x(t)}
              y1={H - bottom}
              y2={H - bottom + 5}
              stroke="#aaa"
            />
            <text
              x={x(t)}
              y={H - bottom + 22}
              textAnchor="middle"
              className="svg-tick"
            >
              {compactMoney(t)}
            </text>
          </g>
        ))}
        <text x={left} y={16} className="svg-label">
          Her payoff ($)
        </text>
        <text
          x={(left + W - right) / 2}
          y={H - 8}
          textAnchor="middle"
          className="svg-label"
        >
          Loan size, L ($)
        </text>
        <g clipPath={`url(#${clipId})`}>
          {before &&
            (["behave", "shirk"] as const).map((kind) => (
              <path
                key={`old-${kind}`}
                d={path(before, kind)}
                fill="none"
                stroke={kind === "behave" ? GREEN : PURPLE}
                strokeDasharray="4 6"
                strokeWidth="2"
                opacity=".25"
              />
            ))}
          {(["behave", "shirk"] as const).map((kind) => (
            <g
              key={kind}
              onPointerEnter={() => set(kind)}
              onPointerLeave={() => set(null)}
              onFocus={() => set(kind)}
              onBlur={() => set(null)}
              tabIndex={compact ? -1 : 0}
              role="button"
              aria-label={`Highlight ${kind === "behave" ? "behaving" : "shirking"} payoff`}
              onClick={() => set(active === kind ? null : kind)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  set(active === kind ? null : kind);
                }
              }}
            >
              <motion.path
                animate={{
                  d: path(p, kind),
                  strokeWidth: active === kind ? 4.5 : 2.5,
                  opacity:
                    active && active !== kind && active !== "loan" ? 0.45 : 1,
                }}
                transition={{ duration: reduced ? 0 : 0.22 }}
                fill="none"
                stroke={kind === "behave" ? GREEN : PURPLE}
              />
              <path
                d={path(p, kind)}
                fill="none"
                stroke="transparent"
                strokeWidth="20"
              />
            </g>
          ))}
          {result.kind === "finite" && (
            <line
              x1={x(cap)}
              x2={x(cap)}
              y1={top}
              y2={H - bottom}
              stroke={AMBER}
              strokeDasharray="3 5"
            />
          )}
          {before &&
            borrowingOutcome(before.N, before.R, before.B).kind ===
              "finite" && (
              <line
                x1={x(
                  (
                    borrowingOutcome(before.N, before.R, before.B) as {
                      maxLoan: number;
                    }
                  ).maxLoan,
                )}
                x2={x(
                  (
                    borrowingOutcome(before.N, before.R, before.B) as {
                      maxLoan: number;
                    }
                  ).maxLoan,
                )}
                y1={top}
                y2={H - bottom}
                stroke={AMBER}
                opacity=".22"
                strokeDasharray="2 6"
              />
            )}
          <line
            x1={pointX}
            x2={pointX}
            y1={top}
            y2={H - bottom}
            stroke={active === "loan" ? AMBER : "#737c73"}
            strokeWidth={active === "loan" ? 3 : 1}
          />
          <circle
            cx={pointX}
            cy={greenY}
            r="5"
            fill={GREEN}
            stroke="#fff"
            strokeWidth="2"
          />
          <circle
            cx={pointX}
            cy={purpleY}
            r="5"
            fill={PURPLE}
            stroke="#fff"
            strokeWidth="2"
          />
        </g>
        {result.kind === "finite" && (
          <text
            x={Math.max(left + 38, Math.min(W - right - 43, x(cap)))}
            y={top + 17}
            textAnchor="middle"
            fill={AMBER}
            className="svg-label svg-strong"
          >
            L* {compactMoney(cap)}
          </text>
        )}
        {result.kind === "unbounded" && (
          <text
            x={W - right - 12}
            y={top + 17}
            textAnchor="end"
            fill={GREEN}
            className="svg-label"
          >
            No finite limit →
          </text>
        )}
        {onLoan && (
          <rect
            x={left}
            y={H - bottom - 13}
            width={W - left - right}
            height={36}
            fill="transparent"
            className="chart-drag"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              drag(e.clientX);
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId))
                drag(e.clientX);
            }}
            onPointerUp={(e) => {
              drag(e.clientX, true);
              e.currentTarget.releasePointerCapture(e.pointerId);
            }}
          >
            <title>
              Drag here to change the loan. A keyboard-accessible slider is
              below.
            </title>
          </rect>
        )}
      </svg>
      <div className="chart-legend">
        <span className="legend-green">
          <i />
          What she keeps if she behaves
        </span>
        <span className="legend-purple">
          <i />
          What she gets if she shirks
        </span>
      </div>
      {!compact && (
        <div className="chart-zones">
          <span>Green region: bank lends</span>
          <span>Gray region: bank refuses</span>
        </div>
      )}
    </div>
  );
}
export function HonestyMeter({
  p,
  before,
  loanExtent,
}: {
  p: Parameters;
  before?: Parameters | null;
  loanExtent?: number;
}) {
  const { active, set } = useContext(HighlightContext),
    reduced = useReducedMotion();
  const skin = skinInTheGame(p.N, p.R, p.B),
    temptation = borrowedMoneyTemptation(p.R, p.B, p.L);
  const oldSkin = before ? skinInTheGame(before.N, before.R, before.B) : 0,
    oldTempt = before
      ? borrowedMoneyTemptation(before.R, before.B, before.L)
      : 0;
  const max =
    Math.max(
      Math.abs(skin),
      Math.abs(temptation),
      Math.abs(oldSkin),
      Math.abs(oldTempt),
      Math.abs(temptationPerBorrowedDollar(p.R, p.B)) *
        (loanExtent ?? plotExtent(p, before)),
      p.N * 0.8,
      1,
    ) * 1.08;
  const rows = [
    {
      id: "skin" as const,
      name: "Skin in the game",
      value: skin,
      old: oldSkin,
      detail: "The pull from her own money",
    },
    {
      id: "temptation" as const,
      name: "Temptation from borrowed money",
      value: temptation,
      old: oldTempt,
      detail: "The pull from the bank’s money",
    },
  ];
  return (
    <div className="meter">
      <div className="chart-topline">
        <span className="eyebrow">THE HONESTY METER</span>
        <span className="muted">Same scale · dollars</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.id}
          className={`meter-row ${active === row.id ? "highlighted" : ""}`}
          tabIndex={0}
          onFocus={() => set(row.id)}
          onBlur={() => set(null)}
          onPointerEnter={() => set(row.id)}
          onPointerLeave={() => set(null)}
        >
          <div className="meter-label">
            <span>{row.name}</span>
            <strong>{money(row.value)}</strong>
          </div>
          <div
            className={`meter-track ${row.id}`}
            role="img"
            aria-label={`${row.name}: ${money(row.value)}${before ? `, before: ${money(row.old)}` : ""}`}
          >
            {before && (
              <div
                className="meter-before"
                style={{ width: `${(Math.abs(row.old) / max) * 100}%` }}
              />
            )}
            <motion.div
              className="meter-fill"
              animate={{ width: `${(Math.abs(row.value) / max) * 100}%` }}
              transition={{ duration: reduced ? 0 : 0.2 }}
            />
          </div>
          <span className="meter-detail">
            {row.value < 0
              ? "This pull reverses outside the usual assumptions."
              : row.detail}
          </span>
        </div>
      ))}
      <p className="chart-caption">
        {Math.abs(skin - temptation) < 0.01
          ? "Exactly balanced. This is the largest loan she can be trusted to repay."
          : skin >= temptation
            ? "Her skin in the game covers the temptation. The deal works."
            : "Temptation overtakes her skin in the game. The bank refuses."}
      </p>
    </div>
  );
}
export function PerDollar({ p }: { p: Parameters }) {
  const premium = honestyPremium(p.R, p.B),
    temptation = temptationPerBorrowedDollar(p.R, p.B);
  return (
    <div className="per-dollar">
      <div className="dollar-card">
        <span className="coin-icon">$</span>
        <span className="eyebrow">ONE DOLLAR OF HER MONEY</span>
        <div className="dollar-track">
          <div
            style={{ width: `${Math.max(0, Math.min(1, premium)) * 100}%` }}
          />
        </div>
        <p>
          <strong className="green">+{decimal(premium)}</strong> for behaving
          <br />
          <span className="muted">Nothing to repay.</span>
        </p>
        <span className="dollar-conclusion green">
          {decimal(premium)} toward honesty
        </span>
      </div>
      <div className="dollar-card borrowed">
        <span className="coin-icon">$</span>
        <span className="eyebrow">ONE BORROWED DOLLAR</span>
        <div className="dollar-track">
          <div
            style={{ width: `${Math.max(0, Math.min(1, premium)) * 100}%` }}
          />
          <div
            className="temptation-segment"
            style={{ width: `${Math.max(0, Math.min(1, temptation)) * 100}%` }}
          />
        </div>
        <p>
          <strong className="green">+{decimal(premium)}</strong> for behaving
          <br />
          <span className="purple">−1.00 to repay the bank.</span>
        </p>
        <span className="dollar-conclusion purple">
          {decimal(temptation)} toward shirking
        </span>
      </div>
      <p className="chart-caption full-span">
        Same project. Different incentives. A borrowed dollar comes with a
        dollar to repay. <SourceTag page={6} derived />
      </p>
    </div>
  );
}
export function BalanceSheet({ p }: { p: Parameters }) {
  const total = projectSize(p.N, p.L),
    reduced = useReducedMotion();
  return (
    <div className="balance-sheet">
      <div className="chart-topline">
        <span className="eyebrow">ONE PROJECT. TWO SOURCES OF MONEY.</span>
      </div>
      <div className="balance-head">
        <span>
          Assets <strong>{money(total)}</strong>
        </span>
        <span>How it is financed</span>
      </div>
      <div className="balance-blocks">
        <div className="asset-block">
          Project
          <br />
          <strong>{compactMoney(total)}</strong>
        </div>
        <span className="balance-equals">=</span>
        <div className="funding-block">
          <motion.div
            className="own-block"
            animate={{ flexGrow: p.N / total }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          >
            <span>Her money</span>
            <strong>{compactMoney(p.N)}</strong>
          </motion.div>
          <motion.div
            className="loan-block"
            animate={{ flexGrow: p.L / total }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          >
            <span>Bank loan</span>
            <strong>{compactMoney(p.L)}</strong>
          </motion.div>
        </div>
      </div>
      <div className="balance-foot">
        <span>N + L</span>
        <span>
          N <span className="muted">+</span> L
        </span>
      </div>
    </div>
  );
}
export function FundingFlow({ p }: { p: Parameters }) {
  return (
    <div className="funding-flow">
      <div className="funding-person">
        <div className="coin-stack">
          <span>$</span>
          <span>$</span>
          <span>$</span>
        </div>
        <span>Her own money</span>
        <strong>{money(p.N)}</strong>
      </div>
      <span className="flow-sign">+</span>
      <div className="funding-person bank">
        <div className="bank-icon" aria-hidden="true">
          ▥
        </div>
        <span>The bank’s loan</span>
        <strong>{money(p.L)}</strong>
      </div>
      <span className="flow-sign">→</span>
      <div className="project-icon">
        <span className="eyebrow">THE PROJECT</span>
        <strong>{money(projectSize(p.N, p.L))}</strong>
        <span>invested together</span>
      </div>
    </div>
  );
}
export function ChoiceCards({ p }: { p: Parameters }) {
  return (
    <div className="choice-cards">
      <article className="choice behave-choice">
        <span className="eyebrow">01 · BEHAVE</span>
        <h3>The project succeeds.</h3>
        <dl>
          <div>
            <dt>Project returns</dt>
            <dd>{money(projectReturn(p.N, p.R, p.L))}</dd>
          </div>
          <div>
            <dt>Repay the bank</dt>
            <dd>−{money(p.L)}</dd>
          </div>
          <div className="choice-total">
            <dt>She keeps</dt>
            <dd>{money(behavePayoff(p.N, p.R, p.L))}</dd>
          </div>
        </dl>
      </article>
      <article className="choice shirk-choice">
        <span className="eyebrow">02 · SHIRK</span>
        <h3>The project fails.</h3>
        <dl>
          <div>
            <dt>Project returns</dt>
            <dd>$0</dd>
          </div>
          <div>
            <dt>Repay the bank</dt>
            <dd>$0</dd>
          </div>
          <div className="choice-total">
            <dt>Private benefit</dt>
            <dd>{money(shirkPayoff(p.N, p.B, p.L))}</dd>
          </div>
        </dl>
      </article>
      <div className="loss-strip full-span">
        <span>What gets destroyed?</span>
        <strong>{money(p.N)} of her capital</strong>
        <span>+</span>
        <strong>{money(p.L)} of the bank’s money</strong>
      </div>
    </div>
  );
}
export function EvidenceChart() {
  return (
    <div className="evidence-chart">
      <div className="chart-topline">
        <span className="eyebrow">WEALTH & ENTERING ENTREPRENEURSHIP</span>
      </div>
      <svg
        viewBox="0 0 620 320"
        role="img"
        aria-label="Illustrative schematic: entry into entrepreneurship is mostly flat across wealth, rising mainly beyond the 95th percentile. This is not estimated data."
      >
        <rect x="545" y="28" width="25" height="230" fill="#efe4d4" />
        <line x1="64" x2="585" y1="258" y2="258" stroke="#b7b9ac" />
        <line x1="64" x2="64" y1="30" y2="258" stroke="#b7b9ac" />
        <path
          d="M64 214 C200 211 400 214 520 213 S541 212 545 208 Q553 188 558 140 T570 67"
          fill="none"
          stroke={GREEN}
          strokeWidth="3"
        />
        <line
          x1="545"
          x2="545"
          y1="28"
          y2="258"
          stroke={AMBER}
          strokeDasharray="4 6"
        />
        <text x="64" y="17" className="svg-label">
          Likelihood of entry (qualitative)
        </text>
        <text x="64" y="281" className="svg-tick">
          0
        </text>
        <text x="309" y="281" className="svg-tick">
          50
        </text>
        <text x="538" y="281" className="svg-tick">
          95
        </text>
        <text x="566" y="281" className="svg-tick">
          100
        </text>
        <text x="320" y="308" textAnchor="middle" className="svg-label">
          Position in the wealth distribution (percentile)
        </text>
        <text x="142" y="187" className="svg-annotation">
          Mostly flat
        </text>
        <path d="M445 94h62" fill="none" stroke={AMBER} />
        <text x="292" y="86" className="svg-annotation">
          The rise is in the top 5%
        </text>
      </svg>
      <p className="schematic-note">
        ILLUSTRATIVE SCHEMATIC · NOT ESTIMATED DATA
      </p>
      <p className="chart-caption">
        The pattern is a puzzle to explain, not proof that borrowing limits
        cause it. <SourceTag id="hurst" label="Hurst & Lusardi (2004)" />
      </p>
    </div>
  );
}
export function ThreeWorlds({ p }: { p: Parameters }) {
  const result = borrowingOutcome(p.N, p.R, p.B),
    maxN = 500000;
  const lambda =
    result.kind === "finite"
      ? result.leverage
      : result.kind === "no-loan"
        ? 1
        : null;
  const xs = scaleLinear().domain([0, maxN]).range([62, 335]),
    ys = scaleLinear()
      .domain([0, (lambda ?? 1) * maxN])
      .nice(3)
      .range([207, 27]);
  return (
    <div className="three-worlds">
      <span className="eyebrow">THREE WAYS TO FINANCE AN IDEA</span>
      <svg
        viewBox="0 0 620 275"
        role="img"
        aria-label="Without finance, project size equals net worth. With a finite moral-hazard limit, project size equals leverage times net worth. The separate perfect-market schematic is flat in wealth, with a level determined by productivity."
      >
        {ys.ticks(3).map((t) => (
          <g key={t}>
            <line x1="62" x2="335" y1={ys(t)} y2={ys(t)} stroke="#ddd" />
            <text x="54" y={ys(t) + 4} className="svg-tick" textAnchor="end">
              {compactMoney(t)}
            </text>
          </g>
        ))}
        <text x="62" y="15" className="svg-label">
          Project size ($)
        </text>
        <text x="160" y="266" className="svg-label">
          Net worth, N ($)
        </text>
        <path
          d={`M62 ${ys(0)} L335 ${ys(maxN)}`}
          fill="none"
          stroke="#848a81"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
        {lambda !== null ? (
          <path
            d={`M62 ${ys(0)} L335 ${ys(lambda * maxN)}`}
            stroke={GREEN}
            strokeWidth="3"
            fill="none"
          />
        ) : (
          <text x="80" y="70" className="svg-label" fill={GREEN}>
            No finite borrowing limit
          </text>
        )}
        {xs.ticks(2).map((t) => (
          <text
            key={t}
            x={xs(t)}
            y="229"
            className="svg-tick"
            textAnchor="middle"
          >
            {compactMoney(t)}
          </text>
        ))}
        <line x1="370" x2="370" y1="20" y2="235" stroke="#ddd" />
        <text x="405" y="40" className="svg-label">
          Perfect finance
        </text>
        <text x="405" y="59" className="svg-tick">
          Separate schematic
        </text>
        <line x1="408" x2="590" y1="208" y2="208" stroke="#bbb" />
        <line x1="408" x2="408" y1="83" y2="208" stroke="#bbb" />
        <path d="M408 130H590" fill="none" stroke={PURPLE} strokeWidth="2.5" />
        <text x="425" y="113" className="svg-tick">
          Chosen by productivity
        </text>
        <text x="432" y="230" className="svg-tick">
          Net worth →
        </text>
        <text x="405" y="253" className="svg-tick">
          Height has no numerical value
        </text>
      </svg>
      <div className="chart-legend">
        <span>
          <i className="dashed-key" />
          No finance: size = N
        </span>
        <span className="legend-green">
          <i />
          Moral hazard: size = λ*N
        </span>
      </div>
      <p className="chart-caption">
        In the middle world, both the idea and her wealth matter. The
        perfect-market comparison comes from a different model.{" "}
        <SourceTag page={9} /> <SourceTag deck={1} page={3} />
      </p>
    </div>
  );
}
