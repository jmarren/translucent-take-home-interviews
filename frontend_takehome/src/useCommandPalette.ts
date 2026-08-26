import { useState, useEffect, useCallback, useMemo } from "react";
import { buildCommands, Command, CommandContext } from "./commands";

export interface Modal {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
}

export interface CommandPalette {
  modal: Modal;
  commands: Command[];
}

// The dep list is every field of `ctx`, taken via Object.values() rather
// than named one-by-one, so CommandContext's field list (in ./commands.ts)
// stays the single place enumerating them -- adding/removing a field there
// automatically changes what the commands memo re-runs on, with nothing to
// keep in sync here.
function makeCommandsMemoParams(
  ctx: CommandContext,
): [() => Command[], unknown[]] {
  return [() => buildCommands(ctx), Object.values(ctx)];
}

// The global Cmd+K/Ctrl+K listener only makes sense in palette nav mode --
// callers pass `enabled` rather than this hook reaching into theme
// preferences itself, so it stays independent of nav-mode internals.
export function useCommandPalette(
  context: Omit<CommandContext, "close">,
): CommandPalette {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (context.theme.navMode !== "palette") return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [context.theme.navMode]);

  const close = useCallback(() => setOpen(false), []);

  const commands = useMemo(...makeCommandsMemoParams({ ...context, close }));

  return { modal: { isOpen, setOpen, close }, commands };
}
