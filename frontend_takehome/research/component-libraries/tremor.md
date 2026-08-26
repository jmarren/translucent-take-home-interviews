# Tremor

**Category:** Dashboard/chart-focused component library, built on Recharts + Radix UI (Tailwind-styled)
**Docs:** https://www.tremor.so/ · https://npm.tremor.so/

## Why it could fit here — it's built directly on top of Recharts

This is the most directly relevant library in the survey because of one specific fact, stated verbatim on Tremor's own homepage: **"Built on Recharts and Radix UI, Tremor provides the essentials for production-ready UI."**

This means Tremor's chart components (bar charts, area charts, KPI/stat cards, etc.) are wrappers around Recharts, not a competing charting library. Adopting Tremor for the layout/stat-card side of the dashboard would **not** introduce a second charting dependency alongside the existing Recharts-based `DenialChart` — it would sit on the same underlying rendering. It's best positioned as a complement for KPI cards, layout, and dashboard chrome, rather than a data-table replacement (see "Table/sorting" below).

## Adopters

Acquired by Vercel in 2024, confirmed via Vercel's own blog post: https://vercel.com/blog/vercel-acquires-tremor

Homepage testimonials (confirmed via direct fetch of tremor.so) include Guillermo Rauch (CEO, Vercel) and mentions of usage at Stripe, Cal.com, and Tinybird. These are first-party testimonial-style endorsements on Tremor's own site, not independent case studies — treat them as promotional but from a credible, named source (Vercel's own CEO), rather than anonymous.

## Bundle size

Copy-paste/Tailwind-based distribution similar to shadcn/ui ("Tremor Raw") — bundle impact is whatever components are copied in, plus Recharts and Radix UI as underlying dependencies. Since Recharts is **already a dependency of this project**, that overlap is a real cost-saving compared to introducing Tremor into a project that didn't already use Recharts.

## TypeScript

Full TypeScript support.

## Works alongside Recharts / Apollo Client

Explicitly and unusually well for the Recharts side — see above, it's built on Recharts rather than being an alternative to it. No conflict with Apollo Client either.

## Setup weight

Requires Tailwind CSS configured in the project first (same one-time cost noted for shadcn/ui — CRA has no built-in Tailwind support). Once Tailwind is set up, Tremor components are copied in incrementally like shadcn/ui.

## License

Free and fully open source. Vercel made both Tremor and "Tremor Blocks" free/OSS after the acquisition, per the Vercel blog post linked above.

## Table/sorting

Tremor includes basic table components, but they are not sorting-focused and Tremor is not positioned as a data-grid competitor to MUI's DataGrid or Ant Design's Table. It's a better fit as a charts/KPI-card/layout complement than as the answer to the "sortable table" need — that need is still better served by MUI, Ant Design, or shadcn/ui + TanStack Table.
