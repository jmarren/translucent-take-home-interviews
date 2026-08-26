# Other options considered but not written up in full

Two additional headless libraries came up during research as alternatives to Radix UI. Neither displaced Radix as the recommended headless pick, for the reasons below.

## Headless UI (Tailwind Labs)

The most obvious alternative to Radix in the "headless primitives" category, since it's maintained by Tailwind Labs and pairs naturally with Tailwind. A secondary source found via search claims it has not shipped a commit since April 2026, suggesting stalled maintenance. **This was not independently verified against the project's own GitHub commit history** — it came from a blog-style aggregator, not GitHub directly — so it should be spot-checked before being treated as settled fact. It's the reason Radix is recommended over Headless UI in this survey, but with that caveat attached.

## React Aria Components (Adobe)

Adobe's headless library, with a strong accessibility pedigree — it's dogfooded internally for Adobe Spectrum (see https://react-spectrum.adobe.com and the adobe/react-spectrum GitHub repo). The disqualifying factor found during research is a documented, maintainer-acknowledged tree-shaking problem: importing a single component like `Button` has been reported to pull in roughly 175KB before optimization, due to barrel-file exports. This is sourced from real GitHub discussions, not speculation:

- adobe/react-spectrum discussions #5636
- adobe/react-spectrum discussions #6734
- vercel/next.js issue #60246

For a project where bundle size is a stated concern, this tree-shaking issue is a real, documented downside relative to Radix's per-primitive package structure.

## CRA-specific note

None of the six libraries in the main survey have any CRA-specific incompatibility — they're all plain React libraries with no framework assumptions. The one real setup-weight differentiator across the whole survey is **Tailwind CSS itself**: shadcn/ui and Tremor both require it, and CRA needs manual PostCSS configuration to add Tailwind (it isn't included out of the box). MUI, Ant Design, Chakra UI, and Radix UI all need no CSS build-tool changes at all.
