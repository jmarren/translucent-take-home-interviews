# Component libraries for the Denial Dashboard

The app currently has **zero styling** — plain `<table>`, `<select>`, and `<h1>` elements, no CSS files, no design system. This is a survey of component libraries that would be a good fit if this grew past a take-home into a real internal tool, evaluated against what this project actually needs:

- Styled form controls (the department `<select>`)
- A nicer data table, ideally with **sortable columns**
- General layout/spacing primitives
- Must coexist peacefully with **Recharts** (charting, already chosen) and **Apollo Client** (data fetching, already chosen) — neither of these libraries have an opinion on UI components, so in practice this is a non-issue for every option below
- Reasonable bundle size and setup cost for a Create React App (CRA) project — no SSR, no framework-level styling integration to lean on
- Good TypeScript support, since the project is TS

Six libraries were researched, spanning three categories. Each has its own file with sourced details on documentation, real production adopters, bundle size, TypeScript support, setup weight, and licensing.

## At a glance

| Library | Category | Docs | Table sorting | License gotcha | Setup weight |
|---|---|---|---|---|---|
| [MUI (Material UI)](./mui.md) | Batteries-included | [mui.com](https://mui.com/material-ui/) | Free (single-column); multi-sort is Pro | Core is MIT; DataGrid multi-sort is MUI X Pro | Low |
| [Ant Design](./ant-design.md) | Batteries-included | [ant.design](https://ant.design/docs/react/introduce) | Free, built in | None — fully MIT | Moderate |
| [Chakra UI](./chakra-ui.md) | Batteries-included (lighter) | [chakra-ui.com](https://chakra-ui.com/docs) | No table component (build your own) | None — fully MIT | Low |
| [Radix UI Primitives](./radix-ui.md) | Headless/unstyled | [radix-ui.com](https://www.radix-ui.com/primitives/docs/overview/introduction) | N/A (no table primitive) | None — fully MIT | Very low (but you style everything) |
| [shadcn/ui](./shadcn-ui.md) | Tailwind + Radix, copy-paste | [ui.shadcn.com](https://ui.shadcn.com/docs) | No (pair with TanStack Table) | None — you own the code | Moderate (needs Tailwind) |
| [Tremor](./tremor.md) | Dashboard/charts (built on Recharts + Radix) | [tremor.so](https://www.tremor.so/) | Not a data-grid | None — fully OSS | Moderate (needs Tailwind) |

## Recommendation

For a project at this stage, two options stand out for different reasons:

- **MUI** is the pragmatic pick if the goal is to look polished quickly: no forced theme provider, drop `<Select>` and `<DataGrid>` into the existing unstyled markup incrementally, and single-column sorting is free. The only thing to watch is that DataGrid's multi-column sort and a few other advanced grid features sit behind MUI X Pro — irrelevant for a dashboard that just needs to sort by one column at a time (e.g. amount or date), which is very likely all this needs.
- **Radix UI Primitives** (optionally via **shadcn/ui** once Tailwind is set up) is the better long-term bet if the project is expected to grow into something with a more custom visual identity — Radix has the strongest sourced adopter list of anything researched (Vercel, Linear, Supabase) and imposes no global CSS or theme provider, but it means writing the actual styles yourself rather than getting them for free.

**Tremor** is worth calling out specifically because it's built directly on top of Recharts — adopting it for KPI/stat cards and layout would not introduce a second charting library, since its chart components wrap Recharts under the hood.

See each library's file for full sourcing, including which adopter claims are independently verified vs. first-party marketing claims.
