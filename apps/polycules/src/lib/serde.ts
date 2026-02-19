import { deflateSync, inflateSync } from "fflate"; // tiny & fast
import { LegacyPolyculeManifestSchema, type LegacyPolyculeManifest } from "./legacy-schema/legacy-types";

export const createShareLink = (graph: LegacyPolyculeManifest) => {
	return `${window.location.origin}${window.location.pathname}#${encodeGraph(graph)}`;
};

// Encode
export const encodeGraph = (graph: LegacyPolyculeManifest): string => {
	const json = JSON.stringify(graph);
	const compressed = deflateSync(new TextEncoder().encode(json));
	return "v1:" + btoa(String.fromCharCode(...compressed))
		.replace(/\+/g, "-")
		.replace(/\//g, "_"); // URL-safe
}

// Decode
export const decodeGraph = async (encoded: string): Promise<LegacyPolyculeManifest> => {
	const [v, payload] = encoded.split(":", 2);
	switch (v) {
		case "v1":
			const binary = Uint8Array.from(
				atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
				c => c.charCodeAt(0)
			);
			const json = new TextDecoder().decode(inflateSync(binary));
			return LegacyPolyculeManifestSchema.parse(JSON.parse(json));
		case "v1-fetch":
			const url = payload.startsWith("http") ? payload : "https://" + payload;
			const res = await fetch(url);
			return LegacyPolyculeManifestSchema.parse(await res.json());
		default:
			throw new Error("Unsupported encoding version " + v);
	}
}
