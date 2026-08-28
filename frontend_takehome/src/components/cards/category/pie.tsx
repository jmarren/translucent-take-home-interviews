import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PieChart, Pie, Cell, Sector, Tooltip, ResponsiveContainer } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';
import { MetricId } from '../../../types';
import { CategoryTotal, formatterFor, colorFor, PIE_LABEL_FONT_SIZE } from './shared';

// The hovered slice grows 10% via a CSS transform, not by recomputing the
// sector's own path radii -- SVG path `d` isn't animatable through CSS
// transitions in any browser, but `transform` is, so scaling is the only
// way to get an eased, animated grow rather than an instant jump. Scaling
// around the pie's own center (transform-origin, not the slice's
// midpoint) keeps the slice's inner edge anchored at the center point
// like every other slice, growing outward along its own radius rather
// than drifting off-center. Shared between the sector (below) and its
// label (renderPieLabel) so both animate together.
const PIE_ACTIVE_SCALE = 1.1;
const PIE_ACTIVE_TRANSITION = 'transform 0.5s ease-in';

// Every sector/label -- active or not -- needs this same style object
// shape (same transition, only the scale differing) at all times, not
// just the hovered one. Recharts' activeShape swap only replaces which
// *element* renders for the hovered slice; if the inactive state never
// sets transform/transition at all, the very first paint after a slice
// becomes active already shows the scaled value with nothing to
// transition from, so the "animation" would jump instantly instead of
// easing in. Giving every slice a real scale(1) baseline at all times is
// what makes scale(1) -> scale(1.1) (and back) an actual, interpolated
// transition rather than an instant swap.
function sliceStyle(cx: number | undefined, cy: number | undefined, active: boolean): React.CSSProperties {
	// transform-origin's default reference frame (transform-box: view-box)
	// is exactly right here -- cx/cy are already absolute coordinates
	// within the chart's own SVG viewport (same space Recharts positions
	// every sector/label in), not relative to this element's own bounding
	// box, so transform-box: fill-box would misinterpret them.
	return {
		transformOrigin: `${cx}px ${cy}px`,
		transform: `scale(${active ? PIE_ACTIVE_SCALE : 1})`,
		transition: PIE_ACTIVE_TRANSITION,
	};
}

// Recharts (2.x; activeShape/activeIndex were removed in 3.0) renders
// whatever activeShape/inactiveShape return in place of each sector's
// default shape, for the hovered slice and every other slice
// respectively, whenever any slice is active -- Recharts itself already
// decides which of the two functions to call per sector via activeIndex,
// so this only ever needs a plain boolean, not a per-sector index
// comparison. Both roles share this one renderer.
function renderSectorShape(grown: boolean) {
	return function SectorShape(props: PieSectorDataItem) {
		const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
		return (
			<Sector
				cx={cx}
				cy={cy}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={startAngle}
				endAngle={endAngle}
				fill={fill}
				style={sliceStyle(cx, cy, grown)}
			/>
		);
	};
}

// Renders category name and percentage as two fixed <tspan> lines instead
// of one plain string -- a single string left Recharts/the browser's own
// text layout to decide where to wrap, which broke different slices at
// different points (e.g. "Radiology:\n46%" vs. "Orthopedics: 54%") for no
// reason a viewer could predict. Every slice now wraps the same way
// regardless of name length.
//
// Recharts always positions every label off the *unscaled* sector
// geometry (Pie.renderLabels computes label coordinates independently of
// activeShape/activeIndex, so a grown slice's own label never moves on
// its own) -- applying the same sliceStyle transform here, always (same
// reasoning as sliceStyle's own comment: every label needs a real
// scale(1) baseline at all times, not just the active one, or its first
// scaled paint has nothing to transition from), is what makes the label
// visually track the enlarged slice instead of staying put while the
// slice grows out from under it.
function renderPieLabel(total: number, grownIndex: number | undefined) {
	return function PieLabel(props: any) {
		const { x, y, cx, cy, index, textAnchor, fill, category, amount } = props;
		const pct = `${((amount / total) * 100).toFixed(0)}%`;
		return (
			<text
				x={x}
				y={y}
				textAnchor={textAnchor}
				fill={fill}
				fontSize={PIE_LABEL_FONT_SIZE}
				style={sliceStyle(cx, cy, index === grownIndex)}
			>
				<tspan x={x} dy="-0.3em">{category}</tspan>
				<tspan x={x} dy="1.2em">{pct}</tspan>
			</text>
		);
	};
}

export default function PieView({
	chartData,
	vizColors,
	metric,
	minWidth,
	height,
	animationsEnabled,
	expanded,
}: {
	chartData: CategoryTotal[];
	vizColors: string[];
	metric: MetricId;
	minWidth: number;
	height: number;
	animationsEnabled: boolean;
	expanded: boolean;
}) {
	const format = formatterFor(metric);
	const total = useMemo(() => chartData.reduce((sum, d) => sum + d.amount, 0), [chartData]);
	// activeIndex switches which sector Recharts treats as hovered (its own
	// hit-testing, tooltip, etc.) the instant the mouse enters -- but the
	// *scale* only follows on grownIndex, set one animation frame later.
	// Recharts only applies inactiveShape's style while some slice is
	// active, so idle sectors never carry a transform/transition at all;
	// jumping straight to scale(1.1) on the same paint that first
	// introduces transform/transition to that element leaves the browser
	// nothing to interpolate from, so the "transition" would jump
	// instantly instead of easing in. Rendering one frame at scale(1) (a
	// real transform value, just not yet the grown one) before flipping to
	// scale(1.1) gives it a real prior frame to animate from. Hover-out
	// doesn't need the same delay -- by then the sector's already carrying
	// a real transform from being active, so dropping straight back to
	// undefined/scale(1) already has something to transition from.
	const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
	const [grownIndex, setGrownIndex] = useState<number | undefined>(undefined);
	const growFrame = useRef<number>();

	function handleSliceEnter(index: number) {
		setActiveIndex(index);
		if (growFrame.current) cancelAnimationFrame(growFrame.current);
		growFrame.current = requestAnimationFrame(() => setGrownIndex(index));
	}

	function handleSliceLeave() {
		if (growFrame.current) cancelAnimationFrame(growFrame.current);
		setActiveIndex(undefined);
		setGrownIndex(undefined);
	}

	// Cancels a still-pending grow frame if this card's data changes chart
	// type or unmounts mid-hover (e.g. filters change while a slice is
	// mid-hover) -- without this, the queued requestAnimationFrame callback
	// would still fire and call setGrownIndex on an unmounted component.
	useEffect(() => {
		return () => {
			if (growFrame.current) cancelAnimationFrame(growFrame.current);
		};
	}, []);

	return (
		// width="100%" fills the whole card, but the pie itself is capped at
		// `minWidth` (== the pie's diameter plus its widest label on each
		// side) via the wrapper's maxWidth below -- otherwise on a card wider
		// than that, the pie (whose diameter is governed by `height`, not
		// width) just sits centered in a much wider box, wasting horizontal
		// space either side instead of the container matching what it needs.
		// Expanded lifts that cap entirely, since a bigger pie is exactly
		// the point of expanding the card.
		<div className="pie-chart-wrapper" style={{ width: '100%', maxWidth: expanded ? 'none' : minWidth, height: expanded ? '100%' : undefined, margin: '0 auto' }}>
			<ResponsiveContainer width="100%" height={expanded ? '100%' : height} minWidth={minWidth}>
				<PieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }} >
					<Pie
						labelLine={false}
						data={chartData}
						dataKey="amount"
						nameKey="category"
						cx="50%"
						cy="50%"
						outerRadius="50%"
						label={renderPieLabel(total, grownIndex)}
						isAnimationActive={animationsEnabled}
						activeIndex={activeIndex}
						activeShape={renderSectorShape(activeIndex !== undefined && grownIndex === activeIndex)}
						inactiveShape={renderSectorShape(false)}
						onMouseEnter={(_data, index) => handleSliceEnter(index)}
						onMouseLeave={handleSliceLeave}
					>
						{chartData.map((entry, index) => (
							<Cell key={entry.category} fill={colorFor(index, vizColors)} />
						))}
					</Pie>
					<Tooltip formatter={(value: number, _name, item) => [format(value), item?.payload?.category]} />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
