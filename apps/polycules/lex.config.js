import { defineLexiconConfig } from "@atcute/lex-cli";

export default defineLexiconConfig({
	files: [
		"lexicons-src/**/*.ts",
		"lexicons-src/**/*.json",
	],
	outdir: "src/lexicons/",
	export: {
		outdir: "lexicons/",
		files: ["lexicons-src/**/*.ts"],
		clean: true,
	},
});
