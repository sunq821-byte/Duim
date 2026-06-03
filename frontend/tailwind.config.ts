import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E2022',
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: 'rgba(37,99,235,0.08)',
          ring: 'rgba(37,99,235,0.20)',
        },
        surface: '#FFFFFF',
        muted: '#8A94A6',
        'muted-light': '#A0A8B4',
        border: '#E8ECF1',
        'border-light': '#F2F4F6',
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F4F6F8',
        'bg-tertiary': '#E8ECF1',
        success: '#10B981',
        expense: '#F59E0B',
        income: '#10B981',
        schedule: '#2563EB',
        reminder: '#8B5CF6',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"',
          '"SF Pro Text"', '"Helvetica Neue"', '"Noto Sans SC"',
          'Arial', 'sans-serif',
        ],
        mono: ['"JetBrains Mono"', '"SF Mono"', '"Space Grotesk"', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        ambient: '0 1px 3px rgba(30,32,34,0.04), 0 4px 12px rgba(30,32,34,0.04)',
        'ambient-md': '0 2px 8px rgba(30,32,34,0.06), 0 8px 24px rgba(30,32,34,0.06)',
        'ambient-lg': '0 4px 16px rgba(30,32,34,0.08), 0 16px 48px rgba(30,32,34,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 400ms ease-out both',
        'slide-up': 'slideUp 400ms ease-out both',
        'pulse-dot': 'dotPulse 1.4s infinite both',
        'idle-breath': 'idleBreath 5s ease-in-out infinite',
        'ripple-out': 'rippleOut 2s ease-out infinite',
        'spin-ring': 'spinRing 3s linear infinite',
        'success-bounce': 'successBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'toast-in': 'toastIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) both',
        'toast-out': 'toastOut 0.3s ease-in forwards',
        'particle-fly': 'particleFly 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'menu-in': 'menuSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'menu-out': 'menuSlideOut 0.3s ease-in both',
        'sheet-up': 'sheetUp 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'sheet-down': 'sheetDown 0.3s ease-in both',
        waveform: 'waveform 0.6s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        dotPulse: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.3' },
          '40%': { transform: 'scale(1)', opacity: '0.8' },
        },
        idleBreath: {
          '0%, 100%': { transform: 'scale(0.98)' },
          '50%': { transform: 'scale(1.02)' },
        },
        rippleOut: {
          '0%': { transform: 'scale(0.85)', opacity: '0.5' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        spinRing: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        successBounce: {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
        toastIn: {
          '0%': { transform: 'translate(-50%, -12px) scale(0.9)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0) scale(1)', opacity: '1' },
        },
        toastOut: {
          '0%': { transform: 'translate(-50%, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -8px) scale(0.95)', opacity: '0' },
        },
        particleFly: {
          '0%': { transform: 'translate(-50%, -50%) translate(0, 0) scale(1)', opacity: '1' },
          '50%': { transform: 'translate(-50%, -50%) translate(var(--dx-mid), var(--dy-mid)) scale(0.6)', opacity: '0.5' },
          '100%': { transform: 'translate(-50%, -50%) translate(var(--dx-end), var(--dy-end)) scale(0.1)', opacity: '0' },
        },
        menuSlideIn: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        menuSlideOut: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        sheetUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        sheetDown: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
        waveform: {
          '0%': { transform: 'scaleY(0.4)' },
          '100%': { transform: 'scaleY(1.0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
