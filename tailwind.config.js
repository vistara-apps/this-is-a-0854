/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210 70% 45%)',
        accent: 'hsl(170 70% 40%)',
        bg: 'hsl(220 15% 98%)',
        surface: 'hsl(220 15% 100%)',
        textPrimary: 'hsl(220 15% 30%)',
        textSecondary: 'hsl(220 15% 50%)',
        dark: {
          bg: 'hsl(240 20% 8%)',
          surface: 'hsl(240 20% 12%)',
          surfaceHover: 'hsl(240 20% 16%)',
          border: 'hsl(240 20% 20%)',
          text: 'hsl(0 0% 95%)',
          textSecondary: 'hsl(0 0% 70%)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px', 
        'lg': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 15%, 30%, 0.08)',
        'modal': '0 16px 32px hsla(220, 15%, 30%, 0.12)',
        'dark-card': '0 4px 12px hsla(0, 0%, 0%, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}