import React, { useEffect, useState } from 'react';

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

  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', font);
  }, [font]);

  return (
    <div className="font-experiment">
      <label htmlFor="font-experiment-select" className="font-experiment-label">
        Font
      </label>
      <select
        id="font-experiment-select"
        className="font-experiment-select"
        value={font}
        onChange={(e) => setFont(e.target.value)}
      >
        {FONT_GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.fonts.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
