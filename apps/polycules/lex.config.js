import { defineLexiconConfig } from '@atcute/lex-cli';

export default defineLexiconConfig({
	files: ["lexicons-src/**/*.ts"],
	outdir: "src/lexicons/",
	export: {
		outdir: "lexicons/",
		clean: true,
	},
});
