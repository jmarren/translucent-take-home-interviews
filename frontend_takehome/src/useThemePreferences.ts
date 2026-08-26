import { useEffect, useState } from 'react';
import { ALL_FONTS, DEFAULT_FONT, applyFont } from './fonts';
import { ALL_PALETTES, DEFAULT_PALETTE, Palette, applyPalette } from './palettes';
import { RADIUS_OPTIONS, DEFAULT_RADIUS, applyRadius } from './radii';

const FONT_STORAGE_KEY = 'denial-dashboard:font';
const PALETTE_STORAGE_KEY = 'denial-dashboard:palette-label';
const RADIUS_STORAGE_KEY = 'denial-dashboard:radius';

function loadStoredFont(): string {
  try {
    const stored = window.localStorage.getItem(FONT_STORAGE_KEY);
    if (stored && ALL_FONTS.some((f) => f.value === stored)) return stored;
  } catch {
    // localStorage unavailable (private browsing, etc.) -- fall back to default.
  }
  return DEFAULT_FONT;
}

function loadStoredPalette(): Palette {
  try {
    const storedLabel = window.localStorage.getItem(PALETTE_STORAGE_KEY);
    const match = ALL_PALETTES.find((p) => p.label === storedLabel);
    if (match) return match;
  } catch {
    // localStorage unavailable -- fall back to default.
  }
  return DEFAULT_PALETTE;
}

function loadStoredRadius(): number {
  try {
    const stored = window.localStorage.getItem(RADIUS_STORAGE_KEY);
    const parsed = stored === null ? NaN : Number(stored);
    if (RADIUS_OPTIONS.some((r) => r.value === parsed)) return parsed;
  } catch {
    // localStorage unavailable -- fall back to default.
  }
  return DEFAULT_RADIUS;
}

export function useThemePreferences() {
  const [font, setFontState] = useState<string>(loadStoredFont);
  const [palette, setPaletteState] = useState<Palette>(loadStoredPalette);
  const [radius, setRadiusState] = useState<number>(loadStoredRadius);

  useEffect(() => {
    applyFont(font);
  }, [font]);

  useEffect(() => {
    applyPalette(palette);
  }, [palette]);

  useEffect(() => {
    applyRadius(radius);
  }, [radius]);

  function setFont(value: string) {
    setFontState(value);
    try {
      window.localStorage.setItem(FONT_STORAGE_KEY, value);
    } catch {
      // Ignore write failures (private browsing, storage full, etc.).
    }
  }

  function setPalette(value: Palette) {
    setPaletteState(value);
    try {
      window.localStorage.setItem(PALETTE_STORAGE_KEY, value.label);
    } catch {
      // Ignore write failures.
    }
  }

  function setRadius(value: number) {
    setRadiusState(value);
    try {
      window.localStorage.setItem(RADIUS_STORAGE_KEY, String(value));
    } catch {
      // Ignore write failures.
    }
  }

  return { font, setFont, palette, setPalette, radius, setRadius };
}
