export interface FontOption {
  label: string;
  value: string;
}

export interface FontGroup {
  label: string;
  fonts: FontOption[];
}

export const FONT_GROUPS: FontGroup[] = [
  {
    label: 'Current / original candidates',
    fonts: [
      { label: 'Rajdhani (default)', value: "'Rajdhani', sans-serif" },
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

export const ALL_FONTS: FontOption[] = FONT_GROUPS.flatMap((g) => g.fonts);

export const DEFAULT_FONT = ALL_FONTS[0].value;

export function applyFont(fontValue: string) {
  document.documentElement.style.setProperty('--font-family', fontValue);
}
