export type State<T> = {
  value: T;
  set: (x: T) => void;
};

export function makeState<T>(value: T, set: (x: T) => void): State<T> {
  return { value, set };
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
