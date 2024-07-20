/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				pri: '#ff8906',
				sec: '#0f0e17',
				ter: '#e53170',
				main: '#fffffe',
				text: '#fffffe',
				subtext: '#2e2f3e',	
				paragraph: '#a7a9be'
			}
		},
	},
	plugins: [],
}
