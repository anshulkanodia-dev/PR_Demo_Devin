import type { Config } from 'tailwindcss';

// Design tokens, mirroring the "Tokens" variable collection in Figma.
//
// | Figma variable         | Tailwind class        |
// | ---------------------- | --------------------- |
// | color/primary          | *-primary             |
// | color/primary-subtle   | *-primary-subtle      |
// | color/primary-tint     | *-primary-tint        |
// | color/primary-ring     | *-primary-ring        |
// | color/primary-soft     | *-primary-soft        |
// | color/on-primary       | *-on-primary          |
// | color/text             | *-ink                 |
// | color/text-muted       | *-ink-muted           |
// | color/text-body        | *-ink-body            |
// | color/text-subtle      | *-ink-subtle          |
// | color/text-faint       | *-ink-faint           |
// | color/text-ghost       | *-ink-ghost           |
// | color/inverse/surface  | *-inverse             |
// | color/inverse/border   | *-inverse-line        |
// | color/inverse/text     | *-inverse-ink         |
// | color/inverse/muted    | *-inverse-muted       |
// | color/surface          | *-surface             |
// | color/background       | *-canvas              |
// | color/border           | *-line                |
// | color/border-subtle    | *-line-subtle         |
// | color/success          | *-success             |
// | color/success-subtle   | *-success-subtle      |
// | color/success-strong   | *-success-strong      |
// | color/toggle-track     | *-toggle-track        |
// | space/N (N x 4px)      | Tailwind spacing N    |
// | radius/sm..2xl, full   | rounded-sm..2xl, full |
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          subtle: '#EEF2FF',
          tint: '#F5F7FF',
          ring: '#E0E7FF',
          soft: '#C7D2FE',
        },
        'on-primary': '#FFFFFF',
        ink: {
          DEFAULT: '#0F172A',
          muted: '#475569',
          body: '#334155',
          subtle: '#64748B',
          faint: '#94A3B8',
          ghost: '#CBD5E1',
        },
        inverse: {
          DEFAULT: '#0F172A',
          line: '#1E293B',
          ink: '#CBD5E1',
          muted: '#94A3B8',
        },
        surface: '#FFFFFF',
        canvas: '#F8FAFC',
        line: {
          DEFAULT: '#E2E8F0',
          subtle: '#EEF0F4',
        },
        success: {
          DEFAULT: '#16A34A',
          subtle: '#DCFCE7',
          strong: '#15803D',
        },
        'toggle-track': '#E9EDF3',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        tile: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
        full: '999px',
      },
      boxShadow: {
        xs: '0 1px 1px rgba(15, 23, 42, 0.05)',
        thumb: '0 1px 1.5px rgba(15, 23, 42, 0.14)',
        popular: '0 24px 24px rgba(79, 70, 229, 0.45)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
