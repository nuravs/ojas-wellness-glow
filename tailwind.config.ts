
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
				// Ojas wellness color palette
				wellness: {
					green: {
						light: '#E8F5E8',
						DEFAULT: '#4CAF50',
						dark: '#2E7D32'
					},
					yellow: {
						light: '#FFF8E1',
						DEFAULT: '#FFC107',
						dark: '#F57F17'
					},
					red: {
						light: '#FFEBEE',
						DEFAULT: '#F44336',
						dark: '#C62828'
					},
					blue: {
						light: '#E3F2FD',
						DEFAULT: '#2196F3',
						dark: '#1565C0'
					}
				},
				// Fixed calm color system
				calm: {
					50: '#F8FAFC',
					100: '#F1F5F9',
					200: '#E2E8F0',
					300: '#CBD5E1',
					400: '#94A3B8',
					500: '#64748B',
					600: '#475569',
					700: '#334155',
					800: '#1E293B',
					900: '#0F172A'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'wellness': ['Inter', 'system-ui', 'sans-serif'],
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gentle-fade-in': 'gentle-fade-in 0.3s ease-out',
				'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
				'check-mark': 'check-mark 0.4s ease-out'
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1.5' }],
				'sm': ['0.875rem', { lineHeight: '1.6' }],
				'base': ['1rem', { lineHeight: '1.6' }],
				'lg': ['1.125rem', { lineHeight: '1.6' }],
				'xl': ['1.25rem', { lineHeight: '1.6' }],
				'2xl': ['1.5rem', { lineHeight: '1.5' }],
				'3xl': ['1.875rem', { lineHeight: '1.4' }],
				'4xl': ['2.25rem', { lineHeight: '1.3' }],
				'5xl': ['3rem', { lineHeight: '1.2' }],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
