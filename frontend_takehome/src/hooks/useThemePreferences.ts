import { useEffect, useState } from "react";
import { ALL_FONTS, DEFAULT_FONT, applyFont } from "../theme/fonts";
import {
  ALL_PALETTES,
  DEFAULT_PALETTE,
  Palette,
  applyPalette,
} from "../theme/palettes";
import { RADIUS_OPTIONS, DEFAULT_RADIUS, applyRadius } from "../theme/radii";
import { NAV_MODES, DEFAULT_NAV_MODE, NavMode } from "../theme/navModes";
import {
  TITLE_STYLES,
  DEFAULT_PRIMARY_TITLE_STYLE,
  DEFAULT_SECONDARY_TITLE_STYLE,
  TitleStyle,
  applyPrimaryTitleStyle,
  applySecondaryTitleStyle,
} from "../theme/titleStyles";
import {
  CURSOR_STYLES,
  DEFAULT_CURSOR_STYLE,
  CursorStyle,
  applyCursorStyle,
} from "../theme/cursors";
import {
  VIZ_PALETTES,
  DEFAULT_VIZ_PALETTE,
  DEFAULT_TREND_COLOR,
  VizPalette,
} from "../theme/vizPalettes";
import {
  SIDEBAR_STYLES,
  DEFAULT_SIDEBAR_STYLE,
  SidebarStyle,
} from "../theme/sidebarStyles";
import { State } from "./state";
import { makeLoader, makeLocalStorageState } from "./localStorageState";

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

const DEFAULT_CHART_ANIMATIONS_ENABLED = true;

const FONT_STORAGE_KEY = "denial-dashboard:font";
const PALETTE_STORAGE_KEY = "denial-dashboard:palette-label";
const RADIUS_STORAGE_KEY = "denial-dashboard:radius";
const NAV_MODE_STORAGE_KEY = "denial-dashboard:nav-mode";
const CURSOR_STYLE_STORAGE_KEY = "denial-dashboard:cursor-style";
const VIZ_PALETTE_STORAGE_KEY = "denial-dashboard:viz-palette-label";
const TREND_COLOR_STORAGE_KEY = "denial-dashboard:trend-color";
const SIDEBAR_STYLE_STORAGE_KEY = "denial-dashboard:sidebar-style";
const CHART_ANIMATIONS_ENABLED_STORAGE_KEY =
  "denial-dashboard:chart-animations-enabled";
const PRIMARY_TITLE_STYLE_STORAGE_KEY =
  "denial-dashboard:primary-title-style-label";
const SECONDARY_TITLE_STYLE_STORAGE_KEY =
  "denial-dashboard:secondary-title-style-label";

const loadStoredFont = makeLoader<string>(
  FONT_STORAGE_KEY,
  (stored) => ALL_FONTS.find((f) => f.value === stored)?.value,
  DEFAULT_FONT,
);

const loadStoredPalette = makeLoader<Palette>(
  PALETTE_STORAGE_KEY,
  (stored) => ALL_PALETTES.find((p) => p.label === stored),
  DEFAULT_PALETTE,
);

const loadStoredRadius = makeLoader<number>(
  RADIUS_STORAGE_KEY,
  (stored) => RADIUS_OPTIONS.find((r) => String(r.value) === stored)?.value,
  DEFAULT_RADIUS,
);

const loadStoredNavMode = makeLoader<NavMode>(
  NAV_MODE_STORAGE_KEY,
  (stored) => NAV_MODES.find((m) => m.value === stored)?.value,
  DEFAULT_NAV_MODE,
);

const loadStoredCursorStyle = makeLoader<CursorStyle>(
  CURSOR_STYLE_STORAGE_KEY,
  (stored) => CURSOR_STYLES.find((c) => c.value === stored)?.value,
  DEFAULT_CURSOR_STYLE,
);

const loadStoredVizPalette = makeLoader<VizPalette>(
  VIZ_PALETTE_STORAGE_KEY,
  (stored) => VIZ_PALETTES.find((p) => p.label === stored),
  DEFAULT_VIZ_PALETTE,
);

const loadStoredTrendColor = makeLoader<string>(
  TREND_COLOR_STORAGE_KEY,
  (stored) => (stored && HEX_COLOR_PATTERN.test(stored) ? stored : undefined),
  DEFAULT_TREND_COLOR,
);

const loadStoredSidebarStyle = makeLoader<SidebarStyle>(
  SIDEBAR_STYLE_STORAGE_KEY,
  (stored) => SIDEBAR_STYLES.find((s) => s.value === stored)?.value,
  DEFAULT_SIDEBAR_STYLE,
);

const loadStoredChartAnimationsEnabled = makeLoader<boolean>(
  CHART_ANIMATIONS_ENABLED_STORAGE_KEY,
  (stored) =>
    stored === "true" ? true : stored === "false" ? false : undefined,
  DEFAULT_CHART_ANIMATIONS_ENABLED,
);

function makeTitleStyleLoader(
  storageKey: string,
  fallback: TitleStyle,
): () => TitleStyle {
  return makeLoader<TitleStyle>(
    storageKey,
    (stored) => TITLE_STYLES.find((s) => s.label === stored),
    fallback,
  );
}

export interface ThemePreferences {
  font: State<string>;
  palette: State<Palette>;
  radius: State<number>;
  navMode: State<NavMode>;
  /** Only meaningful in sidebar nav mode -- how wide the sidebar renders and whether it shows labels. */
  sidebarStyle: State<SidebarStyle>;
  cursorStyle: State<CursorStyle>;
  /** Colors chart data (bars, pie slices, trend lines) -- separate from `palette`, which colors UI chrome. */
  vizPalette: State<VizPalette>;
  /** Accent color for the Breakdown page's single-series Trend card, independent of `vizPalette`. */
  trendColor: State<string>;
  /** Applied to the summary panel's stat labels. */
  primaryTitleStyle: State<TitleStyle>;
  /** Applied to chart-card titles and the Denial-Level Detail heading. */
  secondaryTitleStyle: State<TitleStyle>;
  /** Whether charts animate in (pie slices fanning out, bars growing, etc.) -- Recharts' own `isAnimationActive`. */
  chartAnimationsEnabled: State<boolean>;
}

function makeEffectParams<T>(
  applyFunc: (x: T) => void,
  value: T,
): Parameters<typeof useEffect> {
  return [
    () => {
      applyFunc(value);
    },
    [value],
  ];
}

export function useThemePreferences(): ThemePreferences {
  const [font, setFontState] = useState<string>(loadStoredFont);
  const [palette, setPaletteState] = useState<Palette>(loadStoredPalette);
  const [radius, setRadiusState] = useState<number>(loadStoredRadius);
  const [navMode, setNavModeState] = useState<NavMode>(loadStoredNavMode);
  const [sidebarStyle, setSidebarStyleState] = useState<SidebarStyle>(
    loadStoredSidebarStyle,
  );
  const [cursorStyle, setCursorStyleState] = useState<CursorStyle>(
    loadStoredCursorStyle,
  );
  const [vizPalette, setVizPaletteState] = useState<VizPalette>(
    loadStoredVizPalette,
  );
  const [trendColor, setTrendColorState] = useState<string>(
    loadStoredTrendColor,
  );
  const [primaryTitleStyle, setPrimaryTitleStyleState] = useState<TitleStyle>(
    makeTitleStyleLoader(
      PRIMARY_TITLE_STYLE_STORAGE_KEY,
      DEFAULT_PRIMARY_TITLE_STYLE,
    ),
  );
  const [secondaryTitleStyle, setSecondaryTitleStyleState] =
    useState<TitleStyle>(
      makeTitleStyleLoader(
        SECONDARY_TITLE_STYLE_STORAGE_KEY,
        DEFAULT_SECONDARY_TITLE_STYLE,
      ),
    );
  const [chartAnimationsEnabled, setChartAnimationsEnabledState] =
    useState<boolean>(loadStoredChartAnimationsEnabled);

  useEffect(...makeEffectParams(applyFont, font));
  useEffect(...makeEffectParams(applyPalette, palette));
  useEffect(...makeEffectParams(applyRadius, radius));
  useEffect(...makeEffectParams(applyPrimaryTitleStyle, primaryTitleStyle));
  useEffect(...makeEffectParams(applySecondaryTitleStyle, secondaryTitleStyle));

  // Depends on `palette` as well as `cursorStyle` -- unlike every other
  // preference here, the cursor's color is baked into a literal data URI
  // rather than a CSS variable reference (see cursors.ts), so it has to
  // be regenerated whenever the palette changes too, not just when the
  // cursor style itself does. Runs after the palette effect above within
  // the same commit, so the CSS variables it reads are already current.
  useEffect(() => {
    applyCursorStyle(cursorStyle);
  }, [cursorStyle, palette]);

  return {
    font: makeLocalStorageState(font, setFontState, FONT_STORAGE_KEY),
    palette: makeLocalStorageState<Palette>(
      palette,
      setPaletteState,
      PALETTE_STORAGE_KEY,
      (value) => value.label,
    ),
    radius: makeLocalStorageState<number>(
      radius,
      setRadiusState,
      RADIUS_STORAGE_KEY,
      (value) => String(value),
    ),
    navMode: makeLocalStorageState<NavMode>(
      navMode,
      setNavModeState,
      NAV_MODE_STORAGE_KEY,
      (value) => value,
    ),
    sidebarStyle: makeLocalStorageState<SidebarStyle>(
      sidebarStyle,
      setSidebarStyleState,
      SIDEBAR_STYLE_STORAGE_KEY,
      (value) => value,
    ),
    cursorStyle: makeLocalStorageState<CursorStyle>(
      cursorStyle,
      setCursorStyleState,
      CURSOR_STYLE_STORAGE_KEY,
      (value) => value,
    ),
    vizPalette: makeLocalStorageState<VizPalette>(
      vizPalette,
      setVizPaletteState,
      VIZ_PALETTE_STORAGE_KEY,
      (value) => value.label,
    ),
    trendColor: makeLocalStorageState(trendColor, setTrendColorState, TREND_COLOR_STORAGE_KEY),
    primaryTitleStyle: makeLocalStorageState<TitleStyle>(
      primaryTitleStyle,
      setPrimaryTitleStyleState,
      PRIMARY_TITLE_STYLE_STORAGE_KEY,
      (value) => value.label,
    ),
    secondaryTitleStyle: makeLocalStorageState<TitleStyle>(
      secondaryTitleStyle,
      setSecondaryTitleStyleState,
      SECONDARY_TITLE_STYLE_STORAGE_KEY,
      (value) => value.label,
    ),
    chartAnimationsEnabled: makeLocalStorageState<boolean>(
      chartAnimationsEnabled,
      setChartAnimationsEnabledState,
      CHART_ANIMATIONS_ENABLED_STORAGE_KEY,
      (value) => String(value),
    ),
  };
}
