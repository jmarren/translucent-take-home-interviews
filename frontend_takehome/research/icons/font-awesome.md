# Font Awesome

**Package:** `@fortawesome/react-fontawesome`
**Docs/site:** https://fontawesome.com

## Why it's ruled out here

Font Awesome has by far the largest real-world install base of any icon set — but its free tier's default visual style is explicitly described by Font Awesome itself as having "a smooth, rounded vibe," and the more angular **Sharp** style that would actually suit this project's technical/industrial identity is **Pro-only** (a paid upgrade): https://blog.fontawesome.com/introducing-font-awesome-sharp/. It also carries more licensing overhead than the alternatives, and its integration path has real, reported quirks.

## License — a genuine three-way split

Confirmed via Font Awesome's own license page (https://fontawesome.com/v4/license/):

- **Icons:** CC BY 4.0 (requires attribution)
- **Webfonts:** SIL OFL 1.1
- **Code:** MIT

All three require attribution in some form. The Pro tier is a separate paid product that unlocks Light, Thin, Duotone, and Sharp styles.

## Icon count

The free tier includes roughly 2,000 icons across Solid, Regular, and Brands styles.

## Bundle size / tree-shaking

Per-icon imports tree-shake fine (https://fontawesome.com/docs/apis/javascript/tree-shaking), independently corroborated by a case study showing a bundle drop from 657KB to 33.3KB gzipped after switching away from the bulk-import pattern. The real risk is that the common tutorial pattern (`library.add(fas)`, importing the entire icon family at once) **defeats tree-shaking**, and this is still the default guidance in a lot of community content — a genuine footgun. MUI's own icon documentation steers users away from Font Awesome's class-based integration specifically, noting "SVG is preferred as it allows code splitting, supports more icons, and renders faster and better" (https://mui.com/material-ui/icons/).

## Component-library integration

Font Awesome does not ship plain SVG components the way the other libraries researched do — it renders through its own `<FontAwesomeIcon>` wrapper component. It's still usable as a `ReactNode` wherever an icon prop is expected, but community reports note sizing/viewBox alignment isn't as clean as the 24×24-convention libraries (Lucide, Tabler, Phosphor, Heroicons, and Material Icons all share that convention; Font Awesome doesn't natively).

## Adopters

The strongest raw usage-scale evidence of any library researched — third-party technology-detection services (BuiltWith, Wappalyzer) report Font Awesome present on tens of millions of live sites. This is aggregate detection data, not named case studies, but it's a real and large signal.
