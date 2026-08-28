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

// Every category gets its color by position in the user's chosen viz
// palette (theme/vizPalettes.ts) -- no per-category identity is pinned
// to a specific value, so switching palettes recolors every chart
// uniformly, including Department/Payer.
export function colorFor(index: number, vizColors: string[]): string {
	return vizColors[index % vizColors.length];
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

// A vertical bar chart's height doesn't scale with category count the way
// the horizontal bar's does above -- more categories there means more rows
// stacked vertically (so the chart needs more height to keep each bar the
// same thickness), but more categories here just means each vertical bar
// gets narrower within a fixed height, the same way the pie chart's
// diameter (ASSUMED_PIE_DIAMETER below) doesn't grow with category count
// either. Picked to roughly match pieChartHeight()'s scale, so a vertical
// bar card doesn't look wildly shorter/taller than a pie or horizontal bar
// card sharing the same row (.charts-row stretches every card in a row to
// its tallest member either way, but a huge height mismatch would still
// waste a lot of visible whitespace in the shorter cards).
export const VERTICAL_BAR_CHART_HEIGHT = 320;

// Width, unlike height, DOES need to scale with category count here --
// Recharts' XAxis silently drops whichever tick labels don't fit rather
// than wrapping or rotating them, so a fixed-width chart with several
// long category names (e.g. Reasons) was rendering with some labels
// missing entirely rather than visibly cramped. Each category gets a
// slot at least MIN_BAR_SLOT_WIDTH wide (enough for the bar itself plus
// tick spacing even for a short label), or wide enough for its own
// label text at the X-axis's 12px tick font -- whichever is larger --
// summed across every category, the same "sum a fixed-or-content-driven
// slot per item" shape barChartHeight() above already uses for the
// horizontal bar's height.
const VERTICAL_BAR_TICK_FONT_SIZE = 12;
const VERTICAL_BAR_LABEL_CHAR_WIDTH = VERTICAL_BAR_TICK_FONT_SIZE * 0.6;
const MIN_BAR_SLOT_WIDTH = 64;
const VERTICAL_BAR_CHART_HORIZONTAL_PADDING = 16; // margin.left + margin.right

export function verticalBarChartMinWidth(chartData: CategoryTotal[]): number {
	const slotWidths = chartData.map((d) =>
		Math.max(MIN_BAR_SLOT_WIDTH, Math.ceil(d.category.length * VERTICAL_BAR_LABEL_CHAR_WIDTH) + 16),
	);
	return slotWidths.reduce((sum, width) => sum + width, 0) + VERTICAL_BAR_CHART_HORIZONTAL_PADDING;
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
