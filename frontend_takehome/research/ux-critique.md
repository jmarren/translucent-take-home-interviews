# UX critique: current dashboard design

Findings from a research/critique pass on the dashboard as of branch `exhibit-cards-on-current-layout`, grounded in the actual codebase (not generic advice). Standard dashboard-design references consulted: F-pattern scanning (top-left/top-center gets primary attention first) and conventional KPI-panel placement in admin/analytics dashboards.

## What's working well

- **Accessibility discipline is genuinely good and consistent**: `role="alert"` on errors, `aria-label`/`aria-current` on sidebar tabs, `<section aria-label>` + a real `<h2>` on every chart, and a deliberate "never rely on tooltip alone" pattern carried from `DenialChart` into `DepartmentPieChart` (both have direct data labels/captions). Unusually thorough for a project this size, and `DECISIONS.md` documents the reasoning well.
- **Chart dimension choices are well-reasoned** (reason for bar chart, department for pie chart) and explicitly address the "degenerate filter" failure mode (charting by the same dimension you filter on collapses to one trivial bar/slice) — real domain thinking, not just decoration.
- **Server-side department filtering + Apollo's `previousData`** avoids a loading-flash on every filter change — a legitimate, non-obvious UX/perf choice.
- **The `ComingSoon` component** reuses one component with a per-tab description of *what* is coming, not just "Coming Soon" — previews value rather than being a dead end.

## Issues, prioritized (most impactful first)

1. **Information hierarchy is inverted.** The four headline KPI numbers (Total Denied, Denial Count, Average Denial, Top Reason) sit in a narrow column to the right of/after the two chart cards (`Dashboard.tsx`'s `.reason-breakdown-layout`), competing for space against 800px+432px of chart cards. Per standard scanning patterns, the "orient me in 2 seconds" numbers should lead the page, not trail it — a viewer's eye hits the bar chart before the number that answers "how bad is this."

2. **Card treatments have drifted apart across iterations.** The bar chart card is forced to `width: 800px` (`.charts-row > .reason-chart-card`) while the pie chart gets the generic `432px` (`.charts-row > section`); both are locked to a shared fixed `height: 576px`, leaving the pie card with a lot of unused vertical space around its `aspect={1}` pie. The trend sparkline card (in `SummaryCards.tsx`) duplicates the same border/radius/shadow recipe as `.charts-row > section` as a second hand-copied declaration rather than sharing a class. There was also dead CSS (`.chart-card-tag`) left over from an "Exhibit A/B" tag treatment that was tried and then rolled back — worth checking it's actually been removed.

3. **A hardcoded slate blue (`#5b7fa6`) bypasses the palette, defined independently in three places**: the bar chart's fill (`DenialChart.tsx`), the trend line/gradient (`SummaryCards.tsx`), and coincidentally the Orthopedics pie slice (`DepartmentPieChart.tsx`'s `DEPARTMENT_COLORS`). It's the single most saturated/distinct color on an otherwise deliberately muted, low-chroma page, and isn't in the `:root` palette despite being visually prominent. If it's meant to be a real "accent" color it belongs in `:root`; if it's coincidental reuse, the Orthopedics-slice/trend-line color match could misleadingly suggest a relationship that isn't intended.

4. **(Fixed 2026-08-25) Filter bar had no visible labels.** `LabeledSelect` only set `aria-label` on the Radix trigger — nothing a sighted user could read distinguished the department dropdown from the period dropdown before opening one. `DECISIONS.md` claimed a `<label htmlFor>` that didn't actually exist in the code. Fixed by adding a real, visible `<label>` above each filter's trigger.

5. **Sidebar's three "coming soon" tabs are visually identical in weight to the one working tab.** Nothing in `Sidebar.tsx` distinguishes not-yet-implemented nav items until after a click reveals the `ComingSoon` placeholder. A cheap fix: a small "Soon" badge or reduced-opacity treatment so the sidebar communicates scope up front instead of via dead-end clicks.

6. **The denials-table section is a third, differently-recipe'd "card" style** — a translucent RGBA silver wash (`background-color: rgba(197, 197, 197, 0.2)` in `.denial-records-section`) — alongside the bordered/shadowed white chart cards and the dark filled summary panel. Three visually distinct container treatments for what are conceptually the same kind of "grouped content block"; worth converging on 1-2 patterns.

7. **Minor**: worth a visual check (not confirmed from code alone) of whether the pie chart's legend/percentage labels have enough room inside its fixed `576px` card height without clipping or overlapping, since nothing in the CSS accounts for legend height dynamically.
