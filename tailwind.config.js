import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
  ],

  darkMode: 'class', // ← Habilitar switcher de temas con clase .dark

  theme: {
    extend: {
      fontFamily: {
        sans: ['"Century Gothic Pro"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Century Gothic Pro"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Colores AB InBev específicos que me diste
        abinbev: {
          light: '#c7c7c7',     // Gris claro
          yellow: '#f5e003',    // Amarillo principal
          gold: '#e5b611',      // Amarillo dorado
          dark: '#000000',      // Negro
        },
        
        // Sistema de colores semánticos para tema claro/oscuro
        primary: {
          DEFAULT: 'rgb(var(--color-bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
        },

        // Mantengo tu escala de grises refinada para el tema claro
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        
        // Colores funcionales (actualizados para tema oscuro)
        functional: {
          red: '#ef4444',      // Rojo más vibrante
          green: '#10b981',    // Verde más vibrante
          blue: '#3b82f6',     // Azul más vibrante
        }
      },
      
      // Animaciones para microinteracciones
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      boxShadow: {
        // Sombras base (tema claro)
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
        'float': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        
        // Sombras para tema oscuro
        'dark-soft': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'dark-card': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
        'dark-float': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(245, 224, 3, 0.15)', // Efecto glow con amarillo AB InBev
      },

      borderRadius: {
        'soft': '12px',
        'xl': '20px',
        '2xl': '24px',
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Transiciones personalizadas
      transitionProperty: {
        'transform-shadow': 'transform, box-shadow',
      }
    },
  },

  plugins: [forms],
}