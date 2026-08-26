import React, { useEffect, useRef, useState } from 'react';

interface Palette {
  label: string;
  silver: string;
  ironGrey: string;
  greyOlive: string;
  greyOlive2: string;
  darkSlateGrey: string;
  beige: string;
}

interface PaletteGroup {
  label: string;
  palettes: Palette[];
}

const PALETTE_GROUPS: PaletteGroup[] = [
  {
    label: 'Current',
    palettes: [
      {
        label: 'Olive & Slate (current)',
        silver: '#c5c5c5',
        ironGrey: '#4c5b61',
        greyOlive: '#829191',
        greyOlive2: '#949b96',
        darkSlateGrey: '#2c423f',
        beige: '#e8e0d0',
      },
    ],
  },
  {
    label: 'Sterile / clinical',
    palettes: [
      {
        label: 'Surgical Blue',
        silver: '#d6dde2',
        ironGrey: '#4a6572',
        greyOlive: '#8ea3ac',
        greyOlive2: '#a9bcc4',
        darkSlateGrey: '#1f3541',
        beige: '#eef3f5',
      },
      {
        label: 'Scrub Green',
        silver: '#d3dfd8',
        ironGrey: '#3f6357',
        greyOlive: '#7fa294',
        greyOlive2: '#9fbcb1',
        darkSlateGrey: '#1c3a30',
        beige: '#e9f1ec',
      },
      {
        label: 'Clinical White',
        silver: '#dcdcdc',
        ironGrey: '#5a5f66',
        greyOlive: '#9298a0',
        greyOlive2: '#aeb3b9',
        darkSlateGrey: '#2b2f33',
        beige: '#f4f4f4',
      },
      {
        label: 'Antiseptic Teal',
        silver: '#cfe4e2',
        ironGrey: '#356b68',
        greyOlive: '#6fa19d',
        greyOlive2: '#94bcb9',
        darkSlateGrey: '#173836',
        beige: '#e7f4f2',
      },
      {
        label: 'Lab Coat',
        silver: '#d9d9d4',
        ironGrey: '#5c5f52',
        greyOlive: '#93958a',
        greyOlive2: '#b0b2a8',
        darkSlateGrey: '#2e3027',
        beige: '#f2f1ea',
      },
    ],
  },
  {
    label: 'Muted / editorial',
    palettes: [
      {
        label: 'Newsprint',
        silver: '#d4cfc4',
        ironGrey: '#5c5346',
        greyOlive: '#94897a',
        greyOlive2: '#aea497',
        darkSlateGrey: '#2c2620',
        beige: '#efe9dd',
      },
      {
        label: 'Slate & Sand',
        silver: '#cbc4b8',
        ironGrey: '#54606a',
        greyOlive: '#8d9299',
        greyOlive2: '#a9ab9f',
        darkSlateGrey: '#28323a',
        beige: '#e6ddc9',
      },
      {
        label: 'Dusty Rose',
        silver: '#ddc9c5',
        ironGrey: '#6b4c4d',
        greyOlive: '#a7807f',
        greyOlive2: '#c2a3a1',
        darkSlateGrey: '#3a2224',
        beige: '#f1e3df',
      },
      {
        label: 'Museum Grey',
        silver: '#d7d5d0',
        ironGrey: '#57544c',
        greyOlive: '#96938a',
        greyOlive2: '#b2afa5',
        darkSlateGrey: '#2b2924',
        beige: '#f0eee7',
      },
      {
        label: 'Ink & Parchment',
        silver: '#d8d0bd',
        ironGrey: '#4a4438',
        greyOlive: '#8c8168',
        greyOlive2: '#aca188',
        darkSlateGrey: '#26221a',
        beige: '#efe5cd',
      },
    ],
  },
  {
    label: 'Corporate / high-contrast',
    palettes: [
      {
        label: 'Navy & Steel',
        silver: '#c9d1db',
        ironGrey: '#34495e',
        greyOlive: '#5d7690',
        greyOlive2: '#8296ab',
        darkSlateGrey: '#182634',
        beige: '#eef1f5',
      },
      {
        label: 'Charcoal & Amber',
        silver: '#d6d2c9',
        ironGrey: '#4f4a42',
        greyOlive: '#8c8477',
        greyOlive2: '#aca594',
        darkSlateGrey: '#252220',
        beige: '#f3ead8',
      },
      {
        label: 'Deep Forest',
        silver: '#cddad0',
        ironGrey: '#37503f',
        greyOlive: '#6b8c76',
        greyOlive2: '#93ac9c',
        darkSlateGrey: '#152820',
        beige: '#e6efe6',
      },
      {
        label: 'Burgundy & Grey',
        silver: '#d8cdcb',
        ironGrey: '#5e4045',
        greyOlive: '#977679',
        greyOlive2: '#b7999b',
        darkSlateGrey: '#331e21',
        beige: '#f0e5e2',
      },
      {
        label: 'Graphite & Gold',
        silver: '#d5d2c8',
        ironGrey: '#4c4a3f',
        greyOlive: '#8c8770',
        greyOlive2: '#adaa93',
        darkSlateGrey: '#242318',
        beige: '#f2ecd8',
      },
    ],
  },
  {
    label: 'Warm / earthy',
    palettes: [
      {
        label: 'Terracotta',
        silver: '#dccbc0',
        ironGrey: '#6d4f3f',
        greyOlive: '#a8816a',
        greyOlive2: '#c3a48f',
        darkSlateGrey: '#3b2718',
        beige: '#f2e4d5',
      },
      {
        label: 'Desert Sand',
        silver: '#ded2bc',
        ironGrey: '#71624a',
        greyOlive: '#ac9975',
        greyOlive2: '#c7b898',
        darkSlateGrey: '#3d3319',
        beige: '#f3ead4',
      },
      {
        label: 'Espresso',
        silver: '#d4c9bf',
        ironGrey: '#4a3a30',
        greyOlive: '#7f6a58',
        greyOlive2: '#a08c79',
        darkSlateGrey: '#241a13',
        beige: '#eee2d3',
      },
      {
        label: 'Olive Grove',
        silver: '#d5d5bd',
        ironGrey: '#565c3e',
        greyOlive: '#8b9268',
        greyOlive2: '#aab190',
        darkSlateGrey: '#2c3020',
        beige: '#eeeed7',
      },
      {
        label: 'Clay & Sage',
        silver: '#d6d3c2',
        ironGrey: '#5f6249',
        greyOlive: '#98977a',
        greyOlive2: '#b6b49b',
        darkSlateGrey: '#2f3121',
        beige: '#efeddc',
      },
    ],
  },
];

function applyPalette(palette: Palette) {
  const root = document.documentElement.style;
  root.setProperty('--silver', palette.silver);
  root.setProperty('--iron-grey', palette.ironGrey);
  root.setProperty('--grey-olive', palette.greyOlive);
  root.setProperty('--grey-olive-2', palette.greyOlive2);
  root.setProperty('--dark-slate-grey', palette.darkSlateGrey);
  root.setProperty('--beige', palette.beige);
}

export default function PaletteExperiment() {
  const [selected, setSelected] = useState(PALETTE_GROUPS[0].palettes[0]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyPalette(selected);
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="font-experiment palette-experiment" ref={containerRef}>
      <button type="button" className="font-experiment-toggle" onClick={() => setOpen((o) => !o)}>
        Palette: {selected.label}
      </button>

      {open && (
        <div className="font-experiment-panel">
          {PALETTE_GROUPS.map((group) => (
            <div key={group.label} className="font-experiment-group">
              <p className="font-experiment-group-label">{group.label}</p>
              {group.palettes.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="font-experiment-option palette-option"
                  aria-pressed={p.label === selected.label}
                  onClick={() => setSelected(p)}
                >
                  <span
                    className="palette-swatches"
                    aria-hidden="true"
                    style={{
                      background: `linear-gradient(90deg, ${p.darkSlateGrey} 0 20%, ${p.ironGrey} 20% 40%, ${p.greyOlive} 40% 60%, ${p.greyOlive2} 60% 80%, ${p.beige} 80% 100%)`,
                    }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
