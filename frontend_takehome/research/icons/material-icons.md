# Material Icons (`@mui/icons-material`)

**Package:** `@mui/icons-material` (current major line 9.x); requires `@mui/material` + Emotion as peers
**Docs:** https://mui.com/material-ui/material-icons/ · npm: https://www.npmjs.com/package/@mui/icons-material

## Why it's ruled out here

This would have been the zero-setup default while this project used MUI as its component library — it no longer does (the project moved to Radix UI + TanStack Table; see [`../component-libraries/mui.md`](../component-libraries/mui.md) and [`../component-libraries/radix-ui.md`](../component-libraries/radix-ui.md)). Even independent of that, there's a real, nameable aesthetic mismatch worth flagging: Material Design's icon language — rounded corners, filled by default, soft/friendly geometry per Google's own Material Design guidelines — was built as the visual counterpart to Google's own soft-cornered component system. Rajdhani's defining traits (squared bowls, flat-cut stroke terminals, a character its own type designers call "technical or even futuristic") sit in real tension with that.

## License — a nuance worth stating precisely

The package's own `package.json` declares **MIT**. But the underlying Material Icons glyphs themselves are Google's, licensed **Apache-2.0** (https://github.com/google/material-design-icons/blob/master/LICENSE). MUI's own GitHub tracks this as an unresolved documentation gap — the package ships no Apache-2.0 attribution/LICENSE text for the upstream icon assets (mui/material-ui#47699). Fine for an internal dashboard, but "MIT" alone isn't the complete answer.

## Icon count

**2,100+ icons, in 5 style variants** (Filled, Outlined, Rounded, Two-Tone, Sharp) → 10,500+ total exported components. https://mui.com/material-ui/material-icons/

## Bundle size / tree-shaking

MUI's own bundle-size guide confirms named imports tree-shake correctly in **production** with modern bundlers (https://mui.com/material-ui/guides/minimizing-bundle-size/). The real cost is at **dev-server time**: MUI explicitly recommends deep-path imports (`import Delete from '@mui/icons-material/Delete'`) over named imports, because barrel imports can be "up to six times slower" for CRA/webpack dev rebuild speed — a developer-experience issue, not a production bundle problem (corroborated by mui/material-ui#10857 and vitejs/vite#8945).

## Component-library integration

Would have been native and first-party if MUI were still in use — icons are `SvgIcon`-based components designed to drop directly into `startIcon`/`endIcon` or `ListItemIcon`. Not directly relevant now that the project uses Radix UI instead.

## Adopters

No way to isolate "Material Icons adopters" specifically from general MUI usage — not a meaningful claim to make in isolation.
