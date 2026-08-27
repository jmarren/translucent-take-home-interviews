import { MetricId } from '../../../types';

export interface CategoryTotal {
	category: string;
	amount: number;
}

const currency = (value: number) =>
	`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const count = (value: number) => value.toLocaleString();

export function formatterFor(metric: MetricId) {
	return metric === 'count' ? count : currency;
}

// Used when a card doesn't supply its own `colors` map -- assigned by
// position rather than by category value, since a card with no natural
// per-category identity (e.g. denial reason) has no meaningful way to pin
// a specific color to a specific value.
export const DEFAULT_SLICE_COLORS = [
	'#5b7fa6', '#2c423f', '#4c5b61', '#8a5a44', '#b08d3e', '#829191', '#949b96', '#c5c5c5',
];

const FALLBACK_COLOR = '#949b96'; // default palette's greyOlive2

export function colorFor(category: string, index: number, colors?: Record<string, string>): string {
	if (colors) return colors[category] ?? FALLBACK_COLOR;
	return DEFAULT_SLICE_COLORS[index % DEFAULT_SLICE_COLORS.length];
}

// A horizontal bar's thickness used to just be "576px card height / category
// count" -- fine for 8 categories, but a card with only 3-5 categories (e.g.
// Payers, Departments) ended up with absurdly thick bars filling that same
// fixed height. Fixing the per-bar thickness (via Recharts' `barSize`, not
// just `maxBarSize`, so it renders at exactly this value rather than
// somewhere-up-to-it) and deriving the chart's own height from category
// count (below) means bar thickness stays consistent across cards
// regardless of how many categories a given card happens to have, and a
// card with fewer categories is simply a shorter card. MIN_BAR_THICKNESS is
// a floor on that fixed thickness -- guards against ever tuning
// MAX_BAR_THICKNESS down to something too thin to click/read.
const MAX_BAR_THICKNESS = 40;
const MIN_BAR_THICKNESS = 27;
export const BAR_THICKNESS = Math.max(MIN_BAR_THICKNESS, MAX_BAR_THICKNESS);
const BAR_CHART_VERTICAL_PADDING = 16; // margin.top + margin.bottom

export function barChartHeight(categoryCount: number): number {
	return categoryCount * BAR_THICKNESS + BAR_CHART_VERTICAL_PADDING;
}

// A rough per-character width estimate at the pie label's 15px font-size,
// used to size layout around the label text without measuring actual
// glyphs via canvas. ~0.5em/char is a reasonable average for mixed-case
// sans-serif text -- 0.6em (tried first) reserved noticeably more
// horizontal clearance than the label text actually needed.
export const PIE_LABEL_FONT_SIZE = 15;
const PIE_LABEL_CHAR_WIDTH = PIE_LABEL_FONT_SIZE * 0.5;
const PIE_LABEL_LINE_HEIGHT = PIE_LABEL_FONT_SIZE * 1.2;

// The pie itself has no fixed width -- it fills whatever the card gives it
// (`outerRadius="50%"` of the ResponsiveContainer) -- but the card still
// needs *some* min-width floor so it doesn't get squeezed smaller than the
// pie plus its labels can actually fit. This is the assumed pie diameter
// used for that floor, not a hard cap on how large the pie can render.
export const ASSUMED_PIE_DIAMETER = 240;

export function widestLabelWidth(chartData: CategoryTotal[]): number {
	const widestChars = chartData.reduce((max, d) => Math.max(max, d.category.length), 0);
	return Math.ceil(widestChars * PIE_LABEL_CHAR_WIDTH);
}

// The label's category-name/percentage stack is always exactly 2 lines tall
// (see renderPieLabel's two fixed <tspan>s in pie.tsx), unlike its width,
// which varies with the category name -- so unlike the width margin above,
// the vertical margin above/below the pie doesn't need to scale with label
// content at all, just fit those 2 fixed lines once per edge.
export function pieChartHeight(): number {
	return ASSUMED_PIE_DIAMETER + PIE_LABEL_LINE_HEIGHT * 2 * 2; // 2 lines, top + bottom
}
