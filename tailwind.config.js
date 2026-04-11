/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at 10% 20%, rgba(251, 146, 60, 0.18) 0%, transparent 35%), radial-gradient(circle at 80% 15%, rgba(249, 115, 22, 0.18) 0%, transparent 30%), radial-gradient(circle at 50% 80%, rgba(234, 88, 12, 0.16) 0%, transparent 38%)",
      },
    },
  },
  plugins: [],
};
