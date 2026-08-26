import React, { useEffect, useRef, useState } from 'react';
import {
  PALETTE_GROUPS,
  DEFAULT_PALETTE,
  Palette,
  applyPalette,
  paletteSwatchGradient,
} from '../palettes';

export default function PaletteExperiment() {
  const [selected, setSelected] = useState<Palette>(DEFAULT_PALETTE);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyPalette(selected);
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="font-experiment palette-experiment" ref={containerRef}>
      <button type="button" className="font-experiment-toggle" onClick={() => setOpen((o) => !o)}>
        Palette: {selected.label}
      </button>

      {open && (
        <div className="font-experiment-panel">
          {PALETTE_GROUPS.map((group) => (
            <div key={group.label} className="font-experiment-group">
              <p className="font-experiment-group-label">{group.label}</p>
              {group.palettes.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="font-experiment-option palette-option"
                  aria-pressed={p.label === selected.label}
                  onClick={() => setSelected(p)}
                >
                  <span
                    className="palette-swatches"
                    aria-hidden="true"
                    style={{ background: paletteSwatchGradient(p) }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
