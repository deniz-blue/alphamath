import { useCallback, useEffect, useRef } from "react";
import { OPTIONS } from "./options";
import { compute, type ComputeResult } from "../../lib/force";
import { Workspace } from "@alan404/react-workspace";
import type { NodeRef } from "../../lib/types";
import { modals } from "@mantine/modals";
import { vec2 } from "@alan404/vec2";
import { usePolyculeStore } from "../../contexts/usePolyculeStore";

export const PolyculeGraphView = () => {
    const root = usePolyculeStore(store => store.root);
    const getSystem = usePolyculeStore(store => store.getSystem);
    const ref = useRef<SVGSVGElement>(null);
    const computed = useRef<ComputeResult>(null);

    const updateCoordinates = useCallback(() => {
        computed.current = compute(root, computed.current ?? undefined);
    }, [root]);

    const renderCoords = useCallback(() => {
        if (!computed.current) return;
        const svg = ref.current;
        if (!svg) return;

        const people = svg.querySelectorAll<SVGGElement>("g[data-type='person']");
        people.forEach(personEl => {
            const id = personEl.dataset.id;
            if (!id) return;
            const person = root.people.find(p => p.id === id);
            if (!person) return;
            const coords = computed.current?.people[person.id];
            if (!coords) return;
            personEl.setAttribute("transform", `translate(${coords.x}, ${coords.y})`);
        });

        const relationships = svg.querySelectorAll<SVGLineElement>("line[data-type='relationship']");
        relationships.forEach(relEl => {
            const id = relEl.dataset.id;
            if (!id) return;
            const rel = root.relationships.find(r => r.id === id);
            if (!rel) return;

            const getRefCoord = (n: NodeRef) =>
                (n.type === "person" ? computed.current?.people[n.id] : computed.current?.systems[n.id]) ?? vec2();

            const from = getRefCoord(rel.from);
            const to = getRefCoord(rel.to);
            
            relEl.setAttribute("x1", from.x.toString());
            relEl.setAttribute("y1", from.y.toString());
            relEl.setAttribute("x2", to.x.toString());
            relEl.setAttribute("y2", to.y.toString());
        });
    }, []);

    useEffect(() => {
        let i = setInterval(() => {
            updateCoordinates();
            renderCoords();
        }, 500); // TODO: debug interval
        return () => clearInterval(i);
    }, [updateCoordinates, renderCoords]);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Workspace
                ref={ref}
            >
                {root.relationships.map(rel => (
                    <line
                        key={rel.id}
                        data-id={rel.id}
                        data-type="relationship"
                        stroke={OPTIONS.linkDefaultColor}
                        strokeWidth={OPTIONS.linkDefaultWidth}
                    />
                ))}

                {root.people.map(person => (
                    <g
                        data-type="person"
                        data-id={person.id}
                        key={person.id}
                        onClick={() => modals.openContextModal({
                            modal: "PersonEditorModal",
                            title: `Edit ${person.name}`,
                            innerProps: {
                                id: person.id,
                            },
                        })}
                    >
                        <circle
                            fill={person.color ?? OPTIONS.personDefaultColor}
                            r={OPTIONS.personRadius}
                        />
                        <text
                            textAnchor="middle"
                            y={OPTIONS.personRadius + OPTIONS.personNamePadding}
                            fontSize={OPTIONS.personNameFontSize}
                            fill={OPTIONS.personNameColor}
                            pointerEvents="none"
                        >
                            {person.name}
                        </text>
                        {person.systemId && (
                            <text
                                textAnchor="middle"
                                y={OPTIONS.personRadius + OPTIONS.personNamePadding + OPTIONS.personNameFontSize + OPTIONS.systemNamePaddingTop}
                                fontSize={OPTIONS.systemNameFontSize}
                                fill={OPTIONS.systemNameColor}
                                pointerEvents="none"
                            >
                                {getSystem(person.systemId)?.name}
                            </text>
                        )}
                    </g>
                ))}
            </Workspace>
        </div>
    );
};
