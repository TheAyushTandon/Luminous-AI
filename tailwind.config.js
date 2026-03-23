/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ["Inter", "sans-serif"],
        headline: ["Outfit", "sans-serif"],
        label: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        accent: ["Space Mono", "monospace"],
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      colors: {
        background: "#000000",
        surface: "#0a0a0a",
        "surface-hover": "#111111",
        "on-surface": "#ffffff",
        primary: {
          DEFAULT: "#bac4fa",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#dde1ff",
          foreground: "#000000",
        },
        muted: {
          DEFAULT: "#161b22",
          foreground: "#8b949e",
        },
        border: "rgba(255, 255, 255, 0.08)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#ffffff',
            h1: {
              color: '#bac4fa',
              fontWeight: '900',
              fontSize: '1.75rem',
              letterSpacing: '-0.025em',
              marginBottom: '1rem',
              marginTop: '1.5rem',
            },
            h2: {
              color: '#dde1ff',
              fontWeight: '800',
              fontSize: '1.5rem',
              letterSpacing: '-0.0125em',
              marginBottom: '0.75rem',
              marginTop: '1.25rem',
            },
            h3: {
              color: '#bac4fa',
              fontWeight: '700',
              fontSize: '1.25rem',
              marginBottom: '0.5rem',
            },
            strong: {
              color: '#bac4fa',
              fontWeight: '700',
            },
            blockquote: {
              borderLeftColor: '#333333',
              color: '#999999',
            },
            code: {
              color: '#bac4fa',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.375rem',
              fontWeight: '500',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("tailwindcss-animate"),
  ],
}
