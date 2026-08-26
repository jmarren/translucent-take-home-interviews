import { TABS } from '../tabs';
import { LayoutState } from './Layout';

export default function Sidebar({ layoutState }: { layoutState: LayoutState }) {
	return (
		<nav className="sidebar" aria-label="Dashboard sections">
			<ul className="sidebar-list" role="tablist">
				{TABS.map((tab) => {
					const Icon = tab.icon;
					return (
						<li key={tab.id}>
							<button
								type="button"
								className="sidebar-tab"
								aria-current={tab.id === layoutState.navigation.activeTab ? 'page' : undefined}
								onClick={() => layoutState.navigation.switchTo(tab.id)}
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
