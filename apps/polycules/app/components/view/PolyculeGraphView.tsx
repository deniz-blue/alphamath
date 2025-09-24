import { useCallback, useEffect, useRef } from "react";
import { usePolycule } from "../../contexts/PolyculeContext";
import { OPTIONS } from "./options";
import { Coordinates, Mafs } from "mafs";
import { useViewportSize } from "@mantine/hooks";
import { compute, type ComputeResult } from "../../lib/force";
import { Workspace } from "@alan404/react-workspace";
import type { Person } from "../../lib/types";
import { modals } from "@mantine/modals";

export const PolyculeGraphView = () => {
    const { root } = usePolycule();
    const ref = useRef<SVGSVGElement>(null);
    const computed = useRef<ComputeResult>(null);

    const updateCoordinates = useCallback(() => {
        computed.current = compute(root, computed.current ?? undefined);
    }, [root]);

    const renderCoords = useCallback(() => {
        console.log("rendering coords", computed.current, ref.current);

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
                {root.people.map(person => (
                    <g
                        data-type="person"
                        data-id={person.id}
                        key={person.id}
                        onClick={() => modals.openContextModal({
                            modal: "PersonEditModal",
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
                    </g>
                ))}
            </Workspace>
        </div>
    );
};
