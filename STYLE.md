# Econ Lab style

A quiet economics notebook with diagrams that respond. The lesson is the product; decorative graphics must not compete with it.

## Tokens

| Role                      | Value     |
| ------------------------- | --------- |
| Paper                     | `#f8f7f1` |
| Diagram paper             | `#fffef9` |
| Main ink                  | `#252c26` |
| Muted text                | `#72786e` |
| Rules                     | `#dedfd5` |
| Behave / skin in the game | `#34715b` |
| Shirk / temptation        | `#8b659d` |
| Borrowing-limit accent    | `#b37327` |
| Action background         | `#244e42` |

Instrument Serif is used for editorial headings, DM Sans for body text and controls, and KaTeX for mathematics. Local fonts serve as fallbacks. Use tabular numerals for changing values. Favor thin rules, open spacing, restrained panels, and a small number of visual accents.

## Diagrams

- Every quantitative axis has a label and units. Every chart has a short “what to notice” caption.
- The incentive chart plots loan size against her payoff, in dollars. Green and purple meanings must stay fixed throughout the lesson.
- The two meter bars use the same scale. Do not independently normalize the bars: their relative sizes are the explanation.
- Current states are solid. The preceding state is faded/dashed. Keep lines and bars visible at zero and near boundaries.
- Unbounded values are labels and arrows, never enormous finite stand-ins or SVG coordinates set to Infinity.
- Use labels, line patterns, positions, and text as well as color.
- Qualitative evidence diagrams are explicitly schematic, with no fake numerical estimates. The perfect-market comparison has no invented dollar-valued optimum.
- Match equation terms to their associated diagram elements on hover, focus, or tap.
- Animations should connect old and new states, remain brief, and respect `prefers-reduced-motion`.
- Source tags should be quiet but legible, point to on-page citations, and distinguish derivations from original explanations.

## Layout and controls

Desktop: readable lesson text at left and a pinned, independently scrollable diagram at right. One numbered lesson step is active at a time. Mobile: the diagram becomes sticky above the text, capped in height so it does not consume the screen.

Use native labeled range inputs with keyboard support. Show values beside controls and disclose automatic adjustments. Do not put implementation details in the teaching flow. Keep shareable parameters in the address bar; do not persist the quiz score.
