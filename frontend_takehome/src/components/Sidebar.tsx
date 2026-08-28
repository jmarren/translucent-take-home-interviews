import React, { useState } from 'react';
import { TABS } from '../tabs';
import { LayoutState } from './Layout';

const SIDEBAR_STYLE_CLASSES = {
	expanded: 'sidebar',
	'icons-only': 'sidebar sidebar-icons-only',
	flyout: 'sidebar sidebar-flyout',
};

export default function Sidebar({ layoutState }: { layoutState: LayoutState }) {
	const sidebarStyle = layoutState.theme.sidebarStyle.value;
	// Icons Only hides labels outright (an intentionally narrow, fixed
	// sidebar); Flyout keeps them in the layout so the hover/focus expansion
	// (see .sidebar-flyout in index.css) has real text to reveal, not just
	// an empty space that pops in. Either way the label stays in the DOM
	// (never removed) so it's always available to screen readers -- only
	// its visual presentation differs.
	const labelClassName = sidebarStyle === 'icons-only' ? 'visually-hidden' : 'sidebar-tab-label';

	// Flyout's expansion used to be driven purely by CSS :hover/:focus-within
	// -- but a mouse click focuses the clicked tab button in most browsers,
	// and that focus (not the hover) is what :focus-within actually tracks.
	// Moving the mouse away then left the sidebar still expanded, since
	// :focus-within stayed true until something else stole focus (a
	// "blur", as reported) rather than collapsing as soon as the cursor
	// left. Fixed with two changes together: hover is now tracked here in
	// JS (`sidebar-flyout-hovered`, cleared the instant the cursor leaves,
	// no lingering-focus ambiguity) instead of relying on CSS :hover, and
	// a mouse-triggered tab click blurs its button right afterward
	// (blurIfMouseClick, below) so that click's own focus can't keep
	// :focus-within true once the mouse leaves either. Keyboard activation
	// is untouched -- :focus-within staying true while tabbing through is
	// still exactly what makes the labels reachable without a mouse.
	const [isHovered, setIsHovered] = useState(false);
	const expandedClassName = sidebarStyle === 'flyout' && isHovered ? 'sidebar-flyout-hovered' : '';

	// A click fires for both a real mouse click and a keyboard-triggered
	// activation (Enter/Space on a focused button) -- blurring unconditionally
	// here would also blur a keyboard user right after they activate a tab,
	// which is exactly the focus :focus-within needs to keep the sidebar
	// expanded while tabbing through. MouseEvent.detail is 0 for a
	// keyboard-triggered click and >=1 for a real mouse click (it's the
	// click count), which is what actually distinguishes them -- so this
	// only blurs the mouse case, leaving keyboard focus untouched.
	function blurIfMouseClick(event: React.MouseEvent<HTMLButtonElement>) {
		if (event.detail > 0) event.currentTarget.blur();
	}

	return (
		<nav
			className={`${SIDEBAR_STYLE_CLASSES[sidebarStyle]} ${expandedClassName}`.trim()}
			aria-label="Dashboard sections"
		>
			{/* Hover tracking lives here, on the list that tightly wraps just
			    the tabs, rather than on the <nav> itself -- the <nav> also
			    includes the sidebar's own padding/whitespace margins, and
			    the flyout shouldn't expand just because the cursor is
			    somewhere in that empty space, only while actually over a
			    tab. */}
			<ul
				className="sidebar-list"
				role="tablist"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{TABS.map((tab) => {
					const Icon = tab.icon;
					return (
						<li key={tab.id}>
							<button
								type="button"
								className="sidebar-tab"
								aria-current={tab.id === layoutState.navigation.activeTab.value ? 'page' : undefined}
								onClick={(event) => {
									layoutState.navigation.activeTab.set(tab.id);
									blurIfMouseClick(event);
								}}
							>
								<Icon className="sidebar-tab-icon" size={18} aria-hidden="true" />
								<span className={labelClassName}>{tab.label}</span>
							</button>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
