import type { Config } from 'tailwindcss';

// Design tokens, mirroring the "Tokens" variable collection in Figma.
//
// | Figma variable         | Tailwind class        |
// | ---------------------- | --------------------- |
// | color/primary          | *-primary             |
// | color/primary-subtle   | *-primary-subtle      |
// | color/on-primary       | *-on-primary          |
// | color/text             | *-ink                 |
// | color/text-muted       | *-ink-muted           |
// | color/surface          | *-surface             |
// | color/background       | *-canvas              |
// | color/border           | *-line                |
// | color/success          | *-success             |
// | color/success-subtle   | *-success-subtle      |
// | color/toggle-track     | *-toggle-track        |
// | space/N (N x 4px)      | Tailwind spacing N    |
// | radius/md, lg, full    | rounded-md, lg, full  |
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          subtle: '#EEF2FF',
        },
        'on-primary': '#FFFFFF',
        ink: {
          DEFAULT: '#0F172A',
          muted: '#475569',
        },
        surface: '#FFFFFF',
        canvas: '#F8FAFC',
        line: '#E2E8F0',
        success: {
          DEFAULT: '#16A34A',
          subtle: '#DCFCE7',
        },
        'toggle-track': '#E9EDF3',
      },
      borderRadius: {
        md: '10px',
        lg: '16px',
        full: '999px',
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
