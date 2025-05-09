
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
				// Updated with empath-zone color palette
				empath: {
					50: '#f5f3f9',
					100: '#ebe7f4',
					200: '#d6cfe8',
					300: '#b7abd6',
					400: '#9884bf',
					500: '#8168aa',
					600: '#6c538f',
					700: '#5a4476',
					800: '#4d3a63',
					900: '#40334f',
					950: '#281e31',
				},
				calm: {
					50: '#f8f7f7',
					100: '#f2efed',
					200: '#e8e3dd',
					300: '#d6ccc1',
					400: '#bfaea0',
					500: '#ab9784',
					600: '#9a826f',
					700: '#806a5c',
					800: '#6a584d',
					900: '#594a42',
					950: '#2e2622',
				},
				support: {
					50: '#eef4f2',
					100: '#cfe0db',
					200: '#afc8c0',
					300: '#8ea9a0',
					400: '#6b8a80',
					500: '#557167',
					600: '#435a52',
					700: '#324540',
					800: '#22302d',
					900: '#121b1a',
					950: '#060c0b',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-up': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(10px)' 
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)' 
					}
				},
				'pulse-gentle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'waveform-movement': {
					'0%': { transform: 'scaleY(0.5)' },
					'50%': { transform: 'scaleY(1.2)' },
					'100%': { transform: 'scaleY(0.5)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-up': 'fade-up 0.5s ease-out',
				'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
				'waveform-movement': 'waveform-movement 1.2s ease-in-out infinite'
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['Merriweather', 'serif'],
				display: ['Poppins', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

