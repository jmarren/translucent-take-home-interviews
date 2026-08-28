import React, { useMemo } from "react";
import {
	AreaChart,
	Area,
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Denial, MetricId } from "../types";
import { PeriodId } from "../periods";
import { TrendsPreferences } from "../hooks/useTrendsPreferences";
import { useMultiSeriesTrend, MultiSeriesPoint } from "../hooks/useMultiSeriesTrend";
import { buildPopBuckets, PositionBucket } from "../trends/trendPeriods";
import { computeDeltaStats } from "../trends/trendDeltaStats";
import { MovingAverageWindow, withMovingAverages } from "../trends/trendMovingAverage";
import { TimeSeriesChartType } from "../chartTypes";

const currency = (value: number) =>
	`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const compactCurrency = (value: number) =>
	`$${Math.round(value / 1000).toLocaleString()}k`;

const plainCount = (value: number) => value.toLocaleString();

function formatterFor(metric: MetricId) {
	return metric === "count" ? plainCount : currency;
}

function compactFormatterFor(metric: MetricId) {
	return metric === "count" ? plainCount : compactCurrency;
}

function colorsFor(seriesNames: string[], vizColors: string[]): Record<string, string> {
	const colors: Record<string, string> = {};
	seriesNames.forEach((name, index) => {
		colors[name] = vizColors[index % vizColors.length];
	});
	return colors;
}

interface MultiSeriesTrendCardProps {
	data: Denial[];
	unfilteredByPeriod: Denial[];
	referenceDate: Date;
	loading?: boolean;
	prefs: TrendsPreferences;
	periodId: PeriodId;
	metric: MetricId;
	chartType: TimeSeriesChartType;
	vizColors: string[];
	animationsEnabled: boolean;
	captionsEnabled: boolean;
}

interface SimpleViewProps {
	points: MultiSeriesPoint[];
	seriesNames: string[];
	colors: Record<string, string>;
	chartType: TimeSeriesChartType;
	movingAverage: MovingAverageWindow;
	metric: MetricId;
	animationsEnabled: boolean;
}

function SimpleView({ points, seriesNames, colors, chartType, movingAverage, metric, animationsEnabled }: SimpleViewProps) {
	const format = formatterFor(metric);
	const compactFormat = compactFormatterFor(metric);
	const commonAxisProps = {
		tick: { fontSize: 12 },
		tickLine: false,
		axisLine: false,
	};

	const pointsWithAverages =
		movingAverage === "off" ? points : withMovingAverages(points, seriesNames, movingAverage);

	if (chartType === "bar") {
		return (
			<ResponsiveContainer width="100%">
				<BarChart data={pointsWithAverages} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" vertical={false} />
					<XAxis dataKey="bucketLabel" {...commonAxisProps} />
					<YAxis tickFormatter={compactFormat} width={56} {...commonAxisProps} />
					<Tooltip formatter={(value: number, name) => [format(value), name]} />
					{seriesNames.map((name) => (
						<Bar key={name} dataKey={name} fill={colors[name]} radius={[3, 3, 0, 0]} isAnimationActive={animationsEnabled} />
					))}
				</BarChart>
			</ResponsiveContainer>
		);
	}

	if (chartType === "area") {
		return (
			<ResponsiveContainer width="100%">
				<AreaChart data={pointsWithAverages} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" vertical={false} />
					<XAxis dataKey="bucketLabel" {...commonAxisProps} />
					<YAxis tickFormatter={compactFormat} width={56} {...commonAxisProps} />
					<Tooltip formatter={(value: number, name) => [format(value), name]} />
					{seriesNames.map((name) => (
						<Area
							key={name}
							type="monotone"
							dataKey={name}
							stroke={colors[name]}
							fill={colors[name]}
							fillOpacity={0.12}
							strokeWidth={2}
							isAnimationActive={animationsEnabled}
						/>
					))}
				</AreaChart>
			</ResponsiveContainer>
		);
	}

	return (
		<ResponsiveContainer width="100%">
			<LineChart data={pointsWithAverages} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
				<CartesianGrid strokeDasharray="3 3" vertical={false} />
				<XAxis dataKey="bucketLabel" {...commonAxisProps} />
				<YAxis tickFormatter={compactFormat} width={56} {...commonAxisProps} />
				<Tooltip formatter={(value: number, name) => [format(value), name]} />
				{seriesNames.map((name) => (
					<Line
						key={name}
						type="monotone"
						dataKey={name}
						stroke={colors[name]}
						strokeWidth={2}
						dot={{ r: 2 }}
						isAnimationActive={animationsEnabled}
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	);
}

interface PopPoint {
	position: number;
	positionLabel: string;
	[key: string]: string | number;
}

function buildPopPoints(
	currentBuckets: PositionBucket[],
	previousBuckets: PositionBucket[],
	seriesNames: string[]
): PopPoint[] {
	const length = Math.max(currentBuckets.length, previousBuckets.length);
	const points: PopPoint[] = [];
	for (let i = 0; i < length; i++) {
		const current = currentBuckets[i];
		const previous = previousBuckets[i];
		const point: PopPoint = {
			position: i,
			positionLabel: current?.positionLabel ?? previous?.positionLabel ?? `#${i + 1}`,
		};
		for (const name of seriesNames) {
			point[name] = current?.totalsBySeries.get(name) ?? 0;
			point[`${name} (prior)`] = previous?.totalsBySeries.get(name) ?? 0;
		}
		points.push(point);
	}
	return points;
}

function PopView({ points, seriesNames, colors, metric, animationsEnabled }: {
	points: PopPoint[];
	seriesNames: string[];
	colors: Record<string, string>;
	metric: MetricId;
	animationsEnabled: boolean;
}) {
	const format = formatterFor(metric);
	const compactFormat = compactFormatterFor(metric);
	return (
		<ResponsiveContainer width="100%">
			<LineChart data={points} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
				<CartesianGrid strokeDasharray="3 3" vertical={false} />
				<XAxis dataKey="positionLabel" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
				<YAxis tickFormatter={compactFormat} width={56} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
				<Tooltip formatter={(value: number, name) => [format(value), name]} />
				{seriesNames.map((name) => (
					<Line
						key={name}
						type="monotone"
						dataKey={name}
						stroke={colors[name]}
						strokeWidth={2}
						dot={{ r: 2 }}
						isAnimationActive={animationsEnabled}
					/>
				))}
				{seriesNames.map((name) => (
					<Line
						key={`${name}-prior`}
						type="monotone"
						dataKey={`${name} (prior)`}
						stroke={colors[name]}
						strokeWidth={2}
						strokeDasharray="5 5"
						dot={{ r: 2 }}
						isAnimationActive={animationsEnabled}
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	);
}

function DeltaStrip({
	currentBuckets,
	previousBuckets,
	seriesNames,
	metric,
}: {
	currentBuckets: PositionBucket[];
	previousBuckets: PositionBucket[];
	seriesNames: string[];
	metric: MetricId;
}) {
	const format = formatterFor(metric);
	const stats = useMemo(() => {
		const currentTotals = new Map<string, number>();
		for (const bucket of currentBuckets) {
			bucket.totalsBySeries.forEach((amount, name) => {
				currentTotals.set(name, (currentTotals.get(name) ?? 0) + amount);
			});
		}
		const previousTotals = new Map<string, number>();
		for (const bucket of previousBuckets) {
			bucket.totalsBySeries.forEach((amount, name) => {
				previousTotals.set(name, (previousTotals.get(name) ?? 0) + amount);
			});
		}
		return computeDeltaStats(currentTotals, previousTotals, seriesNames);
	}, [currentBuckets, previousBuckets, seriesNames]);

	const headlineSign = stats.headline.current >= stats.headline.previous ? "+" : "";

	return (
		<div className="trend-delta-strip">
			<div className="trend-delta-chip trend-delta-chip-headline">
				<span className="trend-delta-chip-label">{metric === "count" ? "Total denials" : "Total denied"}</span>
				<span className="trend-delta-chip-value">
					{format(stats.headline.previous)} → {format(stats.headline.current)}
					{" "}
					<span className={stats.headline.current >= stats.headline.previous ? "trend-delta-up" : "trend-delta-down"}>
						({headlineSign}
						{stats.headline.pctChange.toFixed(1)}%)
					</span>
				</span>
			</div>
			{stats.topMovers.map((mover) => (
				<div key={mover.name} className="trend-delta-chip">
					<span className="trend-delta-chip-label">{mover.name}</span>
					<span className="trend-delta-chip-value">
						<span className={mover.delta >= 0 ? "trend-delta-up" : "trend-delta-down"}>
							{mover.delta >= 0 ? "+" : ""}
							{format(mover.delta)}
						</span>
					</span>
				</div>
			))}
		</div>
	);
}

export default function MultiSeriesTrendCard({
	data,
	unfilteredByPeriod,
	referenceDate,
	loading = false,
	prefs,
	periodId,
	metric,
	chartType,
	vizColors,
	animationsEnabled,
	captionsEnabled,
}: MultiSeriesTrendCardProps) {
	const { points, seriesNames } = useMultiSeriesTrend(data, {
		granularity: prefs.granularity.value,
		dimension: prefs.dimension.value,
		metric,
	});
	const colors = useMemo(() => colorsFor(seriesNames, vizColors), [seriesNames, vizColors]);

	const popBuckets = useMemo(() => {
		if (!prefs.popEnabled.value) return null;
		return buildPopBuckets(
			unfilteredByPeriod,
			periodId,
			referenceDate,
			prefs.granularity.value,
			(denial) => {
				switch (prefs.dimension.value) {
					case "department":
						return denial.department;
					case "payer":
						return denial.payer;
					case "reason":
						return denial.reason;
				}
			},
			metric
		);
	}, [unfilteredByPeriod, periodId, referenceDate, prefs.popEnabled.value, prefs.granularity.value, prefs.dimension.value, metric]);

	const popPoints = useMemo(
		() => (popBuckets ? buildPopPoints(popBuckets.currentBuckets, popBuckets.previousBuckets, seriesNames) : null),
		[popBuckets, seriesNames]
	);

	return (
		<section className="trends-chart-card chart-card-exhibit" aria-label="Denial trends over time">
			{popPoints && popBuckets && (
				<DeltaStrip
					currentBuckets={popBuckets.currentBuckets}
					previousBuckets={popBuckets.previousBuckets}
					seriesNames={seriesNames}
					metric={metric}
				/>
			)}
			<div className="chart-card-body trends-chart-card-body">
				{loading ? (
					<div className="chart-skeleton" style={{ height: 360 }} aria-hidden="true" />
				) : points.length === 0 ? (
					<p>No denial data to display.</p>
				) : popPoints ? (
					<PopView points={popPoints} seriesNames={seriesNames} colors={colors} metric={metric} animationsEnabled={animationsEnabled} />
				) : (
					<SimpleView
						points={points}
						seriesNames={seriesNames}
						colors={colors}
						chartType={chartType}
						movingAverage={prefs.popEnabled.value ? "off" : prefs.movingAverage.value}
						metric={metric}
						animationsEnabled={animationsEnabled}
					/>
				)}
			</div>
			{captionsEnabled && (
				<p className="chart-card-caption">
					{metric === "count" ? "Denial count" : "Total denied dollars"} over time, split by {prefs.dimension.value}
					{popPoints
						? " — solid lines are the current period, dashed are the previous period."
						: !prefs.popEnabled.value && prefs.movingAverage.value !== "off"
							? ` — smoothed as a ${prefs.movingAverage.value}-period moving average.`
							: "."}
				</p>
			)}
		</section>
	);
}
