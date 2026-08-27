import { MetricId } from '../../../types';

export interface MonthTotal {
	monthKey: string;
	month: string;
	amount: number;
}

const currency = (value: number) =>
	`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const count = (value: number) => value.toLocaleString();

export function formatterFor(metric: MetricId) {
	return metric === 'count' ? count : currency;
}
