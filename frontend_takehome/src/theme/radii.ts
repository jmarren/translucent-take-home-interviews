export interface RadiusOption {
  label: string;
  value: number;
}

export const RADIUS_OPTIONS: RadiusOption[] = [
  { label: 'Square', value: 0 },
  { label: 'Subtle', value: 4 },
  { label: 'Default', value: 8 },
  { label: 'Soft', value: 12 },
  { label: 'Rounded', value: 16 },
  { label: 'Very Rounded', value: 24 },
];

export const DEFAULT_RADIUS = RADIUS_OPTIONS[2].value;

export function applyRadius(radius: number) {
  document.documentElement.style.setProperty('--radius', `${radius}px`);
}
