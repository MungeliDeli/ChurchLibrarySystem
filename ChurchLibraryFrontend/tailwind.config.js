/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand colors matching our Material-UI theme
        primary: {
          50: "#fefcf9",
          100: "#fdf8f0",
          200: "#faf0d8",
          300: "#f5e4b8",
          400: "#eed394",
          500: "#d4a373", // main
          600: "#b8935f", // dark
          700: "#a67858",
          800: "#8b5a3c",
          900: "#6b4429",
        },
        secondary: {
          50: "#fef8f4",
          100: "#fdf0e8",
          200: "#fae0cc",
          300: "#f5c8a0",
          400: "#eea86c",
          500: "#a0673b", // main
          600: "#7d4f2c", // dark
          700: "#c8956d",
          800: "#8b5a3c",
          900: "#6b4429",
        },
        accent: {
          50: "#fef8f4",
          100: "#fdf0e8",
          200: "#fae0cc",
          300: "#f5c8a0",
          400: "#eea86c",
          500: "#8b5a3c", // main
          600: "#6b4429", // dark
          700: "#a67858",
          800: "#8b5a3c",
          900: "#6b4429",
        },
        // Background colors
        background: {
          default: "#f8f6f3",
          paper: "#ffffff",
          secondary: "#f0ebe4",
          accent: "#faf9f7",
        },
        // Surface colors
        surface: {
          main: "#ffffff",
          elevated: "#ffffff",
          hover: "#f5f5f5",
          selected: "#e4c4a1",
        },
        // Text colors
        text: {
          primary: "#2c2c2c",
          secondary: "#5a5a5a",
          disabled: "#b0b0b0",
          hint: "#8a8a8a",
        },
        // Dark theme colors
        dark: {
          background: {
            default: "#1a1a1a",
            paper: "#2c2c2c",
            secondary: "#3a3a3a",
            accent: "#404040",
          },
          surface: {
            main: "#2c2c2c",
            elevated: "#404040",
            hover: "#4a4a4a",
            selected: "#b8935f",
          },
          text: {
            primary: "#ffffff",
            secondary: "#e0e0e0",
            disabled: "#6a6a6a",
            hint: "#b0b0b0",
          },
        },
      },
      fontFamily: {
        sans: ['"Roboto"', '"Helvetica"', '"Arial"', "sans-serif"],
      },
      borderRadius: {
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.1)",
        "card-dark": "0 2px 8px rgba(0,0,0,0.3)",
        header: "0 1px 3px rgba(0,0,0,0.1)",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class", // Enable class-based dark mode
};
