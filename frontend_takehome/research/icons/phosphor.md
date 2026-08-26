# Phosphor Icons

**Package:** `@phosphor-icons/react`
**Docs/site:** https://phosphoricons.com · GitHub: https://github.com/phosphor-icons/react

## Why it fits here

Phosphor's standout feature is a **six-weight system** (thin, light, regular, bold, fill, duotone) available via a single `weight` prop on the same icon component — not separate icon sets per weight. This is a genuinely useful, sourced capability none of the other researched libraries offer natively: a lighter weight for inactive sidebar tabs and a bolder or filled weight for the active tab, all from one import per icon.

## License

MIT, confirmed via the repo. https://github.com/phosphor-icons/react

## Icon count

~1,200+ unique icons, each rendering across the six weights described above.

## Bundle size / tree-shaking

Supported for production bundles. The repo notes the same category of caveat as several other sets researched: barrel-style imports can slow down **dev-time** compilation, which is a developer-experience concern, not a production bundle-size problem.

## MUI/component-library integration

Plain forwardRef SVG components, usable directly as a `ReactNode` wherever an icon prop is expected — no wrapper required.

## Adopters — caution

A claim that Meta, Discord, Figma, and Anthropic use Phosphor appeared in search results, but it traces back to third-party aggregator sites (zoftwarehub, mainstream.dev), not to Phosphor's own site — a direct fetch of phosphoricons.com did not corroborate it. **This claim should not be repeated as fact.** The only solid adoption evidence found is npm download volume (in the millions per week) and general GitHub activity — real signals of popularity, but not named-customer verification.
