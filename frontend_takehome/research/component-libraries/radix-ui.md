# Radix UI Primitives

**Category:** Headless/unstyled primitives
**Docs:** https://www.radix-ui.com/primitives/docs/overview/introduction

## Why it could fit here

Radix provides unstyled, fully accessible behavior primitives — a `<Select>` primitive handles all the keyboard navigation, focus management, and ARIA semantics, while you supply the actual CSS. No table/data-grid primitive exists, so it wouldn't solve the sortable-table need directly (you'd pair it with something like TanStack Table for the logic and style the markup yourself). Best fit for a project that wants full visual control rather than an off-the-shelf look.

## Adopters — the strongest sourced evidence of any library researched

Radix's own case-studies page, confirmed by direct fetch, lists real, named production users with individual write-ups:
https://www.radix-ui.com/primitives/case-studies

Confirmed adopters include **Vercel** (dedicated case study: https://www.radix-ui.com/primitives/case-studies/vercel), **Linear**, **Supabase**, **CodeSandbox**, **Node.js**, and **Liveblocks**. This is a first-party source, but with individually named, credible, external companies rather than crowdsourced speculation or a marketing testimonial list — the strongest adopter verification found across all six libraries in this survey.

## Bundle size

Each primitive (e.g. `@radix-ui/react-select`, `@radix-ui/react-dropdown-menu`) ships as its own separate package, so it's genuinely tree-shakeable at the primitive level — installing just a Select doesn't pull in an entire design system. Good fit for adding one or two styled controls without a large dependency footprint.

## TypeScript

Excellent — designed TypeScript-first, fully typed.

## Works alongside Recharts / Apollo Client

No conflict — pure behavior/accessibility primitives with no opinion on data or charts.

## Setup weight

Very low for incremental adoption: no theme provider, no global CSS reset imposed on the app. It drops cleanly into an unstyled CRA app. The trade-off is that you must write the actual visual styles yourself (plain CSS, CSS-in-JS, or Tailwind) — more upfront work than a batteries-included library for a short project, but it scales cleanly if the project grows and needs a custom look.

## License

MIT, fully free, no paywalled tier.

## Caveat

Radix UI was acquired by WorkOS. Some community commentary (found via search, not independently verified against the project's own commit history) suggests reduced core-team investment since the acquisition. It remains actively used and is the foundation that [shadcn/ui](./shadcn-ui.md) is built on top of.
