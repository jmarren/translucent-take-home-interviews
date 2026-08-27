import {
  LucideIcon,
  Search,
  Filter,
  Calendar,
  Palette,
  Type,
  Square,
  Heading,
  MousePointer2,
} from "lucide-react";
import { TABS } from "./tabs";
import { DEPARTMENTS, PAYERS, REASONS, METRICS } from "./types";
import { PERIODS } from "./periods";
import { ALL_FONTS } from "./theme/fonts";
import { ALL_PALETTES } from "./theme/palettes";
import { RADIUS_OPTIONS } from "./theme/radii";
import { CURSOR_STYLES } from "./theme/cursors";
import { TITLE_STYLES } from "./theme/titleStyles";
import { ThemePreferences } from "./hooks/useThemePreferences";
import { DashboardFilters } from "./hooks/useDashboardFilters";
import { Navigation } from "./hooks/useNavigation";

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
      hint:
        tab.id === ctx.navigation.activeTab.value ? "Current view" : undefined,
      perform: () => {
        ctx.navigation.activeTab.set(tab.id);
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
    hint: ctx.filters.department.value === "" ? "Active" : undefined,
    perform: () => {
      ctx.filters.department.set("");
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
      hint: ctx.filters.department.value === dept ? "Active" : undefined,
      perform: () => {
        ctx.filters.department.set(dept);
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
    hint: ctx.filters.payer.value === "" ? "Active" : undefined,
    perform: () => {
      ctx.filters.payer.set("");
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
      hint: ctx.filters.payer.value === payer ? "Active" : undefined,
      perform: () => {
        ctx.filters.payer.set(payer);
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
    hint: ctx.filters.reason.value === "" ? "Active" : undefined,
    perform: () => {
      ctx.filters.reason.set("");
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
      hint: ctx.filters.reason.value === reason ? "Active" : undefined,
      perform: () => {
        ctx.filters.reason.set(reason);
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
      hint: ctx.filters.period.value === period.id ? "Active" : undefined,
      perform: () => {
        ctx.filters.period.set(period.id);
        ctx.close();
      },
    });
  }

  for (const metric of METRICS) {
    commands.push({
      id: `filter:metric:${metric.id}`,
      label: `Metric: ${metric.label}`,
      group: "Filter by Metric",
      icon: Filter,
      keywords: ["metric", "amount", "count", "visualize"],
      hint: ctx.filters.metric.value === metric.id ? "Active" : undefined,
      perform: () => {
        ctx.filters.metric.set(metric.id);
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
      hint: font.value === ctx.theme.font.value ? "Active" : undefined,
      perform: () => {
        ctx.theme.font.set(font.value);
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
      hint:
        palette.label === ctx.theme.palette.value.label ? "Active" : undefined,
      perform: () => {
        ctx.theme.palette.set(palette);
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
      hint: radius.value === ctx.theme.radius.value ? "Active" : undefined,
      perform: () => {
        ctx.theme.radius.set(radius.value);
        ctx.close();
      },
    });
  }

  for (const cursorStyle of CURSOR_STYLES) {
    commands.push({
      id: `cursor-style:${cursorStyle.value}`,
      label: `Cursor: ${cursorStyle.label}`,
      group: "Appearance — Cursor",
      icon: MousePointer2,
      keywords: ["cursor", "pointer", "mouse", "settings"],
      hint: cursorStyle.value === ctx.theme.cursorStyle.value ? "Active" : undefined,
      perform: () => {
        ctx.theme.cursorStyle.set(cursorStyle.value);
        ctx.close();
      },
    });
  }

  for (const titleStyle of TITLE_STYLES) {
    commands.push({
      id: `title-style:primary:${titleStyle.label}`,
      label: `Title Style (Summary Panel): ${titleStyle.label}`,
      group: "Appearance — Title Style",
      icon: Heading,
      keywords: ["title", "heading", "typography", "settings", "summary"],
      hint:
        titleStyle.label === ctx.theme.primaryTitleStyle.value.label
          ? "Active"
          : undefined,
      perform: () => {
        ctx.theme.primaryTitleStyle.set(titleStyle);
        ctx.close();
      },
    });
    commands.push({
      id: `title-style:secondary:${titleStyle.label}`,
      label: `Title Style (Charts & Records): ${titleStyle.label}`,
      group: "Appearance — Title Style",
      icon: Heading,
      keywords: [
        "title",
        "heading",
        "typography",
        "settings",
        "chart",
        "records",
      ],
      hint:
        titleStyle.label === ctx.theme.secondaryTitleStyle.value.label
          ? "Active"
          : undefined,
      perform: () => {
        ctx.theme.secondaryTitleStyle.set(titleStyle);
        ctx.close();
      },
    });
  }

  return commands;
}

export const PALETTE_SEARCH_ICON = Search;
