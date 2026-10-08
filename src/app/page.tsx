import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { models } from "@/generated/models";
export default function Home() {
  const sorted = [...models].sort((a, b) => a.order - b.order),
    live = sorted.filter((m) => m.status === "live"),
    coming = sorted.filter((m) => m.status === "coming-soon");
  return (
    <>
      <Header />
      <main id="main" className="home-page">
        <section className="home-hero">
          <div>
            <p className="eyebrow">AN INTERACTIVE ECONOMICS NOTEBOOK</p>
            <h1>
              Good ideas.
              <br />
              <em>Real constraints.</em>
            </h1>
            <p className="home-subtitle">
              Economics models you can play with
              <br className="desktop-break" /> and actually understand.
            </p>
            <p className="home-description">
              Move a slider. Make a prediction. See why the result makes sense.
              A growing collection of models from Finance and the Real Economy.
            </p>
            <Link
              href={`/models/${live[0]?.slug ?? "holmstrom-tirole"}`}
              className="primary-link"
            >
              Open the first model <span>↗</span>
            </Link>
          </div>
          <div className="hero-diagram">
            <div className="notebook-label">
              <span>FIG. 01</span>
              <span>THE MOMENT TRUST RUNS OUT</span>
            </div>
            <svg
              viewBox="0 0 520 370"
              role="img"
              aria-label="Illustration using default model values: a behaving payoff starts above a shirking payoff, but the lines cross at a maximum loan of $120,000."
            >
              <defs>
                <pattern
                  id="paper-grid"
                  width="30"
                  height="30"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M30 0H0V30"
                    fill="none"
                    stroke="#dce1d5"
                    strokeWidth=".6"
                  />
                </pattern>
              </defs>
              <rect
                x="45"
                y="25"
                width="435"
                height="277"
                fill="url(#paper-grid)"
              />
              <path d="M45 25V302H480" stroke="#8b9285" fill="none" />
              <rect
                x="45"
                y="25"
                width="261"
                height="277"
                fill="#dde9df"
                opacity=".35"
              />
              <path
                d="M45 206 L480 116"
                fill="none"
                stroke="#34715b"
                strokeWidth="2.5"
              />
              <path
                d="M45 242 L480 92"
                fill="none"
                stroke="#8b659d"
                strokeWidth="2.5"
              />
              <path d="M306 30V302" stroke="#b37327" strokeDasharray="3 6" />
              <circle
                cx="306"
                cy="152"
                r="7"
                fill="#f8f7f0"
                stroke="#b37327"
                strokeWidth="2"
              />
              <text x="62" y="185" className="hero-chart-label" fill="#34715b">
                Behave
              </text>
              <text x="396" y="73" className="hero-chart-label" fill="#8b659d">
                Shirk
              </text>
              <text x="318" y="126" className="hero-chart-note">
                Here’s the limit.
              </text>
              <text x="287" y="326" className="svg-label" fill="#b37327">
                $120k
              </text>
              <text x="47" y="326" className="svg-label">
                $0
              </text>
              <text x="450" y="326" className="svg-label">
                $200k
              </text>
              <text x="45" y="13" className="svg-label">
                Her payoff ($)
              </text>
              <text x="217" y="353" className="svg-label">
                Loan size ($)
              </text>
            </svg>
            <div className="handwritten-note">
              A bigger loan doesn’t always make a better deal.
            </div>
            <div className="hero-diagram-footer">
              <span className="legend-green">— Behaving</span>
              <span className="legend-purple">— Shirking</span>
              <span>From Slides 2, p. 6</span>
            </div>
          </div>
        </section>
        <section id="library" className="library">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE MODEL LIBRARY</p>
              <h2>Start with a question.</h2>
            </div>
            <span>
              {String(live.length).padStart(2, "0")} LIVE{" "}
              <span className="muted">/ MORE IN THE NOTEBOOK</span>
            </span>
          </div>
          {live.map((m) => (
            <Link
              className="featured-model"
              key={m.slug}
              href={`/models/${m.slug}`}
            >
              <div className="featured-number">
                {String(m.order).padStart(2, "0")}
              </div>
              <div className="featured-copy">
                <span className="live-label">
                  <span />
                  LIVE MODEL{" "}
                  <span className="category-label">/ {m.category}</span>
                </span>
                <h3>{m.question}</h3>
                <p>
                  {m.title} <span className="dot-divider">·</span>{" "}
                  {m.description}
                </p>
                <div className="model-tags">
                  <span>{m.steps} guided steps</span>
                  <span>Interactive playground</span>
                  <span>Predict, then reveal</span>
                </div>
              </div>
              <span className="featured-arrow">↗</span>
            </Link>
          ))}
          <div className="upcoming-grid">
            {coming.map((m) => (
              <article className="upcoming-card" key={m.slug}>
                <div className="upcoming-top">
                  <span>{String(m.order).padStart(2, "0")}</span>
                  <span>IN THE NOTEBOOK</span>
                </div>
                <h3>{m.title}</h3>
                <p>{m.question}</p>
                <span className="coming-label">Coming soon</span>
              </article>
            ))}
          </div>
        </section>
        <section className="home-manifesto">
          <span className="asterisk">✳</span>
          <h2>
            The point isn’t memorizing
            <br />
            the derivation.
          </h2>
          <p>
            It’s understanding why each step exists.
            <br />
            What it means in the real world.
            <br />
            And why the answer makes sense.
          </p>
          <span className="eyebrow">
            INTUITION FIRST. MATH ALWAYS AVAILABLE.
          </span>
        </section>
      </main>
      <Footer />
    </>
  );
}
