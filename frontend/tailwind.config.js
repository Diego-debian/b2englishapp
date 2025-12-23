/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // Incluye hooks para escanear clases de Tailwind
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      /**
       * Animaciones personalizadas: flotación suave, brillo y sacudida.
       * Se usan para dotar de vida a encabezados, podios y feedback visual.
       */
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        glow: {
          '0%, 100%': {
            boxShadow:
              '0 0 10px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.2)',
          },
          '50%': {
            boxShadow:
              '0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.4)',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        shake: 'shake 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
