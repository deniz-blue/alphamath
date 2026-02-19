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
	addToGraph: (did: AtprotoDid) => Promise<void>;
	processRelationshipRecord: (source: AtprotoDid, record: BlueDenizPolyRelationship.Main) => Promise<void>;
	processRelationshipDelete: (source: AtprotoDid) => Promise<void>;
	removeSingleNodes: (except: AtprotoDid[]) => void;
}

export const useGraphStore = create<Graph & StoreActions>()(
	immer((set, get) => ({
		nodes: [],
		edges: [],

		addToGraph: async (did) => {
			if (get().nodes.includes(did)) return;

			set(state => {
				state.nodes.push(did);
			});

			const relationships = await queryClient.ensureQueryData<Record<string, BlueDenizPolyRelationship.Main>>({
				queryKey: ["at", did, "blue.deniz.poly.relationship", "*"],
			});

			for (const [__rkey, record] of Object.entries(relationships)) {
				await get().processRelationshipRecord(did, record);
			};
		},

		processRelationshipRecord: async (source, record) => {
			let from: NodeId = source;

			if (record.via)
				from = await resolveUriAsCanonical(record.via.uri);

			let dids: AtprotoDid[] = [];
			let to: NodeId | null = await relationshipNodeId(record, dids);
			if (!to) return;

			const edge: Edge = {
				from,
				to,
			};

			set(state => {
				if (!state.edges.some(e => e.from === edge.from && e.to === edge.to)) {
					state.edges.push(edge);
					console.log("Added edge", edge);
				};

				for (const did of dids) {
					if (!state.nodes.includes(did)) {
						state.nodes.push(did);
						console.log("Added node", did);
					};
				};
			});
		},

		processRelationshipDelete: async (source) => {
			set(state => {
				state.nodes = state.nodes.filter(n => n !== source);
				state.edges = state.edges.filter(e => e.from !== source && e.to !== source);
				console.log("Removed node and edges for", source);
			});
			await get().addToGraph(source);
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
