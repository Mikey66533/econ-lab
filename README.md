# Econ Lab

Economics models you can play with and actually understand. A personal portfolio and learning project by Michael Galvin, grounded in Columbia GU4710, Finance and the Real Economy.

The first lesson asks: **Why can't a good idea just get funded?** It teaches the simplified Holmström–Tirole model through nine guided steps, an incentive chart, an honesty meter, a per-dollar view, a balance sheet, assumption counterfactuals, four prediction questions, and a shareable playground.

## Run locally

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. `npm run build` produces the static site in `out/`. `npm run typecheck` checks TypeScript only. No automated test framework is installed; the owner requested manual testing and no screenshots.

## Add a model

1. Add a folder under `src/models/<slug>/` with a `metadata.json` whose `slug` matches the folder name. Include `title`, `question`, `description`, `status` (`live` or `coming-soon`), `order`, `category`, and `lecture`. Live models also supply `duration` and `steps`.
2. A live model exports its lesson React component as the default export of `index.tsx`. Keep `parameters.ts`, `math.ts`, `steps.tsx`, `playground.tsx`, `predictions.ts`, `examples.ts`, and `sources.ts` in the model folder. Use `src/lib/model.ts` for the shared interfaces. Math must stay independent of React and of display formatting.
3. Follow TEACHING.md and STYLE.md. Cite every lecture-derived claim and distinguish new examples and illustrations from source material.
4. Restart development or run the production build. The discovery script scans all folders, validates metadata, generates `src/generated/models.ts`, adds the homepage card, and statically generates routes for live models. No manually maintained registry is needed. Coming-soon cards have no lesson route.

The shared shell has no dependency on this model's N, R, B, or L. New models can define their own parameters and visuals.

## Core files

- `src/models/holmstrom-tirole/math.ts`: pure economic calculations and explicit borrowing regimes.
- `src/models/holmstrom-tirole/steps.tsx`: the five-part teaching structure for all nine steps.
- `src/models/holmstrom-tirole/Charts.tsx`: original SVG diagrams using D3 scales.
- `src/models/holmstrom-tirole/index.tsx`: lesson navigation, URL state, visual coordination, and in-memory predictions.

## Parameters and state

Defaults: N = $80,000, R = 1.60, B = 1.00, selected illustrative L = $80,000. The answer step moves L to its limit. At these defaults, the honesty premium is 0.6; skin in the game is $48,000; temptation per borrowed dollar is 0.4; L* is $120,000; leverage is 2.5; total project size is $200,000. R and B are teaching choices, not values reported in the slides.

The URL carries `n`, `r`, `b`, `l`, and `step` (1–9), plus `case` for the assumption demonstrations. Values are checked and normalized to the playground's ranges. N has $1,000 increments and R/B have $0.01 increments. Share links encode current controls. Prediction scores and the before-comparison are React state only: no cookies, localStorage, account, or database.

The faint comparison captures the state before the most recent slider gesture. Holding a key counts as one gesture until key-up. Prediction questions use independent fixed starting scenarios and count the first answer only.

## Private source material

The user-supplied lecture PDFs live in `sources-private/` on the owner's machine. Both `.gitignore` and `.vercelignore` exclude that directory. The PDFs and any extracted images must never be added to Git, `public/`, or the deployment. No slide image extraction is used. All diagrams are original SVGs; the wealth schematic is explicitly qualitative rather than numerical data.

Sources use printed slide numbers and provide a map to PDF page positions. The two lecture documents are bibliographic references only. Research papers link to their public publisher/author pages.

## Deployment

Target: Vercel account **mikey66533**, workspace **Mike**, Hobby plan, scope **mike-0182**. Do not use the unrelated cached account **michael-1896**. Verify identity and team before every new link or deployment. The initial deployment uses a project-specific CLI configuration, leaving the user's other login unchanged.

Vercel runs `npm run build` and serves the static Next.js export. There are no server functions, paid add-ons, or environment secrets needed by the site. Production updates can be deployed from the CLI with the correct authenticated scope. Do not silently upgrade the plan.

## Manual review checklist

No screenshots or automated tests were taken. Review these in your browser:

- Open every step directly and with Back/Next; expand the algebra and assumption explanations.
- Drag and keyboard-adjust the loan on steps 4–6. Compare the two payoffs at, below, and above L*.
- At the default limit: both payoffs should be $200,000 and both meter bars $48,000.
- In the playground, increase B, increase R, then double N. The loan falls, leverage rises, and the doubled N leaves leverage unchanged, respectively.
- At B = R − 1, read “no finite limit”; at B = R, read “no positive loan.” In the assumption step, inspect the B > R and B < R − 1 cases too.
- Check the before comparison, Reset, all four prediction answers, and the in-memory score.
- Copy a shared URL, open it in a new tab, and inspect malformed/out-of-range query parameters.
- On a phone, check the sticky diagram and its independent scroll area, slider touch behavior, and equation widths.
- Check keyboard focus, color-independent labels, reduced-motion settings, and source links.

## Attribution and ownership

See the on-page Sources section and MODELS.md for source material. Econ Lab is a personal course-based learning project, not an official Columbia publication. Course references do not imply endorsement. Fonts: Instrument Serif and DM Sans via Google Fonts, with local serif and sans-serif fallbacks. No analytics are installed.
