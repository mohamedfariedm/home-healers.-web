import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        sidebar: "310px",
      },
      gridTemplateColumns: {
        repeat_250: "repeat(auto-fit, minmax(250px, 1fr))",
        repeat_300: "repeat(auto-fit, minmax(300px, 1fr))",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: {
          DEFAULT: "var(--background)",
          primary: "var(--bg-primary)",
          "primary-hover": "var(--bg-primary_hover)",
          "primary-alt": "var(--bg-primary-alt)",
          secondary: "var(--bg-secondary)",
          "secondary-alt": "var(--bg-secondary-alt)",
          active: "var(--bg-active)",
          "error-primary": "var(--bg-error-primary)",
          "disabled-subtle": "var(--bg-disabled_subtle)",
          tertiary: "var(--bg-tertiary)",
          quaternary: "var(--bg-quaternary)",
          "brand-solid": "var(--bg-brand-solid)",
          "secondary-hover": "var(--bg-background-secondary-hover)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          "primary-900": "var(--fg-primary-900)",
          "secondary-700": "var(--fg-secondary-700)",
          "brand-secondary-500": "var(--fg-brand-secondary-500)",
          "brand-primary-600": "var(--fg-brand-primary-600)",
          "brand-primary-alt": "var(--fg-brand-primary_alt)",
          "quaternary-500": "var(--fg-quaternary-500)",
          "quinary-400": "var(--fg-quinary-400)",
          "quinary-hover": "var(--fg-quinary-hover)",
          "error-primary": "var(--fg-error-primary)",
          "success-primary": "var(--fg-success-primary)",
          disabled: "var(--fg-disabled)",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        success: {
          600: "var(--success-600)",
        },
        primary: '#62a0f6',
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          700: "var(--secondary-700)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: {
          DEFAULT: "var(--border)",
          secondary: "var(--border-secondary)",
          primary: "var(--border-primary)",
          "disabled-subtle": "var(--border-disabled-subtle)",
          brand: "var(--border-brand)",
          "skeuemorphic-gradient":
            "var(--Gradient-skeuemorphic-gradient-border)",
        },
        utility: {
          "brand-50": "var(--utility-brand-50)",
          "brand-200": "var(--utility-brand-200)",
          "brand-700": "var(--utility-brand-700)",
          "gray-50": "var(--utility-gray-50)",
          "gray-200": "var(--utility-gray-200)",
          "gray-700": "var(--utility-gray-700)",
          disabled: "var(--text-disabled)",
        },
        text: {
          "primary-900": "var(--text-primary-900)",
          "secondary-700": "var(--text-secondary-700)",
          "tertiary-600": "var(--text-tertiary-600)",
          "error-primary-600": "var(--text-error-primary-600)",
          "secondary-hover": "var(--text-secondary-hover)",
          "brand-secondary-700": "var(--text-brand-secondary-700)",
          "primary-on-brand": "var(--text-primary-on-brand)",
          "brand-tertiary-alt": "var(--text-brand-tertiary-alt)",
          "brand-primary-900": "var(--text-brand-primary-900)",
          placeholder: "var(--text-placeholder)",
          "placeholder-subtle": "var(--text-placeholder-subtle)",
          "quaternary-500": "var(--text-quaternary-500)",
          disabled: "var(--text-disabled)",
        },
        navigation: {
          "nav-item-button-icon-fg": "var(--nav-item-button-icon-fg)",
          disabled: "var(--text-disabled)",
        },
        /*  button: {
          "secondary-fg": "var(--button-secondary-fg)",
          "secondary-border": "var(--button-secondary-border)",
          "secondary-bg": "var(--button-secondary-bg)",
          disabled: "var(--text-disabled)",
        }, */
        Components: {
          icons: {
            "featured-icon-modern-border": "var(--featured-icon-modern-border)",
            "featured-icon-dark-fg-brand": "var(--featured-icon-dark-fg-brand)",
          },
          button: {
            "primary-fg": "var(--button-primary-fg)",
            "primary-fg-hover": "var(--button-primary-fg_hover)",
            "primary-bg": "var(--button-primary-bg)",
            "primary-bg-hover": "var(--button-primary-bg_hover)",
            "tertiary-fg": "var(--button-tertiary-fg)",
            "tertiary-color-fg": "var(--button-tertiary-color-fg)",
            "tertiary-color-fg-hover": "var(--button-tertiary-color-fg_hover)",
            "tertiary-color-bg-hover": "var(--button-tertiary-color-bg_hover)",
            "secondary-fg": "var(--button-secondary-fg)",
            "secondary-bg": "var(--button-secondary-bg)",
            "secondary-border": "var(--button-secondary-border)",
            "secondary-fg-hover": "var(--button-secondary-fg-hover)",
            "secondary-bg-hover": "var(--button-secondary-bg-hover)",
            "secondary-border-hover": "var(--button-secondary-border-hover)",
            "primary-error-bg": "var(--button-primary-error-bg)",
            "primary-error-bg-hover": "var(--button-primary-error-bg-hover)",
          },
        },
        disabled: "var(--disabled)",
        quaternary: "var(--quaternary)",
        placeholder: "var(--placeholder)",
        // input: "var(--border-primary)",
        ring: "var(--ring)",
        error: "var(--fg-error-primary)",
        "focus-ring": "var(--focus-ring)",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-rtl": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.75", scale: "0.9" },
          "50%": { opacity: "1", scale: "1" },
        },
        meteor: {
          "0%": { transform: "translateY(-20%) translateX(-50%)" },
          "100%": { transform: "translateY(300%) translateX(-50%)" },
        },
        trail: {
          "0%": { "--angle": "0deg" },
          "100%": { "--angle": "360deg" },
        },
        appear: {
          from: {
            opacity: "0",
            transform: "scale(0.8)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-rtl": "marquee-rtl var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
        meteor: "meteor var(--duration) var(--delay) ease-in-out infinite",
        trail: "trail var(--duration) linear infinite",
        appear: "appear 0.3s ease-out",
      },
      
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
        "3xl": "1536px",
      },
    },
  },
  plugins: [require("tailwindcss-animated"), require("tailwindcss-animate")
    , function ({ addUtilities }:{addUtilities:any}) {
      addUtilities({
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
        '.rotate-y-0': {
          transform: 'rotateY(0deg)',
        },
        '.perspective': {
          perspective: '1000px',
        },
      });
    },
  ],
};
export default config;
