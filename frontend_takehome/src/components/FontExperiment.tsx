import React, { useEffect, useRef, useState } from 'react';
import { FONT_GROUPS, ALL_FONTS, DEFAULT_FONT, applyFont } from '../fonts';

export default function FontExperiment() {
  const [font, setFont] = useState(DEFAULT_FONT);
  const [open, setOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyFont(font);
  }, [font]);

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
    <div className="font-experiment" ref={containerRef}>
      <button
        type="button"
        className="font-experiment-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        Font: {ALL_FONTS.find((f) => f.value === font)?.label}
      </button>

      {open && (
        <div className="font-experiment-panel">
          {FONT_GROUPS.map((group) => (
            <div key={group.label} className="font-experiment-group">
              <p className="font-experiment-group-label">{group.label}</p>
              {group.fonts.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className="font-experiment-option"
                  aria-pressed={f.value === font}
                  onClick={() => setFont(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
