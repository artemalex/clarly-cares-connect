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
				// New color palette
				lavender: {
					DEFAULT: '#B7A9D2',
					50: '#F5F2F9',
					100: '#E9E4F3',
					200: '#D7CEEA',
					300: '#C7BDE0',
					400: '#B7A9D2', // Primary
					500: '#9E8BC3',
					600: '#846DB3',
					700: '#6D56A0',
					800: '#5A467F',
					900: '#42345E',
					950: '#342A49',
				},
				beige: {
					DEFAULT: '#F5EFE9',
					50: '#FFFFFF',
					100: '#FFFFFF',
					200: '#FFFBF8',
					300: '#FAF7F4',
					400: '#F5EFE9', // Primary
					500: '#E6D9CA',
					600: '#D6C3AB',
					700: '#C7AD8C',
					800: '#B7976D',
					900: '#9F7E52',
					950: '#8C6F48',
				},
				teal: {
					DEFAULT: '#8CA8A0',
					50: '#F0F4F3',
					100: '#E1E9E6',
					200: '#C7D5D0',
					300: '#ACC0B9',
					400: '#8CA8A0', // Primary
					500: '#728F86',
					600: '#5D746B',
					700: '#485951',
					800: '#343F3A',
					900: '#202624',
					950: '#161A19',
				},
				eggplant: {
					DEFAULT: '#403A4F',
					50: '#D6D3DC',
					100: '#C2BDC9',
					200: '#A99FB0',
					300: '#8F8297',
					400: '#63597B',
					500: '#403A4F', // Primary
					600: '#342F41',
					700: '#282333',
					800: '#1C1825',
					900: '#100E16',
					950: '#0A090E',
				},
				coral: {
					DEFAULT: '#F2CFC1',
					50: '#FEF9F7',
					100: '#FBEEE9',
					200: '#F7DED3',
					300: '#F2CFC1', // Primary
					400: '#EAAE96',
					500: '#E28E6B',
					600: '#DA6D3F',
					700: '#BC522A',
					800: '#8E3E20',
					900: '#602A15',
					950: '#49200F',
				},
				// Keeping the original clarly and support colors for backward compatibility
				// but they will be gradually phased out in favor of the new palette
				clarly: {
					50: '#eefbfd',
					100: '#d3f4fa',
					200: '#ade9f5',
					300: '#75d7ed',
					400: '#34bede',
					500: '#16a3c4',
					600: '#1283a3',
					700: '#156885',
					800: '#19566e',
					900: '#1a485d',
					950: '#0d2e3d',
				},
				support: {
					50: '#f0fbf3',
					100: '#def6e4',
					200: '#bfecca',
					300: '#90dcaa',
					400: '#60c385',
					500: '#32a35f',
					600: '#24864c',
					700: '#1e6c3e',
					800: '#1c5634',
					900: '#18472c',
					950: '#0a2617',
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-up': 'fade-up 0.5s ease-out',
				'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite'
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
