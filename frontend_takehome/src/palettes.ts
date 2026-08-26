export interface Palette {
  label: string;
  silver: string;
  ironGrey: string;
  greyOlive: string;
  greyOlive2: string;
  darkSlateGrey: string;
  beige: string;
  /** Optional "core" accent hues, e.g. for chart series or highlights. */
  tertiary1?: string;
  tertiary2?: string;
}

export interface PaletteGroup {
  label: string;
  palettes: Palette[];
}

export const PALETTE_GROUPS: PaletteGroup[] = [
  {
    label: 'Current',
    palettes: [
      {
        label: 'Olive & Slate (default)',
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
  {
    label: 'Dual-accent (with tertiary colors)',
    palettes: [
      {
        label: 'Slate & Signal',
        silver: '#cfd3d6',
        ironGrey: '#495a63',
        greyOlive: '#83949c',
        greyOlive2: '#a3aeb3',
        darkSlateGrey: '#20303a',
        beige: '#eef0ef',
        tertiary1: '#c6633f',
        tertiary2: '#3f8f7c',
      },
      {
        label: 'Harbor & Ember',
        silver: '#cdd7db',
        ironGrey: '#3e5c66',
        greyOlive: '#78949c',
        greyOlive2: '#9db3b9',
        darkSlateGrey: '#1a2e35',
        beige: '#eef2f0',
        tertiary1: '#d4823a',
        tertiary2: '#6a4c93',
      },
      {
        label: 'Moss & Marigold',
        silver: '#d1d6c9',
        ironGrey: '#4d5c42',
        greyOlive: '#889a72',
        greyOlive2: '#a9b697',
        darkSlateGrey: '#242e1c',
        beige: '#f0eee1',
        tertiary1: '#c99a34',
        tertiary2: '#a34e4e',
      },
      {
        label: 'Graphite & Coral',
        silver: '#d3d3d3',
        ironGrey: '#525252',
        greyOlive: '#8c8c8c',
        greyOlive2: '#aaaaaa',
        darkSlateGrey: '#262626',
        beige: '#f1efe9',
        tertiary1: '#c85c4f',
        tertiary2: '#3f7ca8',
      },
      {
        label: 'Indigo & Citrine',
        silver: '#cfd2dc',
        ironGrey: '#3f4566',
        greyOlive: '#7679a0',
        greyOlive2: '#9b9ec0',
        darkSlateGrey: '#1c2038',
        beige: '#eef0f5',
        tertiary1: '#c9a635',
        tertiary2: '#4e9b7a',
      },
    ],
  },
];

export const ALL_PALETTES: Palette[] = PALETTE_GROUPS.flatMap((g) => g.palettes);

export const DEFAULT_PALETTE = ALL_PALETTES[0];

const FALLBACK_TERTIARY_1 = '#8a5a44';
const FALLBACK_TERTIARY_2 = '#5b7fa6';

export function applyPalette(palette: Palette) {
  const root = document.documentElement.style;
  root.setProperty('--silver', palette.silver);
  root.setProperty('--iron-grey', palette.ironGrey);
  root.setProperty('--grey-olive', palette.greyOlive);
  root.setProperty('--grey-olive-2', palette.greyOlive2);
  root.setProperty('--dark-slate-grey', palette.darkSlateGrey);
  root.setProperty('--beige', palette.beige);
  root.setProperty('--tertiary-1', palette.tertiary1 ?? FALLBACK_TERTIARY_1);
  root.setProperty('--tertiary-2', palette.tertiary2 ?? FALLBACK_TERTIARY_2);
}

export function paletteSwatchGradient(p: Palette): string {
  const stops = [p.darkSlateGrey, p.ironGrey, p.greyOlive, p.greyOlive2, p.beige];
  if (p.tertiary1) stops.push(p.tertiary1);
  if (p.tertiary2) stops.push(p.tertiary2);
  const step = 100 / stops.length;
  const segments = stops.map((color, i) => `${color} ${i * step}% ${(i + 1) * step}%`);
  return `linear-gradient(90deg, ${segments.join(', ')})`;
}
