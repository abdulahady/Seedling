/*
 *
 * TODO: Configure your template paths
 * Add the paths to all of your template files in your tailwind.config.js file.
 *
 * Reference:
 * https://tailwindcss.com/docs/installation
 * https://tailwindcss.com/docs/configuration
 * https://www.preline.co/docs/index.html
 *
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        charter: ['Charter'],
        times: ['Times New Roman', 'serif'],
        franklin: ['Franklin Gothic', 'Arial', 'sans-serif'],
        body: ['Nunito Sans', 'Merriweather', 'serif'],
        heading: ['DM Serif Display', 'Times New Roman', 'serif'],
        accent: ['Quicksand', 'Roboto Condensed', 'sans-serif'],
      },
      boxShadow: {
        'top-bottom':
          '0 -4px 6px -1px rgba(0, 0, 0, 0.05), 0 -2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  daisyui: {
    themes: ['garden'],
  },
  plugins: [require('daisyui'), require('preline/plugin')],
}
