
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Ojas empathetic wellness color palette - designed for neurological conditions
				wellness: {
					green: {
						light: '#F0F9F0',
						DEFAULT: '#2E7D32',
						dark: '#1B5E20'
					},
					blue: {
						light: '#E8F4FD',
						DEFAULT: '#1976D2',
						dark: '#0D47A1'
					},
					yellow: {
						light: '#FFFBF0',
						DEFAULT: '#F57C00',
						dark: '#E65100'
					},
					red: {
						light: '#FFF5F5',
						DEFAULT: '#D32F2F',
						dark: '#B71C1C'
					},
					purple: {
						light: '#F3E5F5',
						DEFAULT: '#7B1FA2',
						dark: '#4A148C'
					}
				},
				// Calm, accessible color system optimized for 50+ users
				calm: {
					50: '#FAFBFC',
					100: '#F4F6F8',
					200: '#E4E7EB',
					300: '#CBD2D9',
					400: '#9AA5B1',
					500: '#687078',
					600: '#4B5563',
					700: '#374151',
					800: '#1F2937',
					900: '#111827'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'wellness': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
				'heading': ['Inter', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1.6' }],
				'sm': ['0.875rem', { lineHeight: '1.7' }],
				'base': ['1rem', { lineHeight: '1.7' }],
				'lg': ['1.125rem', { lineHeight: '1.7' }],
				'xl': ['1.25rem', { lineHeight: '1.6' }],
				'2xl': ['1.5rem', { lineHeight: '1.5' }],
				'3xl': ['1.875rem', { lineHeight: '1.4' }],
				'4xl': ['2.25rem', { lineHeight: '1.3' }],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'gentle-fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(8px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'pulse-gentle': {
					'0%, 100%': {
						transform: 'scale(1)',
						opacity: '1'
					},
					'50%': {
						transform: 'scale(1.02)',
						opacity: '0.9'
					}
				},
				'check-mark': {
					'0%': {
						transform: 'scale(0) rotate(45deg)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1.2) rotate(45deg)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1) rotate(45deg)',
						opacity: '1'
					}
				},
				'expand-summary': {
					'0%': {
						height: '0',
						opacity: '0'
					},
					'100%': {
						height: 'auto',
						opacity: '1'
					}
				},
				'collapse-summary': {
					'0%': {
						height: 'auto',
						opacity: '1'
					},
					'100%': {
						height: '0',
						opacity: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gentle-fade-in': 'gentle-fade-in 0.3s ease-out',
				'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
				'check-mark': 'check-mark 0.4s ease-out',
				'expand-summary': 'expand-summary 0.3s ease-out',
				'collapse-summary': 'collapse-summary 0.3s ease-out'
			},
			boxShadow: {
				'wellness-soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
				'wellness-medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
				'wellness-strong': '0 8px 24px rgba(0, 0, 0, 0.16)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
