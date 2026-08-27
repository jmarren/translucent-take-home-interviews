export type NavMode = 'palette' | 'sidebar';

export interface NavModeOption {
  label: string;
  value: NavMode;
  description: string;
}

export const NAV_MODES: NavModeOption[] = [
  {
    label: 'Command Palette',
    value: 'palette',
    description: 'A slim top bar plus a searchable Cmd+K palette for navigating and changing settings.',
  },
  {
    label: 'Sidebar',
    value: 'sidebar',
    description: 'A persistent left-hand sidebar listing every view.',
  },
];

export const DEFAULT_NAV_MODE: NavMode = NAV_MODES[0].value;
