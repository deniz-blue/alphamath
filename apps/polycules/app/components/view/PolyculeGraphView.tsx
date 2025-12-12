import { useCallback, useEffect, useRef, useState } from "react";
import { OPTIONS } from "./options";
import { compute, type ComputeResult } from "../../lib/force";
import { Workspace } from "@alan404/react-workspace";
import { vec2, vec2add, vec2distance } from "@alan404/vec2";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { GraphRelationship } from "./svg/GraphRelationship";
import { GraphPerson } from "./svg/GraphPerson";
import { GraphSystem } from "./svg/GraphSystem";
import { updateSVG } from "./update-svg";
import { Information } from "./Information";
import { useGraphUIStore } from "./useGraphUIStore";

export const PolyculeGraphView = () => {
    const root = usePolyculeStore(store => store.root);
    const ref = useRef<SVGSVGElement>(null);
    const coordsRef = useRef<ComputeResult>(null);

    const mode = useGraphUIStore(store => store.mode);
    const activeNodeIdsRef = useRef<Set<string>>(new Set());
    const newLinkCoord = useRef(vec2());
    const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);

    const updateCoordinates = useCallback(() => {
        if (mode == "link" && !!activeNodeIdsRef.current.size) return;

        coordsRef.current = compute(usePolyculeStore.getState().root, coordsRef.current ?? undefined, {
            isDragging: !!activeNodeIdsRef.current.size,
        });
    }, [compute]);

    const renderCoords = useCallback(() => {
        const svg = ref.current;
        if (!coordsRef.current || !svg) return;
        updateSVG(svg, coordsRef.current);
    }, []);

    const renderNewlink = useCallback(() => {
        const svg = ref.current;
        if (!coordsRef.current || !svg) return;
        let newlink = svg.querySelector("line[data-type='newlink']")!;
        if (mode == "link" && !!activeNodeIdsRef.current.size) {
            let fromId = activeNodeIdsRef.current.values().next().value!;
            let from = coordsRef.current.people[fromId];
            let to = newLinkCoord.current;
            newlink.setAttribute("x1", from.x.toString());
            newlink.setAttribute("y1", from.y.toString());
            newlink.setAttribute("x2", to.x.toString());
            newlink.setAttribute("y2", to.y.toString());
            newlink.setAttribute("opacity", "1");
        } else {
            newlink.setAttribute("opacity", "0");
        }
    }, []);

    const getLinkTargetId = useCallback(() => {
        if (!coordsRef.current) return null;
        const maxDist = 1.2 * OPTIONS.personRadius;
        const candidates = Object.entries(coordsRef.current.people)
            .map(([id, v]) => ({
                id,
                dist: vec2distance(newLinkCoord.current, v),
            }))
            .filter(x => x.dist < maxDist)
        return candidates[0]?.id ?? null;
    }, [])

    const newlinkLogic = useCallback(() => {
        if (mode != "link" || !activeNodeIdsRef.current.size) return;
        if (!coordsRef.current) return;
        setConnectingNodeId(getLinkTargetId());
    }, []);

    useEffect(() => {
        let f: number;
        const loop = () => {
            f = requestAnimationFrame(loop);
            updateCoordinates();
            renderCoords();
            renderNewlink();
            newlinkLogic();
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

            {root.people.length === 0 && (
                <Information />
            )}

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
                    highlight={connectingNodeId == person.id}
                    onDrag={(delta) => {
                        if (mode == "link") {
                            newLinkCoord.current = vec2add(
                                newLinkCoord.current,
                                delta,
                            )
                        } else {
                            if (coordsRef.current)
                                coordsRef.current.people[person.id] = vec2add(
                                    coordsRef.current.people[person.id],
                                    delta,
                                );
                        }
                    }}
                    onDragState={(dragging) => {
                        if (dragging) {
                            activeNodeIdsRef.current.add(person.id);
                            if (coordsRef.current)
                                newLinkCoord.current = coordsRef.current.people[person.id];
                        } else {
                            let targetId = getLinkTargetId();
                            if(targetId) {
                                const fromId = person.id; // or compute from activeNodeIdsRef?
                                usePolyculeStore.getState().addRelationship({
                                    from: { type: "person", id: fromId },
                                    to: { type: "person", id: targetId },
                                })
                            }

                            activeNodeIdsRef.current.delete(person.id);
                            newLinkCoord.current = vec2();
                            setConnectingNodeId(null);
                        }
                    }}
                />
            ))}

            <line
                data-type="newlink"
                stroke={OPTIONS.linkDefaultColor}
                strokeWidth={OPTIONS.linkDefaultWidth}
                strokeLinecap="round"
            />
        </Workspace>
    );
};

