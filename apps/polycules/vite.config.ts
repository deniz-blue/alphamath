import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { AtprotoOAuth } from "@deniz-blue/vite-plugins";

const SERVER_HOST = "127.0.0.1";
const SERVER_PORT = 5173;

export default defineConfig({
	clearScreen: false,
	server: {
		host: SERVER_HOST,
		port: SERVER_PORT,
	},

	resolve: {
		tsconfigPaths: true,
	},

	plugins: [
		tanstackRouter({
			target: "react",
			routesDirectory: "./src/routes",
			generatedRouteTree: "./src/routeTree.gen.ts",
			quoteStyle: "double",
		}),
		react(),
		AtprotoOAuth(),
	],
});
