import React from 'react';
import * as Select from '@radix-ui/react-select';
import { LucideIcon } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  /** Shown at the start of the option, both in the dropdown list and (for the selected option) the trigger. */
  icon?: LucideIcon;
}

interface LabeledSelectProps {
  id: string;
  label: string;
  ariaLabel: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export default function LabeledSelect({ id, label, ariaLabel, value, options, onChange }: LabeledSelectProps) {
  const SelectedIcon = options.find((option) => option.value === value)?.icon;

  return (
    <div className="labeled-select">
      <label className="labeled-select-label" htmlFor={id}>
        {label}
      </label>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger className="department-select-trigger" id={id} aria-label={ariaLabel}>
          <span className="department-select-trigger-value">
            {SelectedIcon && <SelectedIcon className="department-select-item-icon" size={14} aria-hidden="true" />}
            <Select.Value />
          </span>
          <Select.Icon className="department-select-icon">▾</Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="department-select-content" position="popper" sideOffset={4}>
            <Select.Viewport>
              {options.map((option) => {
                const Icon = option.icon;
                return (
                  <Select.Item key={option.value} className="department-select-item" value={option.value}>
                    {Icon && <Icon className="department-select-item-icon" size={14} aria-hidden="true" />}
                    <Select.ItemText>{option.label}</Select.ItemText>
                  </Select.Item>
                );
              })}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
