/**
 * 은하사주 brand tokens — from eunha-brand-brief.
 * Light base by default; soft ink / sky / amber (not purple).
 */
export const Brand = {
  ink: '#1a2332',
  inkMuted: '#5c6b7a',
  paper: '#f6f3ee',
  paperDeep: '#e8e2d8',
  sky: '#2f4a6e',
  skySoft: '#7a93b0',
  amber: '#c4893a',
  amberSoft: '#e8c99a',
  line: '#d4cdc2',
  ok: '#3d6b5a',
  white: '#ffffff',
} as const;

export default {
  light: {
    text: Brand.ink,
    textMuted: Brand.inkMuted,
    background: Brand.paper,
    surface: Brand.paperDeep,
    tint: Brand.sky,
    accent: Brand.amber,
    line: Brand.line,
    tabIconDefault: Brand.skySoft,
    tabIconSelected: Brand.sky,
  },
  dark: {
    text: Brand.paper,
    textMuted: Brand.skySoft,
    background: Brand.ink,
    surface: '#243044',
    tint: Brand.amberSoft,
    accent: Brand.amber,
    line: '#3a4658',
    tabIconDefault: Brand.skySoft,
    tabIconSelected: Brand.amberSoft,
  },
};
