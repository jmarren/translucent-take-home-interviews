import { PieChart, Landmark, TrendingUp, Table, Settings } from 'lucide-react';
import { SidebarTab } from './components/Sidebar';

export const TABS: SidebarTab[] = [
  { id: 'reason-breakdown', label: 'Reason Breakdown', icon: PieChart },
  { id: 'payer-breakdown', label: 'Payer Breakdown', icon: Landmark },
  { id: 'trends', label: 'Trends Over Time', icon: TrendingUp },
  { id: 'records', label: 'Denial Records', icon: Table },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const TAB_DESCRIPTIONS: Record<string, string> = {
  'payer-breakdown':
    'Coming soon: total denied amount by payer, so you can see which insurers are denying the most claims.',
  trends:
    'Coming soon: denial volume and dollar amount over time, to spot spikes and seasonal patterns.',
  records:
    'Coming soon: the full, sortable table of individual denial records currently shown below the chart.',
};

export const DEFAULT_TAB_ID = TABS[0].id;

export function isValidTabId(id: string | undefined): id is string {
  return !!id && TABS.some((t) => t.id === id);
}
