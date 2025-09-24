// Force directed layout calculations

import type { Person, PolyculeManifest, System } from "./types";
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

    type Datum = SimulationNodeDatum & { person?: Person; system?: System; };
    const sim = forceSimulation<Datum>()
        .nodes([
            ...root.people.map(person => ({ person })),
            ...root.systems.map(system => ({ system })),
        ])
        .force("charge", forceManyBody<Datum>().strength(d => d.system ? 0 : -2000))
        .force("link", forceLink<Datum, SimulationLinkDatum<Datum>>(
            root.relationships.map(r => ({
                source: r.from.type === "person" ? "P/"+r.from.id : "S/"+r.from.id,
                target: r.to.type === "person" ? "P/"+r.to.id : "S/"+r.to.id,
                strength: 0.1,
            }))
        )
        .id(d => d.person ? ("P/"+d.person.id) : (d.system ? ("S/"+d.system.id) : "")))
        .stop();

    sim.tick();

    sim.nodes().forEach(n => {
        if(n.person) result.people[n.person.id] = vec2(n);
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

