import {
  LucideIcon,
  Search,
  Filter,
  Calendar,
  Palette,
  Type,
  Square,
} from "lucide-react";
import { TABS } from "./tabs";
import { DEPARTMENTS, PAYERS, REASONS } from "./types";
import { PERIODS } from "./periods";
import { ALL_FONTS } from "./fonts";
import { ALL_PALETTES } from "./palettes";
import { RADIUS_OPTIONS } from "./radii";
import { ThemePreferences } from "./useThemePreferences";
import { DashboardFilters } from "./useDashboardFilters";
import { Navigation } from "./useNavigation";

export interface Command {
  id: string;
  label: string;
  group: string;
  icon: LucideIcon;
  keywords?: string[];
  /** Extra text shown at the right edge of the row, e.g. the current value. */
  hint?: string;
  perform: () => void;
}

export interface CommandContext {
  theme: ThemePreferences;
  filters: DashboardFilters;
  navigation: Navigation;
  close: () => void;
}

/**
 * Builds the full, flat list of palette commands from current app state. Kept as a
 * plain function (not a hook) so it stays trivial to unit test and has no rules-of-hooks
 * concerns -- it's just data derived from props/state already owned by the caller.
 */
export function buildCommands(ctx: CommandContext): Command[] {
  const commands: Command[] = [];

  for (const tab of TABS) {
    commands.push({
      id: `go:${tab.id}`,
      label: `Go to ${tab.label}`,
      group: "Navigate",
      icon: tab.icon,
      keywords: ["go", "view", "open", tab.id],
      hint: tab.id === ctx.navigation.activeTab ? "Current view" : undefined,
      perform: () => {
        ctx.navigation.switchTo(tab.id);
        ctx.close();
      },
    });
  }

  commands.push({
    id: "filter:department:all",
    label: "Filter: All Departments",
    group: "Filter by Department",
    icon: Filter,
    keywords: ["department", "filter", "clear"],
    hint: ctx.filters.department === "" ? "Active" : undefined,
    perform: () => {
      ctx.filters.setDepartment("");
      ctx.close();
    },
  });
  for (const dept of DEPARTMENTS) {
    commands.push({
      id: `filter:department:${dept}`,
      label: `Filter: ${dept}`,
      group: "Filter by Department",
      icon: Filter,
      keywords: ["department", "filter", dept.toLowerCase()],
      hint: ctx.filters.department === dept ? "Active" : undefined,
      perform: () => {
        ctx.filters.setDepartment(dept);
        ctx.close();
      },
    });
  }

  commands.push({
    id: "filter:payer:all",
    label: "Filter: All Payers",
    group: "Filter by Payer",
    icon: Filter,
    keywords: ["payer", "insurer", "filter", "clear"],
    hint: ctx.filters.payer === "" ? "Active" : undefined,
    perform: () => {
      ctx.filters.setPayer("");
      ctx.close();
    },
  });
  for (const payer of PAYERS) {
    commands.push({
      id: `filter:payer:${payer}`,
      label: `Filter: ${payer}`,
      group: "Filter by Payer",
      icon: Filter,
      keywords: ["payer", "insurer", "filter", payer.toLowerCase()],
      hint: ctx.filters.payer === payer ? "Active" : undefined,
      perform: () => {
        ctx.filters.setPayer(payer);
        ctx.close();
      },
    });
  }

  commands.push({
    id: "filter:reason:all",
    label: "Filter: All Reasons",
    group: "Filter by Reason",
    icon: Filter,
    keywords: ["reason", "filter", "clear"],
    hint: ctx.filters.reason === "" ? "Active" : undefined,
    perform: () => {
      ctx.filters.setReason("");
      ctx.close();
    },
  });
  for (const reason of REASONS) {
    commands.push({
      id: `filter:reason:${reason}`,
      label: `Filter: ${reason}`,
      group: "Filter by Reason",
      icon: Filter,
      keywords: ["reason", "filter", reason.toLowerCase()],
      hint: ctx.filters.reason === reason ? "Active" : undefined,
      perform: () => {
        ctx.filters.setReason(reason);
        ctx.close();
      },
    });
  }

  for (const period of PERIODS) {
    commands.push({
      id: `filter:period:${period.id}`,
      label: `Period: ${period.label}`,
      group: "Filter by Period",
      icon: Calendar,
      keywords: ["period", "time", "range"],
      hint: ctx.filters.period === period.id ? "Active" : undefined,
      perform: () => {
        ctx.filters.setPeriod(period.id);
        ctx.close();
      },
    });
  }

  for (const font of ALL_FONTS) {
    commands.push({
      id: `font:${font.value}`,
      label: `Font: ${font.label}`,
      group: "Appearance — Font",
      icon: Type,
      keywords: ["font", "typeface", "settings"],
      hint: font.value === ctx.theme.font ? "Active" : undefined,
      perform: () => {
        ctx.theme.setFont(font.value);
        ctx.close();
      },
    });
  }

  for (const palette of ALL_PALETTES) {
    commands.push({
      id: `palette:${palette.label}`,
      label: `Palette: ${palette.label}`,
      group: "Appearance — Palette",
      icon: Palette,
      keywords: ["palette", "color", "colour", "theme", "settings"],
      hint: palette.label === ctx.theme.palette.label ? "Active" : undefined,
      perform: () => {
        ctx.theme.setPalette(palette);
        ctx.close();
      },
    });
  }

  for (const radius of RADIUS_OPTIONS) {
    commands.push({
      id: `radius:${radius.value}`,
      label: `Border Radius: ${radius.label}`,
      group: "Appearance — Border Radius",
      icon: Square,
      keywords: ["radius", "rounded", "corners", "settings"],
      hint: radius.value === ctx.theme.radius ? "Active" : undefined,
      perform: () => {
        ctx.theme.setRadius(radius.value);
        ctx.close();
      },
    });
  }

  return commands;
}

export const PALETTE_SEARCH_ICON = Search;
