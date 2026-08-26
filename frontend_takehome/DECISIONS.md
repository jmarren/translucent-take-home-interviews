# Decisions

## Approach

- **Server-side filtering**: the `denials` query now takes an optional `department` argument, resolved in `server.js` by filtering the in-memory dataset. The client passes the selected department as an Apollo query variable, so Apollo automatically issues a new request (and caches each department's result) when the filter changes, instead of over-fetching all 120 rows and filtering client-side.
- **Chart dimension**: `DenialChart` aggregates by denial `reason` (sum of `amount`), not `department`. Charting by department would go degenerate once the department filter narrows the dataset to one department — every bar but one would vanish. Aggregating by reason stays meaningful in both states, and answers a more useful question when filtered ("why is Cardiology being denied?").
- **Hardcoded department list**: the filter's option list comes from a small constant (`src/types.ts`), not from the query results, so the dropdown doesn't shrink to whatever department happens to be selected.
- **Component library (Radix UI + TanStack Table)**: per the survey in `research/component-libraries/`, the department filter uses `@radix-ui/react-select` and the denials table uses `@tanstack/react-table` for sorting — both headless/unstyled, so the existing custom visual identity (palette, Rajdhani font, layered sidebar) didn't need to be rebuilt around someone else's design system. The cost is that all visual styling for these controls (`index.css`) had to be written by hand rather than coming for free.
- **Period filter is client-side, anchored to the data's own latest date**: `src/periods.ts` filters the already-fetched denials by date range in the browser rather than adding a second GraphQL argument, since the "current date" concept only needs to be relative to what's in the dataset. "Today" for period math (`this month`, `this quarter`, etc.) is the most recent denial's date, not the real calendar date — the mock dataset ends mid-2025, so anchoring to the real system clock would make every period option resolve to zero results.

## Performance

- Filtering server-side means payload size and render work scale with the filtered result set, not the full dataset — matters more as denial volume grows well past 120 rows.
- Chart aggregation (grouping by `reason`) is wrapped in `useMemo`, keyed on `data`, so it isn't recomputed on unrelated re-renders.
- `useQuery`'s `previousData` is rendered alongside `data` while a filter change is in flight, so switching departments doesn't blank the table/chart back to a loading state on every selection — avoids a jarring flash/layout jump, at the cost of a brief moment showing stale data during refetch (acceptable trade for a filter that resolves in milliseconds against the mock server).
- `ResponsiveContainer` (Recharts) handles resize without manual window-resize listeners or fixed pixel dimensions.

## Accessibility

- The department filter (a Radix `Select`) has a properly associated `<label htmlFor>` plus an explicit `aria-label`, and Radix handles the underlying keyboard navigation/focus management/ARIA roles for the listbox itself.
- The chart is wrapped in a `<section aria-label="Denial breakdown chart">` with a real, visible `<h2>` heading (not just a styled div), so its purpose is announced to assistive tech, not just implied visually.
- Recharts renders plain SVG with limited built-in ARIA semantics in this version (2.6.2) — in particular, tooltips are mouse/focus-triggered and not reliably read by screen readers. The existing denials table is left in place alongside the chart and exposes the same underlying data in a natively accessible, keyboard-navigable form, so no information is chart-only.
- The error state uses `role="alert"` for assertive announcement of query failures.

## Trade-offs / things I'd revisit with more time

- No visual styling was set up in the original project; I left it functionally plain rather than introducing a styling system, to keep the diff focused on the four required tasks.
- A loading skeleton and empty-state messaging for zero-result filters would be natural next steps for product polish but weren't required by the brief.
