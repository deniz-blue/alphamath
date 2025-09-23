// Force directed layout calculations

import type { PolyculeManifest } from "./types";
import { type Vec2, vec2, vec2sub, vec2mul, vec2add } from "@alan404/vec2";

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

    throw new Error("TS wrong return type error prevention society");
};

