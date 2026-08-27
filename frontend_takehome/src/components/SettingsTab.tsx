import { FONT_GROUPS } from '../theme/fonts';
import { PALETTE_GROUPS, paletteSwatchGradient } from '../theme/palettes';
import { RADIUS_OPTIONS } from '../theme/radii';
import { NAV_MODES, } from '../theme/navModes';
import { CURSOR_STYLES } from '../theme/cursors';
import { TITLE_STYLES, TitleStyle } from '../theme/titleStyles';
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
								aria-pressed={mode.value === theme.navMode.value}
								onClick={() => theme.navMode.set(mode.value)}
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
									aria-pressed={f.value === theme.font.value}
									onClick={() => theme.font.set(f.value)}
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
									aria-pressed={p.label === theme.palette.value.label}
									onClick={() => theme.palette.set(p)}
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
								aria-pressed={r.value === theme.radius.value}
								onClick={() => theme.radius.set(r.value)}
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

			<section className="settings-section" aria-label="Cursor settings">
				<h2 className="settings-section-title">Cursor</h2>
				<p className="settings-section-description">
					Choose the cursor shown while hovering the dashboard.
				</p>
				<div className="settings-group">
					<div className="settings-options">
						{CURSOR_STYLES.map((style) => (
							<button
								key={style.value}
								type="button"
								className="settings-option settings-nav-mode-option"
								aria-pressed={style.value === theme.cursorStyle.value}
								onClick={() => theme.cursorStyle.set(style.value)}
							>
								<span className="settings-nav-mode-label">{style.label}</span>
								<span className="settings-nav-mode-description">{style.description}</span>
							</button>
						))}
					</div>
				</div>
			</section>

			<section className="settings-section" aria-label="Title style settings">
				<h2 className="settings-section-title">Title Style</h2>
				<p className="settings-section-description">
					Choose the title treatment for the summary panel's stat labels, and separately for
					chart-card titles and the Denial-Level Detail heading.
				</p>
				<div className="settings-group">
					<p className="settings-group-label">Summary Panel</p>
					<TitleStyleOptions active={theme.primaryTitleStyle.value} onChange={theme.primaryTitleStyle.set} />
				</div>
				<div className="settings-group">
					<p className="settings-group-label">Charts &amp; Denial-Level Detail</p>
					<TitleStyleOptions active={theme.secondaryTitleStyle.value} onChange={theme.secondaryTitleStyle.set} />
				</div>
			</section>
		</div>
	);
}

function TitleStyleOptions({
	active,
	onChange,
}: {
	active: TitleStyle;
	onChange: (style: TitleStyle) => void;
}) {
	return (
		<div className="settings-options">
			{TITLE_STYLES.map((style) => (
				<button
					key={style.label}
					type="button"
					className="settings-option settings-title-style-option"
					aria-pressed={style.label === active.label}
					onClick={() => onChange(style)}
				>
					<span
						className="settings-title-style-sample"
						style={{
							fontSize: style.fontSize,
							fontWeight: style.fontWeight,
							textTransform: style.textTransform,
							letterSpacing: style.letterSpacing,
							color: style.emphasis === 'primary' ? 'var(--text-primary)' : 'var(--text-secondary)',
						}}
					>
						Sample Title
					</span>
					{style.label}
				</button>
			))}
		</div>
	);
}
