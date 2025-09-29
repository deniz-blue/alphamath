import { useState } from "react";
import type { Person } from "../../../lib/types";
import { OPTIONS } from "../options";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { Menu } from "@mantine/core";
import { GraphPersonActions } from "./GraphPersonActions";
import { useRelativeDrag } from "@alan404/react-workspace";
import { vec2, type Vec2 } from "@alan404/vec2";

export const GraphPerson = ({
    person,
    onDrag,
}: {
    person: Person;
    onDrag?: (newPosition: Vec2, delta: Vec2) => void;
}) => {
    const [opened, setOpened] = useState(false);
    const getSystem = usePolyculeStore(store => store.getSystem);

    const {
        props: dragProps,
    } = useRelativeDrag({
        onDrag: onDrag || (() => { }),
        position: vec2(),
    });

    return (
        <g
            data-type="person"
            data-id={person.id}
            key={person.id}
            style={{ cursor: "pointer" }}
            onPointerDown={e => e.stopPropagation()}
        // {...dragProps}
        >
            <Menu
                withArrow
                hideDetached={false}
                offset={0}
                shadow="md"
                arrowSize={12}
                opened={opened}
                onChange={setOpened}
            >
                <g>
                    <Menu.Target>
                        <circle
                            stroke={person.color ?? OPTIONS.personDefaultColor}
                            strokeWidth={1}
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
