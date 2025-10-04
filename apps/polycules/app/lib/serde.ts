import { deflateSync, inflateSync } from "fflate"; // tiny & fast
import type { PolyculeManifest } from "./types";

export const createShareLink = (graph: PolyculeManifest) => {
	return `${window.location.origin}${window.location.pathname}#${encodeGraph(graph)}`;
};

// Encode
export const encodeGraph = (graph: PolyculeManifest): string => {
	const json = JSON.stringify(graph);
	const compressed = deflateSync(new TextEncoder().encode(json));
	return "v1:" + btoa(String.fromCharCode(...compressed))
		.replace(/\+/g, "-")
		.replace(/\//g, "_"); // URL-safe
}

// Decode
export const decodeGraph = async (encoded: string): Promise<PolyculeManifest> => {
	const [v, payload] = encoded.split(":", 2);
	switch (v) {
		case "v1":
			const binary = Uint8Array.from(
				atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
				c => c.charCodeAt(0)
			);
			const json = new TextDecoder().decode(inflateSync(binary));
			return JSON.parse(json);
		case "v1-fetch":
			const res = await fetch(payload);
			return await res.json();
		default:
			throw new Error("Unsupported encoding version " + v);
	}
}
