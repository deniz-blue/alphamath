import type { Person, PolyculeManifest, System } from "../lib/legacy-schema/legacy-types";
import type { New } from "./store.type";

export const DEFAULT_MANIFEST: PolyculeManifest = {
    v: 1,
    people: [],
    systems: [],
    relationships: [],
    groupRelationships: [],
};

export const DEFAULT_SYSTEM: New<System> = {
	name: "",
	memberIds: [],
};

export const DEFAULT_PERSON: New<Person> = {
	name: "",
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
		{ id: "p_maya", name: "maya", avatarUrl: "https://cdn.discordapp.com/avatars/188520136867577856/a45fc089c13c0c0ba7e5377d44d81535.webp?size=80" },
		{ id: "p_mud", name: "mud" },
		{ id: "p_dirt", name: "dirt" },
	],
	relationships: [
		{ id: "r_xx1", from: { type: "person", id: "p_maya" }, to: { type: "person", id: "p_mud" } },
		{ id: "r_xx2", from: { type: "person", id: "p_maya" }, to: { type: "person", id: "p_dirt" } },
		{ id: "r_xx3", from: { type: "person", id: "p_mud" }, to: { type: "person", id: "p_dirt" } },
		{ id: "r_0", from: { type: "person", id: "p_0" }, to: { type: "person", id: "p_2" } },
		{ id: "r_1", from: { type: "person", id: "p_1" }, to: { type: "person", id: "p_2" } },
		{ id: "r_2", from: { type: "person", id: "p_5" }, to: { type: "person", id: "p_6" } },
	],
	systems: [
		{ id: "s_0", name: "C", memberIds: ["p_0", "p_1"] },
		{ id: "s_1", name: "ispik", memberIds: ["p_2", "p_3", "p_4"] },
	],
};
