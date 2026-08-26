import React from 'react';

export interface SidebarTab {
  id: string;
  label: string;
}

interface SidebarProps {
  tabs: SidebarTab[];
  activeTab: string;
  onSelectTab: (id: string) => void;
}

export default function Sidebar({ tabs, activeTab, onSelectTab }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Dashboard sections">
      <ul className="sidebar-list" role="tablist">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
              className="sidebar-tab"
              aria-current={tab.id === activeTab ? 'page' : undefined}
              onClick={() => onSelectTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
