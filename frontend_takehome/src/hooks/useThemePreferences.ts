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
import { State, makeState } from "./state";

const FONT_STORAGE_KEY = "denial-dashboard:font";
const PALETTE_STORAGE_KEY = "denial-dashboard:palette-label";
const RADIUS_STORAGE_KEY = "denial-dashboard:radius";
const NAV_MODE_STORAGE_KEY = "denial-dashboard:nav-mode";
const CURSOR_STYLE_STORAGE_KEY = "denial-dashboard:cursor-style";
const PRIMARY_TITLE_STYLE_STORAGE_KEY =
  "denial-dashboard:primary-title-style-label";
const SECONDARY_TITLE_STYLE_STORAGE_KEY =
  "denial-dashboard:secondary-title-style-label";

// Reads a raw string out of localStorage, swallowing the "unavailable"
// case (private browsing, etc.) down to null so callers only ever have
// to handle "there was nothing usable stored" rather than two failure
// modes.
function readStorageItem(storageKey: string): string | null {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

// Composes a loader: read the raw stored string, hand it to `parse` to
// resolve against the real option list, and fall back to `fallback`
// whenever there's nothing stored or `parse` can't place it. Each
// preference then only has to supply how *it* recognizes a stored value,
// not how storage access or fallback works.
function makeLoader<T>(
  storageKey: string,
  parse: (stored: string | null) => T | undefined,
  fallback: T,
): () => T {
  return () => parse(readStorageItem(storageKey)) ?? fallback;
}

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

// Layers localStorage persistence on top of the plain makeState -- `set`
// does both jobs a plain useState setter can't: updating React state and
// best-effort persisting to localStorage, with only the storage key and
// serialization differing per preference. `serialize` defaults to the
// identity function, so it can be omitted when T is already a string.
function makeLocalStorageState(
  value: string,
  setState: (value: string) => void,
  storageKey: string,
  serialize?: (value: string) => string,
): State<string>;
function makeLocalStorageState<T>(
  value: T,
  setState: (value: T) => void,
  storageKey: string,
  serialize: (value: T) => string,
): State<T>;
function makeLocalStorageState<T>(
  value: T,
  setState: (value: T) => void,
  storageKey: string,
  serialize: (value: T) => string = (v) => v as string,
): State<T> {
  return makeState<T>(value, (next: T) => {
    setState(next);
    try {
      window.localStorage.setItem(storageKey, serialize(next));
    } catch {
      // Ignore write failures (private browsing, storage full, etc.).
    }
  });
}

export interface ThemePreferences {
  font: State<string>;
  palette: State<Palette>;
  radius: State<number>;
  navMode: State<NavMode>;
  cursorStyle: State<CursorStyle>;
  /** Applied to the summary panel's stat labels. */
  primaryTitleStyle: State<TitleStyle>;
  /** Applied to chart-card titles and the Denial-Level Detail heading. */
  secondaryTitleStyle: State<TitleStyle>;
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
  const [cursorStyle, setCursorStyleState] = useState<CursorStyle>(
    loadStoredCursorStyle,
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
    cursorStyle: makeLocalStorageState<CursorStyle>(
      cursorStyle,
      setCursorStyleState,
      CURSOR_STYLE_STORAGE_KEY,
      (value) => value,
    ),
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
  };
}
