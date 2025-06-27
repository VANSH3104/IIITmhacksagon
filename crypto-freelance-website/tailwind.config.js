module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FBBF24', // Light yellow
          DEFAULT: '#F59E0B', // Default yellow
          dark: '#B45309', // Dark yellow
        },
        secondary: {
          light: '#3B82F6', // Light blue
          DEFAULT: '#2563EB', // Default blue
          dark: '#1D4ED8', // Dark blue
        },
        background: {
          light: '#FFFFFF', // Light background
          DEFAULT: '#F3F4F6', // Default background
          dark: '#1F2937', // Dark background
        },
        text: {
          light: '#1F2937', // Light text
          DEFAULT: '#374151', // Default text
          dark: '#D1D5DB', // Dark text
        },
      },
    },
  },
  plugins: [],
}