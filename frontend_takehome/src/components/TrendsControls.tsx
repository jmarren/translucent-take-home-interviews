import React from "react";
import LabeledSelect from "./select/LabeledSelect";
import ChartTypeSelect from "./select/ChartTypeSelect";
import { TrendsPreferencesState } from "../trendsPreferences";
import { PeriodId } from "../periods";
import { hasPreviousPeriod } from "../trendPeriods";
import { TimeSeriesChartType, TIME_SERIES_CHART_TYPES } from "../chartTypes";

const DIMENSION_OPTIONS = [
  { value: "department", label: "Department" },
  { value: "reason", label: "Reason" },
  { value: "payer", label: "Payer" },
] as const;

const GRANULARITY_OPTIONS = [
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "quarter", label: "Quarterly" },
] as const;

const POP_OPTIONS = [
  { value: "off", label: "Off" },
  { value: "on", label: "On" },
] as const;

const MOVING_AVERAGE_OPTIONS = [
  { value: "off", label: "Off" },
  { value: "3", label: "3-period" },
  { value: "6", label: "6-period" },
] as const;

interface TrendsControlsProps {
  prefs: TrendsPreferencesState;
  periodId: PeriodId;
  chartType: TimeSeriesChartType;
  onChartTypeChange: (value: TimeSeriesChartType) => void;
}

export default function TrendsControls({ prefs, periodId, chartType, onChartTypeChange }: TrendsControlsProps) {
  const popAvailable = hasPreviousPeriod(periodId);

  return (
    <div className="trends-controls">
      <LabeledSelect
        id="trends-dimension"
        label="Compare by"
        ariaLabel="Dimension to compare over time"
        value={prefs.dimension}
        options={[...DIMENSION_OPTIONS]}
        onChange={(value) => prefs.setDimension(value as typeof prefs.dimension)}
      />
      <div className="trends-toggle">
        <span className="labeled-select-label">Chart type</span>
        <ChartTypeSelect
          ariaLabel="Trends chart type"
          value={chartType}
          options={TIME_SERIES_CHART_TYPES}
          onChange={onChartTypeChange}
        />
      </div>
      <div className="trends-toggle">
        <span className="labeled-select-label">Granularity</span>
        <ChartTypeSelect
          ariaLabel="Chart granularity"
          value={prefs.granularity}
          options={[...GRANULARITY_OPTIONS]}
          onChange={(value) => prefs.setGranularity(value as typeof prefs.granularity)}
        />
      </div>
      <div className="trends-toggle" title={
        popAvailable ? undefined : "Select a specific period to compare it against the previous one"
      }>
        <span className="labeled-select-label">Compare to previous period</span>
        <ChartTypeSelect
          ariaLabel="Compare to previous period"
          value={prefs.popEnabled ? "on" : "off"}
          options={[...POP_OPTIONS]}
          onChange={(value) => prefs.setPopEnabled(value === "on")}
          disabled={!popAvailable}
        />
      </div>
      <div
        className="trends-toggle"
        title={prefs.popEnabled ? "Not available while comparing to the previous period" : undefined}
      >
        <span className="labeled-select-label">Moving average</span>
        <ChartTypeSelect
          ariaLabel="Moving average window"
          value={String(prefs.movingAverage)}
          options={[...MOVING_AVERAGE_OPTIONS]}
          onChange={(value) => prefs.setMovingAverage(value === "off" ? "off" : (Number(value) as 3 | 6))}
          disabled={prefs.popEnabled}
        />
      </div>
    </div>
  );
}
