import React, { useEffect, useMemo, useState } from 'react';
import { Command } from 'cmdk';
import { Search } from 'lucide-react';
import { Command as CommandDef } from '../commands';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: CommandDef[];
}

/**
 * The dashboard's primary navigation surface. `Command.Dialog` (cmdk) wraps a Radix
 * Dialog under the hood, so focus trapping, Escape-to-close, click-outside-to-close,
 * and the dialog/combobox/listbox ARIA wiring all come for free -- we only own the
 * visual chrome and the command list itself.
 */
export default function CommandPalette({ open, onOpenChange, commands }: CommandPaletteProps) {
  const [search, setSearch] = useState('');

  // Reset search text each time the palette opens so it never reopens showing a stale
  // query from a previous session.
  useEffect(() => {
    if (open) setSearch('');
  }, [open]);

  const groups = useMemo(() => {
    const order: string[] = [];
    const byGroup = new Map<string, CommandDef[]>();
    for (const cmd of commands) {
      if (!byGroup.has(cmd.group)) {
        byGroup.set(cmd.group, []);
        order.push(cmd.group);
      }
      byGroup.get(cmd.group)!.push(cmd);
    }
    return order.map((label) => ({ label, items: byGroup.get(label)! }));
  }, [commands]);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      className="command-palette"
      contentClassName="command-palette-content"
      shouldFilter
    >
      <div className="command-palette-input-row">
        <Search className="command-palette-search-icon" size={18} aria-hidden="true" />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search views, filters, and settings..."
          autoFocus
        />
        <kbd className="command-palette-esc-hint">Esc</kbd>
      </div>
      <Command.List>
        <Command.Empty>No matching commands.</Command.Empty>
        {groups.map((group) => (
          <Command.Group key={group.label} heading={group.label}>
            {group.items.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <Command.Item
                  key={cmd.id}
                  value={`${cmd.label} ${(cmd.keywords ?? []).join(' ')}`}
                  onSelect={cmd.perform}
                >
                  <Icon className="command-palette-item-icon" size={16} aria-hidden="true" />
                  <span className="command-palette-item-label">{cmd.label}</span>
                  {cmd.hint && <span className="command-palette-item-hint">{cmd.hint}</span>}
                </Command.Item>
              );
            })}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
