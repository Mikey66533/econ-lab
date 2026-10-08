# Model library

| Model                                  | Source lecture                                                                              | Status      |
| -------------------------------------- | ------------------------------------------------------------------------------------------- | ----------- |
| Holmström–Tirole                       | GU4710, Slides 2: Leverage Constraints, printed pp. 2–9, 11, 13; Slides 1, p. 3 for context | Live        |
| Leverage amplifies losses              | Slides 2, printed pp. 13–16                                                                 | Coming soon |
| Solow growth model                     | Lecture source to be supplied                                                               | Coming soon |
| Entrepreneurship and financial markets | Slides 1, printed pp. 1–3                                                                   | Coming soon |
| Allocation of capital                  | Slides 1: Lending to Firms                                                                  | Coming soon |
| Difference-in-differences              | Slides 1: Lending to Firms                                                                  | Coming soon |

Statuses are implemented in each model folder's metadata, which is automatically discovered at development/build time.

## Sources for model 01

- User-supplied GU4710 course PDFs, kept locally in ignored `sources-private/`. They are not published or committed.
- Hurst, Erik, and Annamaria Lusardi (2004). _Liquidity Constraints, Household Wealth, and Entrepreneurship._ JPE 112(2):319–347. https://doi.org/10.1086/381478
- Chaney, Thomas, David Sraer, and David Thesmar (2012). _The Collateral Channel: How Real Estate Shocks Affect Corporate Investment._ AER 102(6):2381–2409. https://doi.org/10.1257/aer.102.6.2381
- Holmström, Bengt, and Jean Tirole (1997). _Financial Intermediation, Loanable Funds, and the Real Sector._ QJE 112(3):663–691. https://doi.org/10.1162/003355397555316

## Original additions

1. The names **honesty premium** and **temptation per borrowed dollar**. “Skin in the game” already appears in the lecture.
2. The honesty-meter and per-dollar explanations, including the two opposing pulls and their visual encoding.
3. Default R = 1.6 and B = 1.0, selected to reproduce the lecture's $80k equity, $120k loan, $200k asset example. The initial exploratory loan is $80k.
4. All diagram artwork, the qualitative wealth schematic, and the separately labeled perfect-market schematic. No figure image from the slides is reused.
5. The narrative, short captions, algebra walkthroughs, misconception notes, conceptual assumption illustrations, and boundary-case demonstrations.
6. The four prediction scenarios, answer options, and explanations; the question about the direction of leverage changes is motivated by Slides 2, p. 8.
7. The perks/pet-project, mortgage down-payment, founder-investment, and collateral analogies, each explicitly labeled an example.
8. The interface, chosen slider ranges and increments, loan-exploration range, before-state overlays, URL sharing, and session scoring.

## Printed slide → PDF position

Slides 1: printed p. 3 → PDF page 5.

Slides 2: p. 2 → PDF page 3; p. 3 → page 4; pp. 4–9 → pages 6–11; p. 11 → page 14; p. 13 → page 17. Section-title pages create the offsets. `sources.ts` has the extended mapping.
