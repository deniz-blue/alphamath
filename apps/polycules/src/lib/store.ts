import { parseResourceUri, type Did } from "@atcute/lexicons";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { BlueDenizPolyRelationship } from "../lexicons";
import { handleResolver, resolveUriAsCanonical } from "./atproto/atproto-services";
import { isHandle, type AtprotoDid, type CanonicalResourceUri } from "@atcute/lexicons/syntax";
import { queryClient } from "../query-client";
import { isAtprotoDid } from "@atcute/identity";

export type NodeId = AtprotoDid | CanonicalResourceUri;
export type Edge = { from: NodeId; to: NodeId; };

export const relationshipNodeId = async (rel: BlueDenizPolyRelationship.Main, dids?: string[]): Promise<NodeId | null> => {
	if (rel.subject.$type === "blue.deniz.poly.relationship#didLink") {
		let id = rel.subject.did;
		dids?.push(id);
		return id as AtprotoDid;
	} else if (rel.subject.$type === "blue.deniz.poly.relationship#recordLink") {
		let id = await resolveUriAsCanonical(rel.subject.uri);
		const parsed = parseResourceUri(rel.subject.uri);
		if (parsed.ok && parsed.value.repo) {
			let { repo } = parsed.value;
			if (isHandle(repo)) repo = await handleResolver.resolve(repo);
			dids?.push(repo);
		};
		return id;
	} else return null;
};

export interface Graph {
	nodes: NodeId[];
	edges: Edge[];
};

interface StoreActions {
	processRelationshipDelete: (source: AtprotoDid) => Promise<void>;

	// Higher calls
	removeSingleNodes: (except: AtprotoDid[]) => void;

	// Lower calls
	crawlDid: (did: AtprotoDid) => Promise<void>;
	crawlDidConditional: (did: AtprotoDid) => Promise<void>;
	crawlRelationship: (source: AtprotoDid, record: BlueDenizPolyRelationship.Main) => Promise<void>;
	addRelationshipRecord: (source: AtprotoDid, record: BlueDenizPolyRelationship.Main) => Promise<void>;
}

export const useGraphStore = create<Graph & StoreActions>()(
	immer((set, get) => ({
		nodes: [],
		edges: [],

		crawlDidConditional: async (did) => {
			if (!get().nodes.includes(did)) await get().crawlDid(did);
		},

		crawlDid: async (did) => {
			set(state => {
				if (!state.nodes.includes(did)) {
					state.nodes.push(did);
					console.log("crawlDid: Added node", did);
				};
			});

			const relationships = await queryClient.ensureQueryData<Record<string, BlueDenizPolyRelationship.Main>>({
				queryKey: ["at", did, "blue.deniz.poly.relationship", "*"],
			});

			for (const [__rkey, record] of Object.entries(relationships)) {
				await get().crawlRelationship(did, record);
			};
		},

		crawlRelationship: async (source, record) => {
			await get().addRelationshipRecord(source, record);

			if (record.subject.$type === "blue.deniz.poly.relationship#didLink")
				await get().crawlDidConditional(record.subject.did as AtprotoDid);
			else if (record.subject.$type === "blue.deniz.poly.relationship#recordLink") {
				const parsed = parseResourceUri(record.subject.uri);
				if (parsed.ok && parsed.value.repo) {
					let { repo } = parsed.value;
					if (isHandle(repo)) repo = await handleResolver.resolve(repo);
					await get().crawlDidConditional(repo as AtprotoDid);
				};
			};
		},

		addRelationshipRecord: async (source, record) => {
			let from: NodeId = source;
			let to: NodeId;

			if (record.via && record.via.$type === "blue.deniz.poly.relationship#recordLink")
				from = await resolveUriAsCanonical(record.via.uri);

			if (record.subject.$type === "blue.deniz.poly.relationship#didLink")
				to = record.subject.did as AtprotoDid;
			else if (record.subject.$type === "blue.deniz.poly.relationship#recordLink")
				to = await resolveUriAsCanonical(record.subject.uri);
			else return;

			const edge: Edge = { from, to };

			console.log("Processing relationship record", { source, record, edge });

			set(state => {
				if (!state.edges.some(e => e.from === edge.from && e.to === edge.to)) {
					state.edges.push(edge);
					console.log("Added edge", edge);
				};

				console.log("INCLUDES CHECK", { to, includes: state.nodes.includes(to), arr: state.nodes });
				if (!state.nodes.includes(to)) {
					state.nodes.push(to);
					console.log("Added node", to);
				};
			});
		},

		processRelationshipDelete: async (source) => {
			set(state => {
				state.nodes = state.nodes.filter(n => n !== source);
				state.edges = state.edges.filter(e => e.from !== source && e.to !== source);
				console.log("Removed node and edges for", source);
			});
			// await get().addToGraph(source);
			get().removeSingleNodes([source]);
		},

		removeSingleNodes: (except: AtprotoDid[]) => {
			set(state => {
				state.nodes = state.nodes.filter(n => {
					if (!isAtprotoDid(n)) return true;
					if (except.includes(n)) return true;
					return state.edges.some(e => e.from === n || e.to === n);
				});
			});
		},
	})),
);

// @ts-expect-error
window.useGraphStore = useGraphStore;
