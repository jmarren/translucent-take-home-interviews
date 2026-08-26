import React, { useEffect, useRef, useState } from 'react';

interface FontOption {
  label: string;
  value: string;
}

interface FontGroup {
  label: string;
  fonts: FontOption[];
}

const FONT_GROUPS: FontGroup[] = [
  {
    label: 'Current / original candidates',
    fonts: [
      { label: 'Rajdhani (current)', value: "'Rajdhani', sans-serif" },
      { label: 'Chakra Petch', value: "'Chakra Petch', sans-serif" },
      { label: 'Orbitron', value: "'Orbitron', sans-serif" },
      { label: 'Barlow Condensed', value: "'Barlow Condensed', sans-serif" },
      { label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
    ],
  },
  {
    label: 'Sterile / clinical',
    fonts: [
      { label: 'Inter', value: "'Inter', sans-serif" },
      { label: 'IBM Plex Sans', value: "'IBM Plex Sans', sans-serif" },
      { label: 'Roboto', value: "'Roboto', sans-serif" },
      { label: 'Public Sans', value: "'Public Sans', sans-serif" },
      { label: 'Work Sans', value: "'Work Sans', sans-serif" },
    ],
  },
  {
    label: 'Professional sans',
    fonts: [
      { label: 'Source Sans 3', value: "'Source Sans 3', sans-serif" },
      { label: 'Manrope', value: "'Manrope', sans-serif" },
      { label: 'Karla', value: "'Karla', sans-serif" },
      { label: 'Mulish', value: "'Mulish', sans-serif" },
      { label: 'Outfit', value: "'Outfit', sans-serif" },
      { label: 'DM Sans', value: "'DM Sans', sans-serif" },
      { label: 'Figtree', value: "'Figtree', sans-serif" },
      { label: 'Plus Jakarta Sans', value: "'Plus Jakarta Sans', sans-serif" },
      { label: 'Lexend', value: "'Lexend', sans-serif" },
      { label: 'Sora', value: "'Sora', sans-serif" },
    ],
  },
  {
    label: 'Professional serif / slab',
    fonts: [
      { label: 'Source Serif 4', value: "'Source Serif 4', serif" },
      { label: 'Merriweather', value: "'Merriweather', serif" },
      { label: 'Lora', value: "'Lora', serif" },
      { label: 'PT Serif', value: "'PT Serif', serif" },
      { label: 'Zilla Slab', value: "'Zilla Slab', serif" },
      { label: 'Spectral', value: "'Spectral', serif" },
    ],
  },
];

export default function FontExperiment() {
  const [font, setFont] = useState(FONT_GROUPS[0].fonts[0].value);
  const [open, setOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', font);
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
        Font: {FONT_GROUPS.flatMap((g) => g.fonts).find((f) => f.value === font)?.label}
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
