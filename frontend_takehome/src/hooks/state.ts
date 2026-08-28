import { Dispatch, SetStateAction } from "react";

export type State<T> = {
  value: T;
  set: (x: T) => void;
};

// Accepts either a plain (value, set) pair, or a useState() tuple
// directly -- makeState(useState(initial)) -- so a value that's plain
// local component state doesn't need destructuring into two named
// bindings just to wrap it, the way useNavigation's `activeTab`
// (derived from the route) or useDashboardFilters' filters (backed by
// URL search params) still need to, since neither has a real
// Dispatch<SetStateAction<T>> to pass through as-is.
export function makeState<T>(value: T, set: (x: T) => void): State<T>;
export function makeState<T>(pair: [T, Dispatch<SetStateAction<T>>]): State<T>;
export function makeState<T>(
  valueOrPair: T | [T, Dispatch<SetStateAction<T>>],
  set?: (x: T) => void,
): State<T> {
  if (set) return { value: valueOrPair as T, set };
  const [value, setValue] = valueOrPair as [T, Dispatch<SetStateAction<T>>];
  return { value, set: setValue };
}

// Given an object type whose properties are a mix of State<T> and plain
// fields (e.g. DashboardFilters, with its State<string> filters alongside
// a plain `summary: string | null`), extracts just the State<T>
// properties and replaces each with its unwrapped value type -- so
// ValuesOf<DashboardFilters> drops `summary` and turns
// `department: State<string>` into `department: string`, etc.
export type ValuesOf<T> = {
  [K in keyof T as T[K] extends State<any> ? K : never]: T[K] extends State<infer V> ? V : never;
};
