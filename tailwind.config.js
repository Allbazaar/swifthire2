/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiftBlue: {
          DEFAULT: "#1A3C6E",
          light: "#2B5BA8",
          dark: "#0F2444",
        },
        swiftTeal: {
          DEFAULT: "#0F9E7B",
          light: "#E1F5EE",
          dark: "#0F6E56",
        },
        swiftAmber: {
          DEFAULT: "#E8A020",
          light: "#FAEEDA",
          dark: "#854F0B",
        },
        swiftGray: {
          50: "#FAF9F7",
          100: "#F3F4F6",
          400: "#9CA3AF",
          600: "#6B7280",
          900: "#1C1C1E",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        swift: "10px",
      },
      boxShadow: {
        swift: "0 2px 12px rgba(26, 60, 110, 0.08)",
      },
    },
  },
  plugins: [],
}
