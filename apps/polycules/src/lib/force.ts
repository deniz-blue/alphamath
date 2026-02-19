// Force directed layout calculations

import { type Vec2, vec2, vec2sub, vec2mul, vec2add, vec2average } from "@alan404/vec2";
import { forceCenter, forceLink, forceManyBody, forceSimulation, type SimulationLinkDatum, type SimulationNodeDatum } from "d3-force";
import type { Graph, NodeId } from "./store";

type D3Extra = {
	vx?: number;
	vy?: number;
};

export const getCombinations2 = <T>(array: T[]): [T, T][] => {
	let results: [T, T][] = [];
	for (let i = 0; i < array.length - 1; i++) {
		for (let j = i + 1; j < array.length; j++) {
			results.push([array[i], array[j]]);
		}
	}
	return results;
};

export interface ComputeResult {
	nodes: Record<NodeId, Vec2 & D3Extra>;
};

export const compute = (
	root: Graph,
	prev?: ComputeResult,
	meta?: {
		isDragging?: boolean;
	},
): ComputeResult => {
	// 1. apply force between Person[] to drift them apart // d3.forceManyBody
	// 2. apply glue force between system members so they show up as a group
	//    - find center point of systems and push them there? idk
	// 3. apply force according to relationships // d3.forceLink
	// 4. apply group force to group relationships // like #2 but diff

	let result: ComputeResult = structuredClone(prev) ?? {
		nodes: {},
	};


	// use D3 until we reimplement everything ourselves
	type Datum = SimulationNodeDatum & { id: NodeId };

	// == Nodes

	const nodes: Datum[] = [];

	const jiggle = () => (Math.random() - 0.5) * 100;
	for (let id of root.nodes) {
		nodes.push({
			id,
			...(prev?.nodes?.[id] || {
				x: jiggle(),
				y: jiggle(),
			}),
		});
	}

	// for (let s of root.systems) {
	// 	const memberPositions = s.memberIds.map(id => prev?.nodes[id])
	// 		.filter(x => !!x && !!x.x && !!x.y);

	// 	const avg = vec2average(memberPositions);

	// 	nodes.push({
	// 		system: s,
	// 		x: avg.x,
	// 		y: avg.y,
	// 	});

	// 	result.systems[s.id] = avg;
	// }

	// == Forces

	// const alterLinks: SimulationLinkDatum<Datum>[] = [];
	// for (let sys of root.systems) {
	// 	const d3sys = "S/" + sys.id;

	// 	let d3ids = root.people.filter(x => x.systemId == sys.id)
	// 		.map(p => "P/" + p.id);

	// 	for (let d3id of d3ids)
	// 		alterLinks.push({ source: d3id, target: d3sys });

	// 	// const combinations = getCombinations2(d3ids);

	// 	// for(let [source, target] of combinations)
	// 	//     alterLinks.push({ source, target });
	// }

	const relationshipLinks: SimulationLinkDatum<Datum>[] = [];
	const p2pRelationshipLinks: SimulationLinkDatum<Datum>[] = [];
	const p2sRelationshipLinks: SimulationLinkDatum<Datum>[] = [];
	const s2sRelationshipLinks: SimulationLinkDatum<Datum>[] = [];

	for (const edge of root.edges) {
		const sourceId = edge.from;
		const targetId = edge.to;
		relationshipLinks.push({ source: sourceId, target: targetId });
	}


	// for (let r of root.relationships) {
	// 	if (r.from.type == r.to.type) {
	// 		// person-person or system-system
	// 		if (r.from.type == "person") {
	// 			p2pRelationshipLinks.push({
	// 				source: "P/" + r.from.id,
	// 				target: "P/" + r.to.id,
	// 			});
	// 		} else {
	// 			const fromMemberIds = root.systems.find(s => s.id == r.from.id)?.memberIds || [];
	// 			const toMemberIds = root.systems.find(s => s.id == r.to.id)?.memberIds || [];

	// 			for (let a of fromMemberIds)
	// 				for (let b of toMemberIds)
	// 					s2sRelationshipLinks.push({
	// 						source: "P/" + a,
	// 						target: "P/" + b,
	// 					});
	// 		}
	// 	} else {
	// 		// person-system
	// 		let personDatumId = "P/" + (r.from.type == "person" ? r.from.id : r.to.id);
	// 		let systemId = "S/" + (r.from.type == "system" ? r.from.id : r.to.id);
	// 		let system = root.systems.find(s => s.id == systemId);
	// 		if (!system) continue;
	// 		for (let memberId of system.memberIds) {
	// 			p2sRelationshipLinks.push({
	// 				source: "P/" + memberId,
	// 				target: personDatumId,
	// 			})
	// 		}
	// 	}
	// 	// const sourceId = r.from.type === "person" ? "P/" + r.from.id : "S/" + r.from.id;
	// 	// const targetId = r.to.type === "person" ? "P/" + r.to.id : "S/" + r.to.id;
	// 	// relationshipLinks.push({ source: sourceId, target: targetId });
	// }

	// == Sim

	// const datumId = (d: Datum) => d.person ? "P/" + d.person.id : d.system ? "S/" + d.system.id : "";
	const datumId = (d: Datum) => d.id;

	const sim = forceSimulation<Datum>()
		.stop()
		.nodes(nodes)
		// .force("charge", forceManyBody<Datum>().strength(d => d.system ? 0 : -1).distanceMin(10).distanceMax(200))
		.force("charge", forceManyBody<Datum>().strength(d => -1).distanceMin(10).distanceMax(200))
		// .force("alters", forceLink<Datum, SimulationLinkDatum<Datum>>(alterLinks).id(datumId).strength(0.02))
		.force("rel-p2p", forceLink<Datum, SimulationLinkDatum<Datum>>(p2pRelationshipLinks).id(datumId).strength(0.01))
		.force("rel-p2s", forceLink<Datum, SimulationLinkDatum<Datum>>(p2sRelationshipLinks).id(datumId).strength(0.0001))
		.force("rel-s2s", forceLink<Datum, SimulationLinkDatum<Datum>>(s2sRelationshipLinks).id(datumId).strength(0.0000001))

	if (!meta?.isDragging) sim
		.force("center", forceCenter(0, 0).strength(0.01))

	sim.tick();

	sim.nodes().forEach(n => {
		result.nodes[n.id] = n as Vec2 & D3Extra;
		// if (n.person) result.people[n.person.id] = n as Vec2 & D3Extra;
		// // if(n.system) result.systems[n.system.id] = vec2(n);
	});

	return result;





	// REIMPLEMENTATION

	// for (let i = 0; i < root.people.length; i++) {
	// 	for (let j = i + 1; j < root.people.length; j++) {
	// 		const p1 = root.people[i];
	// 		const p2 = root.people[j];
	// 		const p1_coord = result.people?.[p1.id] ?? vec2();
	// 		const p2_coord = result.people?.[p2.id] ?? vec2();
	// 		const diff = vec2sub(p1_coord, p2_coord);
	// 		const diff_magsqr = diff.x * diff.x + diff.y * diff.y;
	// 		const force = vec2mul(diff, 1 / diff_magsqr);

	// 		result.people[p1.id] = vec2add(p1_coord, force);
	// 		result.people[p2.id] = vec2sub(p2_coord, force);
	// 	}
	// }

	return result;
};

