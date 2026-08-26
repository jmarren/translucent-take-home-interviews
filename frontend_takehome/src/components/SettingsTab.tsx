import React from 'react';
import { FONT_GROUPS } from '../fonts';
import { PALETTE_GROUPS, Palette, paletteSwatchGradient } from '../palettes';

interface SettingsTabProps {
  font: string;
  onFontChange: (value: string) => void;
  palette: Palette;
  onPaletteChange: (palette: Palette) => void;
}

export default function SettingsTab({
  font,
  onFontChange,
  palette,
  onPaletteChange,
}: SettingsTabProps) {
  return (
    <div className="settings-tab">
      <section className="settings-section" aria-label="Font settings">
        <h2 className="settings-section-title">Font</h2>
        <p className="settings-section-description">
          Choose the typeface used throughout the dashboard.
        </p>
        {FONT_GROUPS.map((group) => (
          <div key={group.label} className="settings-group">
            <p className="settings-group-label">{group.label}</p>
            <div className="settings-options">
              {group.fonts.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className="settings-option"
                  aria-pressed={f.value === font}
                  onClick={() => onFontChange(f.value)}
                  style={{ fontFamily: f.value }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="settings-section" aria-label="Color palette settings">
        <h2 className="settings-section-title">Color Palette</h2>
        <p className="settings-section-description">
          Choose the color palette used throughout the dashboard.
        </p>
        {PALETTE_GROUPS.map((group) => (
          <div key={group.label} className="settings-group">
            <p className="settings-group-label">{group.label}</p>
            <div className="settings-options">
              {group.palettes.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="settings-option settings-palette-option"
                  aria-pressed={p.label === palette.label}
                  onClick={() => onPaletteChange(p)}
                >
                  <span
                    className="settings-palette-swatch"
                    aria-hidden="true"
                    style={{ background: paletteSwatchGradient(p) }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
