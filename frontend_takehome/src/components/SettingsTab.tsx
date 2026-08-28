import { FONT_GROUPS } from '../theme/fonts';
import { PALETTE_GROUPS, paletteSwatchGradient } from '../theme/palettes';
import { RADIUS_OPTIONS } from '../theme/radii';
import { SIDEBAR_STYLES } from '../theme/sidebarStyles';
import { CURSOR_STYLES } from '../theme/cursors';
import { VIZ_PALETTES } from '../theme/vizPalettes';
import { TITLE_STYLES, TitleStyle } from '../theme/titleStyles';
import { LayoutState } from './Layout';
import { useOutletContext } from 'react-router-dom';

export default function SettingsTab() {

	const { theme } = useOutletContext<LayoutState>();

	return (
		<div className="settings-tab">
			<section className="settings-section" aria-label="Command palette settings">
				<h2 className="settings-section-title">Command Palette</h2>
				<p className="settings-section-description">
					Choose whether Cmd+K/Ctrl+K and the command palette are available for navigating and changing settings.
				</p>
				<div className="settings-group">
					<div className="settings-options">
						<button
							type="button"
							className="settings-option"
							aria-pressed={theme.commandPaletteEnabled.value}
							onClick={() => theme.commandPaletteEnabled.set(true)}
						>
							On
						</button>
						<button
							type="button"
							className="settings-option"
							aria-pressed={!theme.commandPaletteEnabled.value}
							onClick={() => theme.commandPaletteEnabled.set(false)}
						>
							Off
						</button>
					</div>
				</div>
			</section>

			<section className="settings-section" aria-label="Sidebar style settings">
				<h2 className="settings-section-title">Sidebar Style</h2>
				<p className="settings-section-description">
					Choose how the always-present sidebar renders.
				</p>
				<div className="settings-group">
					<div className="settings-options">
						{SIDEBAR_STYLES.map((style) => (
							<button
								key={style.value}
								type="button"
								className="settings-option settings-nav-mode-option"
								aria-pressed={style.value === theme.sidebarStyle.value}
								onClick={() => theme.sidebarStyle.set(style.value)}
							>
								<span className="settings-nav-mode-label">{style.label}</span>
								<span className="settings-nav-mode-description">{style.description}</span>
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

			<section className="settings-section" aria-label="Visualization palette settings">
				<h2 className="settings-section-title">Visualization Colors</h2>
				<p className="settings-section-description">
					Choose the palette used to color bars, pie slices, and trend lines. Separate from the
					Color Palette above, which colors the dashboard's own chrome.
				</p>
				<div className="settings-group">
					<div className="settings-options">
						{VIZ_PALETTES.map((p) => (
							<button
								key={p.label}
								type="button"
								className="settings-option settings-viz-palette-option"
								aria-pressed={p.label === theme.vizPalette.value.label}
								onClick={() => theme.vizPalette.set(p)}
							>
								<span className="settings-viz-palette-swatches" aria-hidden="true">
									{p.colors.map((color, index) => (
										<span key={index} className="settings-viz-palette-swatch" style={{ backgroundColor: color }} />
									))}
								</span>
								{p.label}
							</button>
						))}
					</div>
				</div>
			</section>

			<section className="settings-section" aria-label="Chart animation settings">
				<h2 className="settings-section-title">Chart Animations</h2>
				<p className="settings-section-description">
					Choose whether charts animate in -- pie slices fanning out, bars growing, lines drawing on.
				</p>
				<div className="settings-group">
					<div className="settings-options">
						<button
							type="button"
							className="settings-option"
							aria-pressed={theme.chartAnimationsEnabled.value}
							onClick={() => theme.chartAnimationsEnabled.set(true)}
						>
							On
						</button>
						<button
							type="button"
							className="settings-option"
							aria-pressed={!theme.chartAnimationsEnabled.value}
							onClick={() => theme.chartAnimationsEnabled.set(false)}
						>
							Off
						</button>
					</div>
				</div>
			</section>

			<section className="settings-section" aria-label="Trend color settings">
				<h2 className="settings-section-title">Trend Color</h2>
				<p className="settings-section-description">
					Choose the accent color for the Breakdown page's single-series Trend card. Independent
					of Visualization Colors above, which needs a whole palette rather than one color.
				</p>
				<div className="settings-group">
					<label className="settings-color-picker">
						<input
							type="color"
							className="settings-color-picker-input"
							value={theme.trendColor.value}
							onChange={(event) => theme.trendColor.set(event.target.value)}
							aria-label="Trend card color"
						/>
						{theme.trendColor.value}
					</label>
				</div>
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
