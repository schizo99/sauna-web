import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	define: {
		'import.meta.env.BASE_URL': JSON.stringify('https://sauna.schizo.eu/'),
	  },
	plugins: [sveltekit()]
});
