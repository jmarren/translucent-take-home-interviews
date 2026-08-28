import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  SetStateAction,
  Dispatch,
} from "react";
import { buildCommands, Command, CommandContext } from "../commands";
import { State, makeState } from "./state";

export interface CommandPalette {
  open: State<boolean>;
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

function makeCommandEffectParams(
  ctx: Omit<CommandContext, "close">,
  setOpen: Dispatch<SetStateAction<boolean>>,
): Parameters<typeof useEffect> {
  let callback = () => {
    if (!ctx.theme.commandPaletteEnabled.value) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  };

  return [callback, [ctx.theme.commandPaletteEnabled.value]];
}

// The global Cmd+K/Ctrl+K listener only attaches while the command palette
// preference is enabled -- independent of the sidebar, which is always
// present regardless of this toggle.
export function useCommandPalette(
  ctx: Omit<CommandContext, "close">,
): CommandPalette {
  const openState = useState<boolean>(false);
  const [isOpen, setOpen] = openState;

  useEffect(...makeCommandEffectParams(ctx, setOpen));

  const close = useCallback(() => setOpen(false), []);
  const open = makeState<boolean>(openState);

  const commands = useMemo(...makeCommandsMemoParams({ ...ctx, close }));

  return { open, commands };
}
