/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E53E2D',
          'red-dark': '#C0321E',
          'red-light': '#FF5540',
          'red-glow': '#E53E2D40',
          bg: '#0A0A0A',
          'bg-1': '#111111',
          'bg-2': '#161616',
          'bg-card': '#141414',
          'bg-hover': '#1a1a1a',
          border: '#222222',
          'border-light': '#2a2a2a',
          text: '#FFFFFF',
          muted: '#888888',
          subtle: '#555555',
        }
      },
      fontFamily: {
        barlow: ['"Barlow Condensed"', 'Impact', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'red-gradient': 'linear-gradient(135deg, #E53E2D 0%, #C0321E 100%)',
        'card-gradient': 'linear-gradient(145deg, #141414 0%, #111111 100%)',
        'hero-radial': 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(229,62,45,0.12) 0%, transparent 70%)',
        'hero-radial-left': 'radial-gradient(ellipse 50% 80% at 20% 50%, rgba(229,62,45,0.06) 0%, transparent 70%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'red': '0 0 30px rgba(229,62,45,0.4)',
        'red-sm': '0 0 12px rgba(229,62,45,0.25)',
        'red-lg': '0 0 60px rgba(229,62,45,0.35)',
        'card': '0 4px 30px rgba(0,0,0,0.5)',
        'card-hover': '0 8px 50px rgba(0,0,0,0.7)',
        'inset-top': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'marquee': 'marquee 30s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        pulseRed: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 12px rgba(229,62,45,0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 25px rgba(229,62,45,0.6)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
