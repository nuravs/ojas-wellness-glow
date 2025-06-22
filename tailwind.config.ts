
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
				// New Ojas Accessible Color Palette
				ojas: {
					primary: '#0077B6',        // Primary Blue - Main buttons, pulse, icons
					'primary-hover': '#005E8A', // Darker blue for hover states
					success: '#00B488',        // Calming Green - Success, wellness, completed states
					'success-hover': '#009670', // Darker green for hover
					alert: '#FFC300',          // Soft Gold - Alerts, attention banners, skip buttons
					'alert-hover': '#E6B000',  // Darker gold for hover
					error: '#FF4E4E',          // Vibrant Coral - Errors, urgency, overdue badges
					'error-hover': '#E63946',  // Darker coral for hover
					'bg-light': '#F5F8FA',     // Mist White - App main background
					'bg-dark': '#18233A',      // Soft Midnight Blue - High contrast mode
					'text-main': '#22292F',    // Charcoal Gray - Standard text, icons
					'text-secondary': '#6C7683', // Slate Gray - Secondary/less prominent text
					border: '#E1E4EA'          // Cloud Silver - Card borders, separators
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'ojas': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
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
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(0, 119, 182, 0.2)'
					},
					'50%': {
						boxShadow: '0 0 30px rgba(0, 119, 182, 0.4)'
					}
				},
				'pulse-urgent': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(255, 78, 78, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 30px rgba(255, 78, 78, 0.5)'
					}
				},
				'success-check': {
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
				'card-highlight': {
					'0%': {
						transform: 'scale(1)',
						boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
					},
					'100%': {
						transform: 'scale(1.02)',
						boxShadow: '0 8px 32px rgba(0, 119, 182, 0.15)'
					}
				},
				'pill-bottle-fill': {
					'0%': {
						transform: 'scale(0.8)',
						opacity: '0.5'
					},
					'50%': {
						transform: 'scale(1.1)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gentle-fade-in': 'gentle-fade-in 0.3s ease-out',
				'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'pulse-urgent': 'pulse-urgent 2s ease-in-out infinite',
				'success-check': 'success-check 0.5s ease-out',
				'card-highlight': 'card-highlight 0.3s ease-out forwards',
				'pill-bottle-fill': 'pill-bottle-fill 1.5s ease-out'
			},
			boxShadow: {
				'ojas-soft': '0 2px 8px rgba(34, 41, 47, 0.08)',
				'ojas-medium': '0 4px 16px rgba(34, 41, 47, 0.12)',
				'ojas-strong': '0 8px 24px rgba(34, 41, 47, 0.16)',
				'ojas-glow': '0 0 20px rgba(0, 119, 182, 0.2)',
				'ojas-glow-strong': '0 0 30px rgba(0, 119, 182, 0.4)',
				'ojas-urgent': '0 0 20px rgba(255, 78, 78, 0.3)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
