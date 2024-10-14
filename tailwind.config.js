/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
        accent: '#001848',
        primary: '#301860',
        secondary: '#483078',
        details: '#604878',
        other: '#906090',
        background: '#0f0f0f',
        text: '#f1f1f1',
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

