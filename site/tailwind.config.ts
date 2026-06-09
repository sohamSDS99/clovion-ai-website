import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        lg: '2rem'
      },
      screens: {
        '2xl': '1240px'
      }
    },
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace']
      },
      colors: {
        bg: '#FAFAF7',
        ink: {
          DEFAULT: '#0a0a0f',
          80: 'rgba(10, 10, 15, 0.80)',
          70: 'rgba(10, 10, 15, 0.70)',
          60: 'rgba(10, 10, 15, 0.60)',
          50: 'rgba(10, 10, 15, 0.50)',
          40: 'rgba(10, 10, 15, 0.40)'
        },
        muted: '#6b7280',
        subtle: '#F5F3EF',
        line: '#eceae5'
      },
      borderRadius: {
        pill: '999px',
        card: '20px',
        xl2: '28px'
      },
      boxShadow: {
        card: '0 1px 2px rgba(10, 10, 15, 0.04), 0 8px 24px -8px rgba(10, 10, 15, 0.08), 0 0 0 1px rgba(10, 10, 15, 0.04)',
        soft: '0 1px 2px rgba(10, 10, 15, 0.04), 0 12px 32px -10px rgba(10, 10, 15, 0.10)',
        focus: '0 0 0 3px rgba(10, 10, 15, 0.15)'
      },
      animation: {
        'orb-pulse': 'orbPulse 8s ease-in-out infinite',
        'orb-drift': 'orbDrift 14s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'rise': 'rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards'
      },
      keyframes: {
        orbPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.08)', opacity: '1' }
        },
        orbDrift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-2%, 1%)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
}

export default config
