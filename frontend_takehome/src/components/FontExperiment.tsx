import React, { useEffect, useState } from 'react';

const FONTS = [
  { label: 'Rajdhani (current)', value: "'Rajdhani', sans-serif" },
  { label: 'Chakra Petch', value: "'Chakra Petch', sans-serif" },
  { label: 'Orbitron', value: "'Orbitron', sans-serif" },
  { label: 'Barlow Condensed', value: "'Barlow Condensed', sans-serif" },
  { label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
];

export default function FontExperiment() {
  const [font, setFont] = useState(FONTS[0].value);

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
        {FONTS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
