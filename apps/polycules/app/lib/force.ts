// Force directed layout calculations

import type { Person, PolyculeManifest } from "./types";
import { type Vec2, vec2, vec2sub, vec2mul, vec2add } from "@alan404/vec2";
import { forceLink, forceManyBody, forceSimulation, type SimulationLinkDatum, type SimulationNodeDatum } from "d3-force";

export interface ComputeResult {
    people: Record<string, Vec2>;
    systems: Record<string, Vec2>;
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

    type Datum = SimulationNodeDatum & { person: Person };
    const sim = forceSimulation<Datum>()
        .nodes(root.people.map(person => ({ person })))
        .force("charge", forceManyBody().strength(-2000))
        .force("link", forceLink<Datum, SimulationLinkDatum<Datum>>(
            root.relationships.map(r => ({
                source: r.from,
                target: r.to,
                strength: 0.1,
            }))
        )
        .id(d => (d as any).person.id))
        .stop();

    sim.tick();

    sim.nodes().forEach(n => {
        if (!n.x || !n.y || !n.person.id) return;
        result.people[n.person.id] = { x: n.x, y: n.y };
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

