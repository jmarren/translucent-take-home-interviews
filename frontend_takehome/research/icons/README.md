# Icon libraries for the Denial Dashboard

The dashboard's visual identity is a muted, low-chroma palette (greys, olive, dark slate green, beige) paired with **Rajdhani**, a squared, condensed display font. Google Fonts' own specimen and Rajdhani's source repo describe it as having straight-sided bowls, flat-cut stroke terminals, and a character the type designers themselves call "technical or even futuristic" — a meaningfully different visual grammar from a soft, rounded icon system.

We need icons for: sidebar nav items (Reason Breakdown, Payer Breakdown, Trends Over Time, Denial Records), the department filter, and general UI chrome (loading/error states, sort direction).

Six icon sets were researched, with the same sourcing standard as the [component library research](../component-libraries/): every claim is either a verified official source or explicitly flagged as unverified.

## At a glance

| Library | Package | Icon count | License | Style |
|---|---|---|---|---|
| [Lucide](./lucide.md) | `lucide-react` | ~1,500–1,780 | ISC (ex-Feather icons: MIT) | 2px stroke, geometric line icons |
| [Phosphor Icons](./phosphor.md) | `@phosphor-icons/react` | ~1,200, ×6 weights | MIT | Consistent geometry across weight variants |
| [Tabler Icons](./tabler.md) | `@tabler/icons-react` | ~6,184 | MIT | 2px stroke, crisp outline icons |
| [Heroicons](./heroicons.md) | `@heroicons/react` | 316 | MIT | Soft, rounded, Tailwind-house style |
| [Material Icons](./material-icons.md) | `@mui/icons-material` | 2,100+ ×5 styles | MIT (icons: Apache-2.0 upstream) | Rounded, filled, Material Design |
| [Font Awesome](./font-awesome.md) | `@fortawesome/react-fontawesome` | ~2,000 free | Icons: CC BY 4.0, Webfonts: OFL, Code: MIT | Broad general-purpose catalog |

## Recommendation: Lucide

**Lucide** is the best fit, for a reason grounded in what's already been built rather than aesthetic preference alone: this dashboard now uses **Radix UI primitives** for its components (see [`../component-libraries/radix-ui.md`](../component-libraries/radix-ui.md)), and Lucide is the default icon set of **shadcn/ui**, the most prominent project built directly on Radix — the two ecosystems already assume each other. Beyond that pairing:

- Lucide's 2px-stroke, uniform-weight line icons read at the same visual weight as text rather than competing with it as filled shapes do — a better match for Rajdhani's technical, squared character than a rounded/filled system.
- It's genuinely tree-shakeable (confirmed in Lucide's own docs), ISC/MIT licensed, and requires no wrapper component — it drops in as plain SVG React components.

**Phosphor Icons** is the strongest runner-up, specifically for its six-weight system (thin/light/regular/bold/fill/duotone) — using a lighter weight for inactive sidebar tabs and a bolder or filled weight for the active tab is a real, useful capability none of the other sets offer natively. It loses out to Lucide only on adoption evidence: a claim that Meta, Discord, Figma, and Anthropic use Phosphor could not be verified against Phosphor's own site and should not be repeated as fact.

**Ruled out:**
- **Material Icons** (`@mui/icons-material`) is the zero-setup default if this project still used MUI, but it no longer does — and its rounded, filled Material Design language was built as the visual counterpart to Google's own soft-cornered components, which is now a real, nameable mismatch against Rajdhani's squared, flat-terminal letterforms.
- **Font Awesome** has the largest install base by far, but its free tier's default style is explicitly described by Font Awesome itself as having "a smooth, rounded vibe"; the more angular **Sharp** style that would suit this project is Pro-only (paid). It also ships a three-license split (CC BY 4.0 / OFL / MIT, all requiring attribution) and renders through its own wrapper component rather than plain SVG, which has reported sizing/viewBox quirks.
- **Heroicons** is well-built but curated specifically for Tailwind-ecosystem product UI (this project doesn't use Tailwind) and has the smallest icon count (316) of any set researched — a real constraint against needs like a payer/insurance icon or a trends/time-series icon.
- **Tabler Icons** has the largest count (6,184) and is worth a second look if Lucide or Phosphor lack a specific glyph, but its pre-v3 tree-shaking bugs (now largely resolved) and sensitivity to a project's own Babel/bundler config are a caution worth checking with a bundle analyzer before relying on it.

See each library's file for full sourcing, including bundle-size/tree-shaking behavior and exactly which adopter claims are verified vs. unverifiable.
