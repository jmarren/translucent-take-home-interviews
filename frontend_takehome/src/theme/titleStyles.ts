// Titles appear on two different surfaces -- dark text on light chart/
// section cards (chart-card-title, denial-records-heading) and light text
// on the dark summary panel (summary-card-label) -- so a title style can't
// pick one literal color for all three without breaking contrast on the
// dark panel. Instead each style picks an *intensity*: 'primary' (the
// bolder/higher-contrast tone -- --text-primary on light surfaces,
// --surface-light on the dark one) or 'secondary' (the muted tone --
// --text-secondary on light surfaces, --border-muted on the dark one).
// Every surface resolves the same intensity choice to its own correct
// token via applyTitleStyle below, so color intensity still changes
// together with the typography while contrast stays correct everywhere.
export type TitleEmphasis = "primary" | "secondary";

export interface TitleStyle {
  label: string;
  fontSize: string;
  fontWeight: number;
  textTransform: "none" | "uppercase";
  letterSpacing: string;
  emphasis: TitleEmphasis;
}

// Two named presets, independently assignable to two slots (see
// useThemePreferences' primaryTitleStyle/secondaryTitleStyle) rather than
// one shared style for every title -- the summary panel's labels
// (primary slot) and the chart-card/Denial-Level-Detail titles (secondary
// slot) can each look different, and each slot can be set to either
// preset. See SettingsTab's "Title Style" section.
export const TITLE_STYLES: TitleStyle[] = [
  {
    label: "Bold",
    fontSize: "1.15rem",
    fontWeight: 700,
    textTransform: "none",
    letterSpacing: "normal",
    emphasis: "primary",
  },
  {
    label: "Label",
    fontSize: "0.9rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    emphasis: "secondary",
  },
];

export type TitleStyleSlot = "primary" | "secondary";

// The summary panel (primary slot) defaults to the second option ("Label"),
// and charts/Denial-Level Detail (secondary slot) default to the first
// ("Bold") -- the reverse of TITLE_STYLES' own order, so each slot's
// default doesn't just fall out of array position.
export const DEFAULT_PRIMARY_TITLE_STYLE = TITLE_STYLES[1];
export const DEFAULT_SECONDARY_TITLE_STYLE = TITLE_STYLES[0];

// `slot` selects which set of --title-*-primary/--title-*-secondary CSS
// variables to write -- "primary"/"secondary" here names the *slot*
// (summary panel vs. chart-card/Denial-Level-Detail titles), not to be
// confused with a TitleStyle's own `emphasis` field (its color intensity).
function applyTitleStyle(slot: TitleStyleSlot, style: TitleStyle) {
  const root = document.documentElement.style;
  root.setProperty(`--title-${slot}-font-size`, style.fontSize);
  root.setProperty(`--title-${slot}-font-weight`, String(style.fontWeight));
  root.setProperty(`--title-${slot}-text-transform`, style.textTransform);
  root.setProperty(`--title-${slot}-letter-spacing`, style.letterSpacing);
  root.setProperty(
    `--title-${slot}-color-on-light`,
    style.emphasis === "primary"
      ? "var(--text-primary)"
      : "var(--text-secondary)",
  );
  root.setProperty(
    `--title-${slot}-color-on-dark`,
    style.emphasis === "primary"
      ? "var(--surface-light)"
      : "var(--border-muted)",
  );
}

export function applyPrimaryTitleStyle(style: TitleStyle) {
  applyTitleStyle("primary", style);
}

export function applySecondaryTitleStyle(style: TitleStyle) {
  applyTitleStyle("secondary", style);
}
