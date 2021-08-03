import preprocess from 'svelte-preprocess';
import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			includePaths: ['theme']
		}
	}),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: node(),
		vite: {
			ssr: {
				noExternal: [
					'@smui/button',
					'@smui/fab',
					'@smui/icon-button',
					'@smui/list',
					'@smui/paper',
					'@smui/ripple',
					'@smui/select',
					'@smui/textfield',
					'@smui/tooltip',
					'@smui/dialog',
					'@smui/form-field',
					'@smui/linear-progress',
					'@smui/switch',
					'@smui/radio',
				]
			}
		}
	}
};

export default config;
