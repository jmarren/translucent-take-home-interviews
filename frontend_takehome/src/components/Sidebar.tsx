import React from 'react';
import { DashboardTab } from '../tabs';

interface SidebarProps {
  tabs: DashboardTab[];
  activeTab: string;
  onSelectTab: (id: string) => void;
}

export default function Sidebar({ tabs, activeTab, onSelectTab }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Dashboard sections">
      <ul className="sidebar-list" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <li key={tab.id}>
              <button
                type="button"
                className="sidebar-tab"
                aria-current={tab.id === activeTab ? 'page' : undefined}
                onClick={() => onSelectTab(tab.id)}
              >
                <Icon className="sidebar-tab-icon" size={18} aria-hidden="true" />
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
