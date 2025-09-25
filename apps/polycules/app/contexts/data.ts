import type { PolyculeManifest } from "../lib/types";

export const DEFAULT_MANIFEST: PolyculeManifest = {
    v: 1,
    people: [],
    systems: [],
    relationships: [],
    groupRelationships: [],
};

export const TEST_MANIFEST: PolyculeManifest = {
	...DEFAULT_MANIFEST,
	people: [
		{ id: "p_0", name: "deniz", systemId: "s_0" },
		{ id: "p_1", name: "bulut", systemId: "s_0" },
		{ id: "p_2", name: "ispik", systemId: "s_1" },
		{ id: "p_3", name: "kenn", systemId: "s_1" },
		{ id: "p_4", name: "remi", systemId: "s_1" },
		{ id: "p_5", name: "athenya", color: "orange" },
		{ id: "p_6", name: "cyan", color: "cyan" },
	],
	relationships: [
		{ id: "r_0", from: { type: "person", id: "p_0" }, to: { type: "person", id: "p_2" } },
		{ id: "r_1", from: { type: "person", id: "p_1" }, to: { type: "person", id: "p_2" } },
		{ id: "r_2", from: { type: "person", id: "p_5" }, to: { type: "person", id: "p_6" } },
	],
	systems: [
		{ id: "s_0", name: "C&", memberIds: ["p_0", "p_1"] },
		{ id: "s_1", name: "ispik&", memberIds: ["p_2", "p_3", "p_4"] },
	],
};
