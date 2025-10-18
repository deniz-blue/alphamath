import { useCallback, useEffect, useRef, useState } from "react";
import { OPTIONS } from "./options";
import { compute, type ComputeResult } from "../../lib/force";
import { Workspace } from "@alan404/react-workspace";
import { vec2add } from "@alan404/vec2";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { GraphRelationship } from "./svg/GraphRelationship";
import { GraphPerson } from "./svg/GraphPerson";
import { GraphSystem } from "./svg/GraphSystem";
import { updateSVG } from "./update-svg";

export const PolyculeGraphView = () => {
    const root = usePolyculeStore(store => store.root);
    const ref = useRef<SVGSVGElement>(null);
    const coordsRef = useRef<ComputeResult>(null);
    const nodesBeingDraggedRef = useRef<Set<string>>(new Set());

    const updateCoordinates = useCallback(() => {
        coordsRef.current = compute(usePolyculeStore.getState().root, coordsRef.current ?? undefined, {
            isDragging: !!nodesBeingDraggedRef.current.size,
        });
    }, [compute]);

    const renderCoords = useCallback(() => {
        const svg = ref.current;
        if (!coordsRef.current || !svg) return;
        updateSVG(svg, coordsRef.current);
    }, []);

    useEffect(() => {
        let f: number;
        const loop = () => {
            f = requestAnimationFrame(loop);
            updateCoordinates();
            renderCoords();
        };
        f = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(f);
    }, [renderCoords, updateCoordinates]);

    return (
        <Workspace
            viewProps={{ ref }}
        >
            <defs>
                <clipPath id="avatarClip">
                    <circle
                        r={OPTIONS.personRadius}
                    />
                </clipPath>
            </defs>

            {root.systems.map(system => (
                <GraphSystem
                    key={system.id}
                    system={system}
                />
            ))}

            {root.relationships.map(rel => (
                <GraphRelationship
                    key={rel.id}
                    relationship={rel}
                />
            ))}

            {root.people.map(person => (
                <GraphPerson
                    key={person.id}
                    person={person}
                    onDrag={(delta) => {
                        if (coordsRef.current)
                            coordsRef.current.people[person.id] = vec2add(
                                coordsRef.current.people[person.id],
                                delta,
                            );
                    }}
                    onDragState={(dragging) => {
                        if (dragging) {
                            nodesBeingDraggedRef.current.add(person.id);
                        } else {
                            nodesBeingDraggedRef.current.delete(person.id);
                        }
                    }}
                />
            ))}
        </Workspace>
    );
};

