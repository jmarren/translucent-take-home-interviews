# Lucide

**Package:** `lucide-react`
**Docs/site:** https://lucide.dev · GitHub: https://github.com/lucide-icons/lucide

## Why it fits here

Lucide is a 2px-stroke, geometric line-icon system on a 24×24 canvas. Stroked icons read at the same visual weight as surrounding text rather than competing with it as filled shapes do, which suits Rajdhani's squared, technical letterforms better than a rounded/filled icon language would.

## License

**ISC** for the core project, confirmed via the repo's LICENSE file: https://github.com/lucide-icons/lucide/blob/main/LICENSE. Lucide is an actively maintained fork of Feather Icons; the Feather-derived subset of icons separately carries **MIT** attribution to Cole Bemis.

## Icon count

Roughly 1,500–1,780 icons depending on snapshot date — it's actively growing. The live, authoritative count is best checked directly at https://lucide.dev.

## Bundle size / tree-shaking

Explicitly documented as tree-shakeable: *"Only the icons you import are included in your final bundle."* — https://lucide.dev/guide/packages/lucide-react. It's ESM-native.

## MUI/component-library integration

Not relevant to this project's current stack (Radix UI, not MUI), but for reference: Lucide icons are plain SVG React components, so they'd drop into any component library's `startIcon`/`endIcon`-style prop without a wrapper. In this project they can be used directly inside the sidebar's `<button>` elements or the Radix `Select.Icon` slot.

## Adopters

~24K GitHub stars (https://github.com/lucide-icons/lucide) and high weekly npm download volume. The strongest concrete adoption signal: **shadcn/ui ships Lucide as its default icon set** throughout its own documentation — a meaningful signal given shadcn/ui's popularity and its shared foundation (Radix UI primitives) with this project's component choices, though it isn't an independent "named enterprise customer" case study.
