import { useRef, useState } from "react";
import type { Person } from "../../../lib/types";
import { OPTIONS } from "../options";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { Menu } from "@mantine/core";
import { GraphPersonActions } from "./GraphPersonActions";
import { useRelativeDrag } from "@alan404/react-workspace/gestures";
import { vec2, type Vec2 } from "@alan404/vec2";

export const GraphPerson = ({
    person,
    onDrag,
    onDragState,
}: {
    person: Person;
    onDrag?: (delta: Vec2) => void;
    onDragState?: (dragging: boolean) => void;
}) => {
    const ref = useRef<SVGGElement>(null);
    const [opened, setOpened] = useState(false);
    const getSystem = usePolyculeStore(store => store.getSystem);

    useRelativeDrag(ref, {
        onDrag: onDrag || (() => { }),
        onDragStart: () => onDragState?.(true),
        onDragEnd: () => onDragState?.(false),
        onClick: () => setOpened(o=>!o),
    });

    return (
        <g
            data-type="person"
            data-id={person.id}
            key={person.id}
            style={{ cursor: "pointer" }}
            onPointerDown={e => e.stopPropagation()}
            ref={ref}
        >
            <Menu
                withArrow
                hideDetached={false}
                offset={0}
                shadow="md"
                arrowSize={12}
                opened={opened}
                onChange={setOpened}
                closeOnClickOutside
                withOverlay
                overlayProps={{
                    opacity: 0,
                }}
            >
                <g>
                    <Menu.Target>
                        <circle
                            fill={person.color ?? OPTIONS.personDefaultColor}
                            r={OPTIONS.personRadius}
                        />
                    </Menu.Target>

                    {person.avatarUrl && (
                        <image
                            href={person.avatarUrl}
                            x={-OPTIONS.personRadius}
                            y={-OPTIONS.personRadius}
                            width={OPTIONS.personRadius * 2}
                            height={OPTIONS.personRadius * 2}
                            clipPath="url(#avatarClip)"
                            preserveAspectRatio="xMidYMid slice"
                            pointerEvents="none"
                        />
                    )}
                </g>

                <Menu.Dropdown
                    fz="sm"
                >
                    <GraphPersonActions person={person} onClose={() => setOpened(false)} />
                </Menu.Dropdown>
            </Menu>

            <text
                textAnchor="middle"
                y={OPTIONS.personRadius + OPTIONS.personNamePadding + OPTIONS.personNameFontSize}
                fontSize={OPTIONS.personNameFontSize}
                fill={OPTIONS.personNameColor}
                pointerEvents="none"
            >
                {person.name || "(No name)"}
            </text>

            {person.systemId && (
                <text
                    textAnchor="middle"
                    y={OPTIONS.personRadius + OPTIONS.personNamePadding + OPTIONS.personNameFontSize + OPTIONS.systemNamePaddingTop + OPTIONS.systemNameFontSize}
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
