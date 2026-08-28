// The sidebar is always present -- this only controls how it renders
// (full width, icons-only, or a hover/focus flyout), independent of
// ThemePreferences.commandPaletteEnabled, which just toggles whether
// Cmd+K/Ctrl+K and the command palette modal are also available.
export type SidebarStyle = "expanded" | "icons-only" | "flyout";

export interface SidebarStyleOption {
  label: string;
  value: SidebarStyle;
  description: string;
}

export const SIDEBAR_STYLES: SidebarStyleOption[] = [
  {
    label: "Expanded",
    value: "expanded",
    description: "The full-width sidebar, showing icon and label for every section.",
  },
  {
    label: "Icons Only",
    value: "icons-only",
    description: "A narrow sidebar showing just icons -- labels stay available to screen readers.",
  },
  {
    label: "Flyout",
    value: "flyout",
    description: "A narrow sidebar that expands to show labels while hovered or focused.",
  },
];

export const DEFAULT_SIDEBAR_STYLE: SidebarStyle = SIDEBAR_STYLES[0].value;
