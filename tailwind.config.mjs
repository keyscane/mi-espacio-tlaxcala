/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Formato limpio compatible al 100% con el motor de IntelliSense
        'mi-azul': 'oklch(60.9% 0.126 221.723)',
      },
    },
  },
  plugins: [],
}
