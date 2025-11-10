/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // tambahkan ini
  ],
  theme: {
    extend: {
      colors: {
        posmint: '#52bfbe',
        poswhite: '#ffffff',
        posgray: '#737373',
        posbrown: '#ae9d81',
      },
    },
  },
  plugins: [],
}
