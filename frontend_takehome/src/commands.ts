import {
  LucideIcon,
  Search,
  Filter,
  Calendar,
  Palette,
  Type,
  Square,
} from 'lucide-react';
import { TABS } from './tabs';
import { DEPARTMENTS } from './types';
import { PERIODS } from './periods';
import { ALL_FONTS } from './fonts';
import { ALL_PALETTES } from './palettes';
import { RADIUS_OPTIONS } from './radii';
import { ThemePreferences } from './useThemePreferences';
import { DashboardFilters } from './useDashboardFilters';

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
  dashboardFilters: DashboardFilters;
  activeTab: string;
  navigateToTab: (id: string) => void;
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
      group: 'Navigate',
      icon: tab.icon,
      keywords: ['go', 'view', 'open', tab.id],
      hint: tab.id === ctx.activeTab ? 'Current view' : undefined,
      perform: () => {
        ctx.navigateToTab(tab.id);
        ctx.close();
      },
    });
  }

  commands.push({
    id: 'filter:department:all',
    label: 'Filter: All Departments',
    group: 'Filter by Department',
    icon: Filter,
    keywords: ['department', 'filter', 'clear'],
    hint: ctx.dashboardFilters.department === '' ? 'Active' : undefined,
    perform: () => {
      ctx.dashboardFilters.setDepartment('');
      ctx.close();
    },
  });
  for (const dept of DEPARTMENTS) {
    commands.push({
      id: `filter:department:${dept}`,
      label: `Filter: ${dept}`,
      group: 'Filter by Department',
      icon: Filter,
      keywords: ['department', 'filter', dept.toLowerCase()],
      hint: ctx.dashboardFilters.department === dept ? 'Active' : undefined,
      perform: () => {
        ctx.dashboardFilters.setDepartment(dept);
        ctx.close();
      },
    });
  }

  for (const period of PERIODS) {
    commands.push({
      id: `filter:period:${period.id}`,
      label: `Period: ${period.label}`,
      group: 'Filter by Period',
      icon: Calendar,
      keywords: ['period', 'time', 'range'],
      hint: ctx.dashboardFilters.period === period.id ? 'Active' : undefined,
      perform: () => {
        ctx.dashboardFilters.setPeriod(period.id);
        ctx.close();
      },
    });
  }

  for (const font of ALL_FONTS) {
    commands.push({
      id: `font:${font.value}`,
      label: `Font: ${font.label}`,
      group: 'Appearance — Font',
      icon: Type,
      keywords: ['font', 'typeface', 'settings'],
      hint: font.value === ctx.theme.font ? 'Active' : undefined,
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
      group: 'Appearance — Palette',
      icon: Palette,
      keywords: ['palette', 'color', 'colour', 'theme', 'settings'],
      hint: palette.label === ctx.theme.palette.label ? 'Active' : undefined,
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
      group: 'Appearance — Border Radius',
      icon: Square,
      keywords: ['radius', 'rounded', 'corners', 'settings'],
      hint: radius.value === ctx.theme.radius ? 'Active' : undefined,
      perform: () => {
        ctx.theme.setRadius(radius.value);
        ctx.close();
      },
    });
  }

  return commands;
}

export const PALETTE_SEARCH_ICON = Search;
