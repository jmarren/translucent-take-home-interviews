import React from "react";
import LabeledSelect from "./select/LabeledSelect";
import ChartTypeSelect from "./select/ChartTypeSelect";
import { TrendsPreferencesState } from "../trendsPreferences";
import { PeriodId } from "../periods";
import { hasPreviousPeriod } from "../trendPeriods";

const DIMENSION_OPTIONS = [
  { value: "department", label: "Department" },
  { value: "reason", label: "Reason" },
  { value: "payer", label: "Payer" },
] as const;

const GRANULARITY_OPTIONS = [
  { value: "month", label: "Monthly" },
  { value: "week", label: "Weekly" },
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
}

export default function TrendsControls({ prefs, periodId }: TrendsControlsProps) {
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
