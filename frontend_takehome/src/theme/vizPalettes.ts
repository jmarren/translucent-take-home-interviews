// Separate from the UI palette (theme/palettes.ts, which colors chrome --
// surfaces/text/borders). This palette colors chart *data* instead: bars,
// pie slices, and trend lines, uniformly across every chart (Department/
// Payer included -- there's no separate fixed-color exemption). Applied
// via colorFor's `vizColors` parameter (category/shared.ts) and
// MultiSeriesTrendCard's colorsFor, both of which assign colors by
// position within whichever palette's `colors` array is active here.
export interface VizPalette {
  label: string;
  colors: string[];
}

// Every palette below has exactly 8 colors -- consumers cycle through by
// index (`colors[index % colors.length]`), so this isn't a hard
// requirement, but keeping the count consistent means switching palettes
// doesn't change how many categories get a truly distinct color before
// repeating.
export const VIZ_PALETTES: VizPalette[] = [
  {
    label: "Olive & Slate (default)",
    colors: [
      "#5b7fa6", "#2c423f", "#4c5b61", "#8a5a44",
      "#b08d3e", "#829191", "#949b96", "#c5c5c5",
    ],
  },
  {
    label: "Categorical Bold",
    colors: [
      "#4e79a7", "#f28e2b", "#e15759", "#76b7b2",
      "#59a14f", "#edc948", "#b07aa1", "#ff9da7",
    ],
  },
  {
    label: "Muted Earth",
    colors: [
      "#8c6d46", "#5f7a61", "#a35d4f", "#6b7d99",
      "#c2a24a", "#4f6b6b", "#9c7a8a", "#7d8471",
    ],
  },
  {
    label: "Cool Clinical",
    colors: [
      "#3a6ea5", "#5b8c8c", "#7a6ba6", "#4f7d5c",
      "#8595a8", "#6a8caf", "#5e9c8f", "#7c7fa3",
    ],
  },
  {
    label: "Colorblind Safe",
    // Okabe-Ito, a widely-used deuteranopia/protanopia/tritanopia-safe
    // qualitative palette -- unlike the others here, chosen for maximum
    // pairwise distinguishability rather than matching the app's aesthetic.
    colors: [
      "#e69f00", "#56b4e9", "#009e73", "#f0e442",
      "#0072b2", "#d55e00", "#cc79a7", "#000000",
    ],
  },
];

export const DEFAULT_VIZ_PALETTE = VIZ_PALETTES[0];

// A single accent color, independent of VIZ_PALETTES above -- the
// Breakdown page's single-series "Trend" card (TimeSeriesCard.tsx) has
// only one series, so cycling through a whole categorical palette by
// position doesn't apply the way it does for bars/pie slices/the
// multi-series Trends-page chart; a dedicated color picker lets it be
// tuned on its own instead of just always taking vizPalette's first
// color. Defaults to that same first color, so nothing changes visually
// until the user picks something else in Settings.
export const DEFAULT_TREND_COLOR = DEFAULT_VIZ_PALETTE.colors[0];
