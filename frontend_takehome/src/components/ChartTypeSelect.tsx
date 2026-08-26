import React from 'react';
import * as Select from '@radix-ui/react-select';

export interface ChartTypeSelectOption<T extends string> {
  value: T;
  label: string;
}

interface ChartTypeSelectProps<T extends string> {
  ariaLabel: string;
  value: T;
  options: ChartTypeSelectOption<T>[];
  onChange: (value: T) => void;
}

// A compact, icon-trigger variant of the Radix Select used for the filter
// bar (see LabeledSelect). Unlike LabeledSelect this has no visible label or
// block-level form-field styling -- it's meant to sit inline next to a
// chart-card-title without competing with it, so it's just an aria-labeled
// trigger. Reuses the same Radix Select primitive as the rest of the app
// rather than introducing @radix-ui/react-dropdown-menu for what is really
// a value-select (one of N mutually exclusive chart types), not an
// action menu.
export default function ChartTypeSelect<T extends string>({
  ariaLabel,
  value,
  options,
  onChange,
}: ChartTypeSelectProps<T>) {
  return (
    <Select.Root value={value} onValueChange={(v) => onChange(v as T)}>
      <Select.Trigger className="chart-type-select-trigger" aria-label={ariaLabel}>
        <Select.Value />
        <Select.Icon className="chart-type-select-icon">▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="chart-type-select-content" position="popper" sideOffset={4} align="end">
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item key={option.value} className="chart-type-select-item" value={option.value}>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
