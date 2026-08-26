import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface SidebarTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  tabs: SidebarTab[];
  activeTab: string;
  onSelectTab: (id: string) => void;
}

export default function Sidebar({ tabs, activeTab, onSelectTab }: SidebarProps) {
  return (
    <nav className="folder-tabs" aria-label="Dashboard sections">
      <ul className="folder-tabs-list" role="tablist">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <li key={tab.id}>
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                className="folder-tab"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelectTab(tab.id)}
              >
                <span className="folder-tab-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Icon className="folder-tab-icon" size={17} aria-hidden="true" />
                <span className="folder-tab-label">{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
