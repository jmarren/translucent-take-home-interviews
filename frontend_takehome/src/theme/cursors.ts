// Unlike every other theme preference here, a cursor's color can't be
// expressed as a CSS variable reference (the way applyTitleStyle points
// at var(--text-primary) and lets the cascade re-resolve it on palette
// change for free) -- `cursor: url(data:image/svg+xml,...)` embeds a
// literal, already-rendered image, so the color has to be a real hex
// string burned into that data URI at generation time. That's why
// applyCursorStyle (below) needs to be re-run whenever the palette
// changes too, not just when the cursor style itself changes -- see its
// call site in useThemePreferences, which depends on both.
export type CursorStyle = "default" | "dot" | "arrow";

export interface CursorStyleOption {
  label: string;
  value: CursorStyle;
  description: string;
}

export const CURSOR_STYLES: CursorStyleOption[] = [
  {
    label: "System Default",
    value: "default",
    description: "The browser's own cursor -- no custom styling.",
  },
  {
    label: "Dot",
    value: "dot",
    description: "A small filled circle, colored to match the palette.",
  },
  {
    label: "Arrow",
    value: "arrow",
    description: "A traditional pointer arrow, recolored to match the palette.",
  },
];

export const DEFAULT_CURSOR_STYLE: CursorStyle = CURSOR_STYLES[0].value;

// Hotspot (the pixel the OS treats as the actual click point) is the dot's
// center -- a symmetric shape has no other sensible anchor.
function dotCursorSvg(fill: string, outline: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">` +
    `<circle cx="10" cy="10" r="6" fill="${fill}" stroke="${outline}" stroke-width="2"/>` +
    `</svg>`;
}

// A simple pointer-arrow outline, hotspot at the tip (top-left), matching
// where a native arrow cursor's own hotspot sits.
function arrowCursorSvg(fill: string, outline: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">` +
    `<path d="M2 1 L2 19 L7 15 L10.5 22 L13.5 20.5 L10 13.5 L17 13.5 Z" ` +
    `fill="${fill}" stroke="${outline}" stroke-width="1.5" stroke-linejoin="round"/>` +
    `</svg>`;
}

function cursorUrl(svg: string, hotspotX: number, hotspotY: number): string {
  const encoded = encodeURIComponent(svg);
  return `url("data:image/svg+xml,${encoded}") ${hotspotX} ${hotspotY}, auto`;
}

// Reads the palette's already-resolved colors straight off the root
// element -- applyPalette runs first (see useThemePreferences' effect
// ordering) and writes literal hex values into these CSS variables, so
// getComputedStyle here returns real colors, not unresolved var(...)
// references.
function resolvedPaletteColors(): { fill: string; outline: string } {
  const styles = getComputedStyle(document.documentElement);
  return {
    fill: styles.getPropertyValue("--surface-primary").trim(),
    outline: styles.getPropertyValue("--surface-light").trim(),
  };
}

export function applyCursorStyle(style: CursorStyle) {
  const body = document.body.style;
  if (style === "default") {
    body.cursor = "";
    return;
  }

  const { fill, outline } = resolvedPaletteColors();
  body.cursor =
    style === "dot"
      ? cursorUrl(dotCursorSvg(fill, outline), 10, 10)
      : cursorUrl(arrowCursorSvg(fill, outline), 2, 1);
}
