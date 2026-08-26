# shadcn/ui

**Category:** Tailwind + Radix UI, copy-paste component distribution (not a traditional npm dependency)
**Docs:** https://ui.shadcn.com/docs

## Why it could fit here

shadcn/ui isn't installed as a library in the usual sense — its CLI generates component source files (built on Radix UI primitives, styled with Tailwind) directly into your own codebase, which you then own and can freely modify. This is attractive if the project is expected to grow a distinctive visual identity: you get Radix's accessibility/behavior for free plus pre-written Tailwind styling as a starting point, without being locked into a library's own theming system.

## Adopters

shadcn/ui's own docs site states (confirmed via direct fetch of https://ui.shadcn.com/docs): **"Trusted by OpenAI, Sonos, Adobe, and more."** This is a first-party claim from the project's own site, not an independently verified case study — treat it as a project-asserted claim rather than confirmed by the named companies themselves, though it is a direct primary-source statement rather than a scraped inference.

## Bundle size

Not applicable in the traditional sense — there's no shadcn/ui package weighing anything, since components are generated into your own source tree. Bundle impact is exactly the Radix UI primitives and Tailwind-generated CSS for whatever components you actually copy in — no extra library overhead beyond those two.

## TypeScript

Full TypeScript support, since you own and can directly read/edit the generated component source.

## Works alongside Recharts / Apollo Client

No conflict.

## Setup weight

Requires **Tailwind CSS** to be configured in the project first. CRA does not ship with Tailwind, so this is a one-time (well-documented, but nontrivial) PostCSS/Tailwind config step before the first shadcn component can be added. Once Tailwind exists, adding components is incremental — the CLI adds one file at a time, and you edit it directly. For a strict 1–2 hour scope this is more upfront ceremony than Radix alone, Chakra, or MUI; it pays off more over a longer project lifespan.

## License

MIT, and since it's not a distributed package at all, there's no license/tier concern beyond the Tailwind CSS and Radix UI dependencies it's built on (both MIT/OSS).

## Table sorting

shadcn/ui's `Table` component is a styled wrapper around a plain `<table>` — it does not include sorting logic. The standard pairing (widely documented in the shadcn/ui ecosystem) is **TanStack Table** for the sorting/filtering logic, styled with shadcn's table components — both free and MIT-licensed.
