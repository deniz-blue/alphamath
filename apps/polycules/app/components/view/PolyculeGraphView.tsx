import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { OPTIONS } from "./options";
import { compute, type ComputeResult } from "../../lib/force";
import { Workspace } from "@alan404/react-workspace";
import type { GraphNodeRef, Person, PolyculeManifest } from "../../lib/types";
import { modals } from "@mantine/modals";
import { vec2 } from "@alan404/vec2";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { Menu, Popover, Stack } from "@mantine/core";
import { openAppModal } from "../../modals";
import { IconPencil } from "@tabler/icons-react";

export const PolyculeGraphView = () => {
    const root = usePolyculeStore(store => store.root);
    const ref = useRef<SVGSVGElement>(null);
    const graphRef = useRef<PolyculeManifest>(null);
    const coordsRef = useRef<ComputeResult>(null);

    useLayoutEffect(() => {
        graphRef.current = root;
    }, [root]);

    const updateCoordinates = useCallback(() => {
        if (!graphRef.current) return;
        coordsRef.current = compute(graphRef.current, coordsRef.current ?? undefined);
    }, [compute]);

    const renderCoords = useCallback(() => {
        if (!coordsRef.current) return;
        const svg = ref.current;
        if (!svg) return;

        const people = svg.querySelectorAll<SVGGElement>("g[data-type='person']");
        people.forEach(personEl => {
            const id = personEl.dataset.id;
            if (!id) return console.log("No id on person element", personEl);
            const person = graphRef.current?.people.find(p => p.id === id);
            if (!person) return console.log("No person for id", id);
            const coords = coordsRef.current?.people[person.id];
            if (!coords) return console.log("No coords for person", person);
            personEl.setAttribute("transform", `translate(${coords.x}, ${coords.y})`);
        });

        const relationships = svg.querySelectorAll<SVGLineElement>("line[data-type='relationship']");
        relationships.forEach(relEl => {
            const id = relEl.dataset.id;
            if (!id) return console.log("No id on relationship element", relEl);
            const rel = graphRef.current?.relationships.find(r => r.id === id);
            if (!rel) return console.log("No relationship for id", id);

            const getRefCoord = (n: GraphNodeRef) =>
                (n.type === "person" ? coordsRef.current?.people[n.id] : coordsRef.current?.systems[n.id]) ?? vec2();

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
        }, 100); // TODO: debug interval
        return () => clearInterval(i);
    }, [renderCoords, updateCoordinates]);

    return (
        <div
            style={{ width: "100vw", height: "100vh" }}
        >
            <Workspace
                ref={ref}
            >
                <defs>
                    <clipPath id="avatarClip">
                        <circle
                            r={OPTIONS.personRadius}
                        />
                    </clipPath>
                </defs>

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
                    <GraphPerson
                        key={person.id}
                        person={person}
                    />
                ))}
            </Workspace>
        </div >
    );
};

export const GraphLink = ({
    // link,
}: {
        // link: Relationship;
    }) => {
    return null;
};

export const GraphPerson = ({
    person,
}: {
    person: Person;
}) => {
    const getSystem = usePolyculeStore(store => store.getSystem);

    const openEditModal = useCallback(() => {
        openAppModal("PersonEditorModal", { id: person.id });
    }, [person.id]);

    const openSystemEditModal = useCallback(() => {
        if (!person.systemId) return;
        openAppModal("SystemEditorModal", { id: person.systemId });
    }, [person.systemId]);

    const openRelationships = useCallback(() => {
        openAppModal("LinksListModal", { target: { type: "person", id: person.id } });
    }, [person.id]);

    return (
        <g
            data-type="person"
            data-id={person.id}
            key={person.id}
            style={{ cursor: "pointer" }}
        >
            <Menu
                withArrow
                hideDetached={false}
                offset={0}
                shadow="md"
                arrowSize={12}
            >
                <Menu.Target>
                    <g>
                        <circle
                            fill={person.color ?? OPTIONS.personDefaultColor}
                            r={OPTIONS.personRadius}
                        />

                        {person.avatarUrl && (
                            <image
                                href={person.avatarUrl}
                                x={-OPTIONS.personRadius}
                                y={-OPTIONS.personRadius}
                                width={OPTIONS.personRadius * 2}
                                height={OPTIONS.personRadius * 2}
                                clip-path="url(#avatarClip)"
                                preserveAspectRatio="xMidYMid slice"
                            />
                        )}
                    </g>
                </Menu.Target>
                <Menu.Dropdown
                    fz="sm"
                >
                    <Menu.Label>
                        {person.name || "(No name)"}
                    </Menu.Label>
                    <Menu.Item
                        onClick={openEditModal}
                        leftSection={<IconPencil size={14} />}
                    >
                        Edit
                    </Menu.Item>
                    {person.systemId && (
                        <Menu.Item
                            onClick={openSystemEditModal}
                            leftSection={<IconPencil size={14} />}
                        >
                            Edit System
                        </Menu.Item>
                    )}
                    <Menu.Item
                        onClick={openRelationships}
                        leftSection={<IconPencil size={14} />}
                    >
                        Edit Relationships
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            <text
                textAnchor="middle"
                y={OPTIONS.personRadius + OPTIONS.personNamePadding}
                fontSize={OPTIONS.personNameFontSize}
                fill={OPTIONS.personNameColor}
                pointerEvents="none"
            >
                {person.name || "(No name)"}
            </text>

            {person.systemId && (
                <text
                    textAnchor="middle"
                    y={OPTIONS.personRadius + OPTIONS.personNamePadding + OPTIONS.personNameFontSize + OPTIONS.systemNamePaddingTop}
                    fontSize={OPTIONS.systemNameFontSize}
                    fill={OPTIONS.systemNameColor}
                    pointerEvents="none"
                >
                    {getSystem(person.systemId)?.name || "(No system name)"}
                </text>
            )}
        </g>
    );
};
