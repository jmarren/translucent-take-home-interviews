import { FONT_GROUPS } from '../fonts';
import { PALETTE_GROUPS, paletteSwatchGradient } from '../palettes';
import { RADIUS_OPTIONS } from '../radii';
import { NAV_MODES, } from '../navModes';
import { LayoutState } from './Layout';
import { useOutletContext } from 'react-router-dom';

export default function SettingsTab() {

	const { theme } = useOutletContext<LayoutState>();

	return (
		<div className="settings-tab">
			<section className="settings-section" aria-label="Navigation settings">
				<h2 className="settings-section-title">Navigation</h2>
				<p className="settings-section-description">
					Choose how you move between views in the dashboard.
				</p>
				<div className="settings-group">
					<div className="settings-options">
						{NAV_MODES.map((mode) => (
							<button
								key={mode.value}
								type="button"
								className="settings-option settings-nav-mode-option"
								aria-pressed={mode.value === theme.navMode}
								onClick={() => theme.setNavMode(mode.value)}
							>
								<span className="settings-nav-mode-label">{mode.label}</span>
								<span className="settings-nav-mode-description">{mode.description}</span>
							</button>
						))}
					</div>
				</div>
			</section>

			<section className="settings-section" aria-label="Font settings">
				<h2 className="settings-section-title">Font</h2>
				<p className="settings-section-description">
					Choose the typeface used throughout the dashboard.
				</p>
				{FONT_GROUPS.map((group) => (
					<div key={group.label} className="settings-group">
						<p className="settings-group-label">{group.label}</p>
						<div className="settings-options">
							{group.fonts.map((f) => (
								<button
									key={f.value}
									type="button"
									className="settings-option"
									aria-pressed={f.value === theme.font}
									onClick={() => theme.setFont(f.value)}
									style={{ fontFamily: f.value }}
								>
									{f.label}
								</button>
							))}
						</div>
					</div>
				))}
			</section>

			<section className="settings-section" aria-label="Color palette settings">
				<h2 className="settings-section-title">Color Palette</h2>
				<p className="settings-section-description">
					Choose the color palette used throughout the dashboard.
				</p>
				{PALETTE_GROUPS.map((group) => (
					<div key={group.label} className="settings-group">
						<p className="settings-group-label">{group.label}</p>
						<div className="settings-options">
							{group.palettes.map((p) => (
								<button
									key={p.label}
									type="button"
									className="settings-option settings-palette-option"
									aria-pressed={p.label === theme.palette.label}
									onClick={() => theme.setPalette(p)}
								>
									<span
										className="settings-palette-swatch"
										aria-hidden="true"
										style={{ background: paletteSwatchGradient(p) }}
									/>
									{p.label}
								</button>
							))}
						</div>
					</div>
				))}
			</section>

			<section className="settings-section" aria-label="Border radius settings">
				<h2 className="settings-section-title">Border Radius</h2>
				<p className="settings-section-description">
					Choose how rounded cards, buttons, and controls appear.
				</p>
				<div className="settings-group">
					<div className="settings-options">
						{RADIUS_OPTIONS.map((r) => (
							<button
								key={r.label}
								type="button"
								className="settings-option settings-radius-option"
								aria-pressed={r.value === theme.radius}
								onClick={() => theme.setRadius(r.value)}
							>
								<span
									className="settings-radius-swatch"
									aria-hidden="true"
									style={{ borderRadius: `${r.value}px` }}
								/>
								{r.label}
							</button>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
