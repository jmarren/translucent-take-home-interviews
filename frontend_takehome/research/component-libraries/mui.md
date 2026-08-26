# MUI (Material UI)

**Category:** Batteries-included component library
**Docs:** https://mui.com/material-ui/ (core components) · https://mui.com/x/react-data-grid/ (DataGrid)

## Why it could fit here

MUI gives you a styled `<Select>`, a full `<DataGrid>` with built-in single-column sorting, and layout primitives (`Grid`, `Stack`, `Box`) — covering every stated need (filter dropdown, sortable table, spacing) out of the box. It doesn't require a full theme/provider setup to start using: components render with a sensible default theme, so it can be dropped into specific parts of an already-unstyled app without a full rewrite.

## Table sorting — the free vs. Pro question, answered

This is a common point of confusion, so it's worth stating precisely, per the official docs:

- **Single-column sorting is free**, part of the MIT-licensed `@mui/x-data-grid` Community package, and **enabled by default** — clicking a column header sorts it, no extra config.
  Source: https://mui.com/x/react-data-grid/sorting/
- **Only multi-column sorting** (sorting by more than one column simultaneously) requires **MUI X Pro**. Direct quote from the docs: *"To use multi-sorting, you need to upgrade to Pro plan or above."*
  Source: https://mui.com/x/introduction/licensing/ (Pro tier adds "multi-filtering, multi-sorting, column resizing, and column pinning")

**For this dashboard** (sort by one column — e.g. amount or date — at a time), the free Community DataGrid is sufficient. No Pro license needed.

## Adopters

No confirmed named enterprise case studies exist on MUI's own site — a related GitHub discussion ("Who's using Material UI?", mui/material-ui#22426) is crowdsourced and inconclusive. Wappalyzer's automated technology-detection page lists Docker, Samsung, Okta, Shutterstock, and BambooHR as sites it has detected using MUI in production:
https://www.wappalyzer.com/technologies/ui-frameworks/mui/

This is traffic/tech-detection evidence, not an official case study — treat it as "detected in production," not "confirmed customer."

## Bundle size

Historically on the heavier side for a full-featured library. A GitHub optimization issue cites roughly 300KB+ min+gzip when importing broadly from `@mui/material`; tree-shakes reasonably well with named imports and a modern bundler, but it's not a lightweight option. Requires `@emotion/react` and `@emotion/styled` as peer dependencies.

## TypeScript

Excellent — MUI is written in TypeScript, first-class type support throughout.

## Works alongside Recharts / Apollo Client

No functional conflict — both are UI-component-agnostic. The one documented conflict pattern to be aware of (not relevant unless Tailwind is added later) is between MUI's `CssBaseline` global reset and Tailwind's Preflight reset fighting each other (e.g. transparent buttons) — see tailwindlabs/tailwindcss discussion #11290. Not a concern if Tailwind isn't introduced.

## Setup weight

Low-to-moderate. `ThemeProvider` is **optional** — confirmed in MUI's docs, components render with a built-in default theme without wrapping the app. This makes incremental adoption (e.g., just swap the department `<select>` for MUI's `<Select>`, or the table for `<DataGrid>`) realistic without a full app rewrite.

## License

`@mui/material` (core components) and the **Community edition of `@mui/x-data-grid`** are MIT/free, including single-column sorting. Only the Pro/Premium tiers of MUI X are paywalled, and only for the advanced grid features listed above.
