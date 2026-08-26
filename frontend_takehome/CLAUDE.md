# Project conventions

## Prefer larger, nested objects over flattened parameter lists

When a function, hook, or memo needs several related values, group them
into the object a hook already returns (or a small named interface)
instead of destructuring everything into individual parameters and
re-listing those same names at every call site.

**Avoid:**
```ts
export interface CommandContext {
  activeTab: string;
  department: string;
  period: PeriodId;
  font: string;
  paletteLabel: string;
  radius: number;
  navigateToTab: (id: string) => void;
  setDepartment: (value: string) => void;
  setPeriod: (value: PeriodId) => void;
  setFont: (value: string) => void;
  setPalette: (value: Palette) => void;
  setRadius: (value: number) => void;
  close: () => void;
}
```

**Prefer:**
```ts
export interface CommandContext {
  theme: ThemePreferences;
  dashboardFilters: DashboardFilters;
  activeTab: string;
  navigateToTab: (id: string) => void;
  close: () => void;
}
```

Why: `useThemePreferences()` and `useDashboardFilters()` already return
cohesive objects. Flattening them out into a wider parameter list or
context type means every new consumer has to re-declare the same set of
names, and adding or removing a field means touching every place that
lists them out by hand. Passing the object through as-is keeps one
place (the hook's return type) as the source of truth for that group of
fields.

This applies to function parameters, `useMemo`/`useCallback` dependency
building, React Context/Outlet context shapes, and props objects alike
— see `src/components/Layout.tsx` (`LayoutState`) and `src/commands.ts`
(`CommandContext`) for the pattern in practice.

## No dead or commented-out code

Don't leave commented-out code (old type definitions, old function
parameters, abandoned approaches) in the codebase — delete it. If it's
worth keeping as context, put the reasoning in a real comment or in
`DECISIONS.md`, not as inert code.

## `const` over `let`

Default to `const`. Only use `let` for a binding that is actually
reassigned after its initial declaration.

## Double quotes

Use double quotes for strings and import paths, matching the rest of
the codebase — not single quotes.
