import { State, makeState } from "./state";

// Reads a raw string out of localStorage, swallowing the "unavailable"
// case (private browsing, etc.) down to null so callers only ever have
// to handle "there was nothing usable stored" rather than two failure
// modes.
export function readStorageItem(storageKey: string): string | null {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

// Composes a loader: read the raw stored string, hand it to `parse` to
// resolve against the real option list, and fall back to `fallback`
// whenever there's nothing stored or `parse` can't place it. Each
// preference then only has to supply how *it* recognizes a stored value,
// not how storage access or fallback works.
export function makeLoader<T>(
  storageKey: string,
  parse: (stored: string | null) => T | undefined,
  fallback: T,
): () => T {
  return () => parse(readStorageItem(storageKey)) ?? fallback;
}

// Layers localStorage persistence on top of the plain makeState -- `set`
// does both jobs a plain useState setter can't: updating React state and
// best-effort persisting to localStorage, with only the storage key and
// serialization differing per preference. `serialize` defaults to the
// identity function, so it can be omitted when T is already a string.
export function makeLocalStorageState(
  value: string,
  setState: (value: string) => void,
  storageKey: string,
  serialize?: (value: string) => string,
): State<string>;
export function makeLocalStorageState<T>(
  value: T,
  setState: (value: T) => void,
  storageKey: string,
  serialize: (value: T) => string,
): State<T>;
export function makeLocalStorageState<T>(
  value: T,
  setState: (value: T) => void,
  storageKey: string,
  serialize: (value: T) => string = (v) => v as string,
): State<T> {
  return makeState<T>(value, (next: T) => {
    setState(next);
    try {
      window.localStorage.setItem(storageKey, serialize(next));
    } catch {
      // Ignore write failures (private browsing, storage full, etc.).
    }
  });
}
