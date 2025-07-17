
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
				// Updated Ojas Color System for "Calm Clarity" Design
				ojas: {
					// Primary Blue - #0077B6
					'primary': '#0077B6',
					'primary-hover': '#005E8A',
					'primary-blue': '#0077B6',      
					'primary-blue-hover': '#005E8A', 
					
					// Calming Green - #00B488
					'success': '#00B488',
					'success-hover': '#009670',
					'calming-green': '#00B488',     
					'calming-green-hover': '#009670', 
					
					// Warning/attention colors
					'alert': '#FFC300',
					'alert-hover': '#E6B000',
					'soft-gold': '#FFC300',         
					'soft-gold-hover': '#E6B000',   
					
					// Error/urgent colors
					'error': '#FF4E4E',
					'error-hover': '#E63946',
					'vibrant-coral': '#FF4E4E',     
					'vibrant-coral-hover': '#E63946', 
					
					// Background - #F5F8FA
					'bg-light': '#F5F8FA',
					'mist-white': '#F5F8FA',        
					'soft-midnight': '#18233A',     
					
					// Text Main - #22292F
					'text-main': '#22292F',
					'charcoal-gray': '#22292F',     
					
					// Text Secondary - #6C7683
					'text-secondary': '#6C7683',
					'slate-gray': '#6C7683',        
					
					// Borders/Dividers - #E1E4EA
					'border': '#E1E4EA',
					'cloud-silver': '#E1E4EA'       
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
				'success-pulse': {
					'0%': {
						transform: 'scale(1)',
						boxShadow: '0 0 0 0 rgba(0, 180, 136, 0.7)'
					},
					'70%': {
						transform: 'scale(1.05)',
						boxShadow: '0 0 0 10px rgba(0, 180, 136, 0)'
					},
					'100%': {
						transform: 'scale(1)',
						boxShadow: '0 0 0 0 rgba(0, 180, 136, 0)'
					}
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-5px)' },
					'75%': { transform: 'translateX(5px)' }
				},
				'confetti': {
					'0%': { transform: 'translateY(-100px) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translateY(100px) rotate(720deg)', opacity: '0' }
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
				'success-pulse': 'success-pulse 1s ease-out',
				'shake': 'shake 0.5s ease-in-out',
				'confetti': 'confetti 3s ease-out'
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
