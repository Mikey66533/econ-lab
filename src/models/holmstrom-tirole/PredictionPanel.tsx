"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { predictions } from "./predictions";
import { borrowingOutcome } from "./math";
import { HonestyMeter, IncentiveChart } from "./Charts";
import { money, decimal } from "./parameters";
export function Predictions({
  ids,
  answers,
  onAnswer,
}: {
  ids: string[];
  answers: Record<string, number>;
  onAnswer: (id: string, value: number) => void;
}) {
  const [active, setActive] = useState(0),
    reduced = useReducedMotion();
  const questions = predictions.filter((q) => ids.includes(q.id)),
    q = questions[Math.min(active, questions.length - 1)];
  const answered = answers[q.id] !== undefined,
    p = answered ? q.after : q.before;
  const outcome = borrowingOutcome(p.N, p.R, p.B);
  const score = predictions.filter(
    (item) => answers[item.id] === item.answer,
  ).length;
  return (
    <section
      className="prediction-section"
      aria-labelledby={`prediction-title-${ids[0]}`}
    >
      <div className="prediction-heading">
        <span className="eyebrow">PREDICT, THEN REVEAL</span>
        <span>
          Session score{" "}
          <strong>
            {score}/{Object.keys(answers).length}
          </strong>
        </span>
      </div>
      <div className="question-tabs">
        {questions.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
          >
            {predictions.indexOf(item) + 1}
            {answers[item.id] !== undefined ? " ✓" : ""}
          </button>
        ))}
      </div>
      <h3 id={`prediction-title-${ids[0]}`}>{q.prompt}</h3>
      <p className="small muted">
        Each question starts from the original parameters. Pick before you peek.
      </p>
      <div className="answer-options">
        {q.options.map((label, i) => (
          <button
            type="button"
            key={label}
            disabled={answered}
            className={
              answered
                ? i === q.answer
                  ? "answer-correct"
                  : i === answers[q.id]
                    ? "answer-wrong"
                    : ""
                : ""
            }
            onClick={() => onAnswer(q.id, i)}
          >
            {label}
            {answered && i === q.answer ? " ✓" : ""}
          </button>
        ))}
      </div>
      {answered && (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: reduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.3 }}
          className="prediction-reveal"
        >
          <p role="status">
            <strong>
              {answers[q.id] === q.answer ? "Exactly." : "Here’s the twist."}
            </strong>{" "}
            {q.why}
          </p>
          <div className="prediction-numbers">
            <span>
              Maximum loan{" "}
              <strong>
                {outcome.kind === "unbounded"
                  ? "No finite limit"
                  : money(outcome.maxLoan)}
              </strong>
            </span>
            <span>
              Leverage{" "}
              <strong>
                {outcome.kind === "unbounded"
                  ? "No finite limit"
                  : `${decimal(outcome.leverage)}×`}
              </strong>
            </span>
          </div>
          {q.id === "boundary" ? (
            <IncentiveChart p={p} before={q.before} compact />
          ) : (
            <HonestyMeter p={p} before={q.before} />
          )}
        </motion.div>
      )}
      <p className="small muted">
        Your first answer counts. Score stays in this session only.
      </p>
    </section>
  );
}
