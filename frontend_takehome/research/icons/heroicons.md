# Heroicons

**Package:** `@heroicons/react`
**Docs/site:** https://heroicons.com · GitHub: https://github.com/tailwindlabs/heroicons

## Why it's a weaker fit here

Heroicons is hand-crafted by **Tailwind Labs** specifically for Tailwind-ecosystem product UI — soft, slightly rounded, "friendly SaaS" geometry. This project doesn't use Tailwind, and while the mismatch against Rajdhani's squared, technical letterforms is less pronounced than Material Icons' fully rounded/filled style, it's a similar tension in the same direction.

## License

MIT. https://github.com/tailwindlabs/heroicons

## Icon count

**316 icons** (per the official site: https://heroicons.com) across four variants: Outline (24px, 1.5px stroke), Solid (24px), Mini (20px), and Micro (16px). The project explicitly states it is not accepting new-icon contributions — it's a curated, closed set, and the smallest icon count of any library researched. That's a real practical constraint for this dashboard's more specific iconography needs (e.g. a payer/insurance concept, a trends/time-series concept).

## Bundle size / tree-shaking

One file per icon component per style subpath (e.g. `@heroicons/react/24/outline`) — structurally clean for tree-shaking.

## MUI/component-library integration

Plain SVG components, drop-in, no wrapper.

## Adopters

The weakest adoption evidence tier of any library researched: a StackShare page lists minor, unverifiable company names that should not be cited as confirmed adopters. The real, verifiable backing is institutional rather than third-party: Heroicons is the default icon set of **Tailwind UI / Tailwind Plus**, Tailwind Labs' own commercial product — a single-vendor endorsement, not independent adoption evidence.
