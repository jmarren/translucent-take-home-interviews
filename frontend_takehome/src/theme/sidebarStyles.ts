// Only meaningful when ThemePreferences.navMode is "sidebar" -- palette
// (topbar) nav mode has no sidebar to style. Kept as its own preference
// rather than folded into NavMode itself, since "which nav surface" and
// "how wide is the sidebar" are independent choices (this app remembers
// a sidebar style even while palette mode is active, so switching back
// to sidebar mode doesn't lose it).
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
