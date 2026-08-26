import { useState, useEffect, useCallback } from 'react';

export interface Modal {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
}

// The global Cmd+K/Ctrl+K listener only makes sense in palette nav mode --
// callers pass `enabled` rather than this hook reaching into theme
// preferences itself, so it stays independent of nav-mode internals.
export function useCommandPalette(enabled: boolean): Modal {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((open) => !open);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  const close = useCallback(() => setOpen(false), []);

  return { isOpen, setOpen, close };
}
