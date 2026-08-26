import { useState, useEffect, useCallback } from 'react';

export interface UseCommandPaletteResult {
	paletteOpen: boolean;
	setPaletteOpen: (open: boolean) => void;
	closePalette: () => void;
}

// The global Cmd+K/Ctrl+K listener only makes sense in palette nav mode --
// callers pass `enabled` rather than this hook reaching into theme
// preferences itself, so it stays independent of nav-mode internals.
export function useCommandPalette(enabled: boolean): UseCommandPaletteResult {
	const [paletteOpen, setPaletteOpen] = useState(false);

	useEffect(() => {
		if (!enabled) return;
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setPaletteOpen((open) => !open);
			}
		}
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [enabled]);

	const closePalette = useCallback(() => setPaletteOpen(false), []);

	return { paletteOpen, setPaletteOpen, closePalette };
}
