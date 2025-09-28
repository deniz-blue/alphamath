import { deflateSync, inflateSync } from "fflate"; // tiny & fast
import type { PolyculeManifest } from "./types";

// Encode
export const encodeGraph = (graph: PolyculeManifest): string => {
	const json = JSON.stringify(graph);
	const compressed = deflateSync(new TextEncoder().encode(json));
	return "v1:" + btoa(String.fromCharCode(...compressed))
		.replace(/\+/g, "-")
		.replace(/\//g, "_"); // URL-safe
}

// Decode
export const decodeGraph = (encoded: string): PolyculeManifest => {
	const [v, payload] = encoded.split(":", 2);
	switch (v) {
		case "v1":
			const binary = Uint8Array.from(
				atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
				c => c.charCodeAt(0)
			);
			const json = new TextDecoder().decode(inflateSync(binary));
			return JSON.parse(json);
		default:
			throw new Error("Unsupported encoding version " + v);
	}
}
