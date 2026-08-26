import React from 'react';
import { Search } from 'lucide-react';
import { DashboardTab } from '../tabs';

interface TopBarProps {
  tabs: DashboardTab[];
  activeTab: string;
  onOpenPalette: () => void;
  filterSummary: string | null;
}

/**
 * Replaces the persistent sidebar-with-tabs nav. There is no permanently-visible list
 * of destinations here on purpose -- wayfinding is a single current-view indicator
 * (icon + label, not a link to anywhere else) plus the command-palette trigger, which
 * is the only way to move between views. This is the core interaction-model change:
 * navigation is something you invoke, not something you look at.
 */
export default function TopBar({ tabs, activeTab, onOpenPalette, filterSummary }: TopBarProps) {
  const current = tabs.find((t) => t.id === activeTab);
  const CurrentIcon = current?.icon;
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPod|iPad/.test(navigator.platform ?? navigator.userAgent);

  return (
    <header className="top-bar">
      <div className="top-bar-current" aria-live="polite">
        {CurrentIcon && <CurrentIcon className="top-bar-current-icon" size={20} aria-hidden="true" />}
        <span className="top-bar-current-label">{current?.label ?? ''}</span>
        {filterSummary && <span className="top-bar-filter-summary">{filterSummary}</span>}
      </div>

      <button type="button" className="command-trigger" onClick={onOpenPalette}>
        <Search size={16} aria-hidden="true" />
        <span>Search views, filters, settings...</span>
        <kbd className="command-trigger-kbd">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
      </button>
    </header>
  );
}
