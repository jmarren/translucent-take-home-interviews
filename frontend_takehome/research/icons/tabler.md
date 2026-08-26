# Tabler Icons

**Package:** `@tabler/icons-react`
**Docs/site:** https://tabler.io/icons · GitHub: https://github.com/tabler/tabler-icons

## Why it fits here

Tabler is a 2px-stroke, 24×24-grid outline icon system — visually similar to Lucide's line-icon approach, but with by far the largest catalog of any set researched, useful if a specific glyph (e.g. a particular medical or insurance concept) isn't covered elsewhere.

## License

MIT, confirmed via the repo's LICENSE file: https://github.com/tabler/tabler-icons/blob/main/LICENSE ("MIT License, Copyright (c) 2020-2026 Paweł Kuna").

## Icon count

**~6,184 total** — the largest set researched: roughly 5,130 outline icons plus ~1,054 filled variants. https://tabler.io/icons

## Bundle size / tree-shaking — a real caveat

Pre-v3 builds of this package genuinely did not tree-shake well, with documented GitHub issues describing multi-megabyte bundle bloat before the package shipped per-icon ESM files. Current versions declare `"sideEffects": false` and ship per-icon ESM modules, which tree-shakes correctly with Vite, webpack 5, and Next.js — but a separate, real failure mode is a project's own Babel configuration transpiling everything to CommonJS, which defeats tree-shaking regardless of the icon library. **Recommendation: verify with a bundle analyzer in this specific CRA setup before relying on it**, rather than assuming it "just works."

## MUI/component-library integration

Plain SVG components typed as `ReactNode`, same drop-in pattern as Lucide — no wrapper needed.

## Adopters

~21K+ GitHub stars. shadcn/ui supports Tabler as a configurable alternative icon set (alongside Lucide, Phosphor, Hugeicons, and Remix Icon) per shadcn's own Figma kit and community discussion threads — a real but secondary adoption signal compared to Lucide's status as shadcn/ui's actual default. No independently verified named production case studies were found beyond that.
