// Force directed layout calculations

import type { Person, PolyculeManifest, System } from "./types";
import { type Vec2, vec2, vec2sub, vec2mul, vec2add, vec2average } from "@alan404/vec2";
import { forceCenter, forceLink, forceManyBody, forceSimulation, type SimulationLinkDatum, type SimulationNodeDatum } from "d3-force";

type D3Extra = {
    vx?: number;
    vy?: number;
};

export interface ComputeResult {
    people: Record<string, Vec2 & D3Extra>;
    systems: Record<string, Vec2>;
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

export const compute = (
    root: PolyculeManifest,
    prev?: ComputeResult
): ComputeResult => {
    // 1. apply force between Person[] to drift them apart // d3.forceManyBody
    // 2. apply glue force between system members so they show up as a group
    //    - find center point of systems and push them there? idk
    // 3. apply force according to relationships // d3.forceLink
    // 4. apply group force to group relationships // like #2 but diff

    let result: ComputeResult = structuredClone(prev) ?? {
        people: {},
        systems: {}
    };


    // use D3 until we reimplement everything ourselves
    type Datum = SimulationNodeDatum & { person?: Person; system?: System; };

    // == Nodes

    const nodes: Datum[] = [];

    for (let p of root.people) {
        nodes.push({
            person: p,
            ...prev?.people?.[p.id],
            x: prev?.people?.[p.id]?.x ?? (Math.random() - 0.5) * 100,
            y: prev?.people?.[p.id]?.y ?? (Math.random() - 0.5) * 100,
        });
    }

    for (let s of root.systems) {
        const memberPositions = s.memberIds.map(id => prev?.people[id])
            .filter(x => !!x);

        const avg = vec2average(memberPositions);

        nodes.push({
            system: s,
            x: avg.x,
            y: avg.y,
        });

        result.systems[s.id] = avg;
    }

    // == Forces

    const alterLinks: SimulationLinkDatum<Datum>[] = [];
    for (let sys of root.systems) {
        let d3ids = root.people.filter(x => x.systemId == sys.id)
            .map(p => "P/" + p.id);

        const combinations = getCombinations2(d3ids);

        for(let [source, target] of combinations)
            alterLinks.push({ source, target });
    }

    const relationshipLinks: SimulationLinkDatum<Datum>[] = [];
    for (let r of root.relationships) {
        const sourceId = r.from.type === "person" ? "P/" + r.from.id : "S/" + r.from.id;
        const targetId = r.to.type === "person" ? "P/" + r.to.id : "S/" + r.to.id;
        relationshipLinks.push({ source: sourceId, target: targetId });
    }

    // == Sim

    const datumId = (d: Datum) => d.person ? "P/" + d.person.id : d.system ? "S/" + d.system.id : "";

    const sim = forceSimulation<Datum>()
        .nodes(nodes)
        .force("center", forceCenter(0, 0))
        .force("charge", forceManyBody<Datum>().strength(d => d.system ? 0 : -50).distanceMin(10).distanceMax(200))
        .force("alters", forceLink<Datum, SimulationLinkDatum<Datum>>(alterLinks).id(datumId).strength(0.02))
        .force("relationships", forceLink<Datum, SimulationLinkDatum<Datum>>(relationshipLinks).id(datumId).strength(0.01))
        .stop();

    sim.tick();

    sim.nodes().forEach(n => {
        if (n.person) result.people[n.person.id] = n as Vec2 & D3Extra;
        // if(n.system) result.systems[n.system.id] = vec2(n);
    });

    return result;





    // REIMPLEMENTATION

    for (let i = 0; i < root.people.length; i++) {
        for (let j = i + 1; j < root.people.length; j++) {
            const p1 = root.people[i];
            const p2 = root.people[j];
            const p1_coord = result.people?.[p1.id] ?? vec2();
            const p2_coord = result.people?.[p2.id] ?? vec2();
            const diff = vec2sub(p1_coord, p2_coord);
            const diff_magsqr = diff.x * diff.x + diff.y * diff.y;
            const force = vec2mul(diff, 1 / diff_magsqr);

            result.people[p1.id] = vec2add(p1_coord, force);
            result.people[p2.id] = vec2sub(p2_coord, force);
        }
    }

    return result;
};

