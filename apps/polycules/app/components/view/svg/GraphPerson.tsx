import { useState } from "react";
import type { Person } from "../../../lib/types";
import { OPTIONS } from "../options";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { Menu } from "@mantine/core";
import { GraphPersonActions } from "./GraphPersonActions";

export const GraphPerson = ({
    person,
}: {
    person: Person;
}) => {
    const [opened, setOpened] = useState(false);
    const getSystem = usePolyculeStore(store => store.getSystem);

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
                opened={opened}
                onChange={setOpened}
            >
                <Menu.Target>
                    <g>
                        <circle
                            stroke={person.color ?? OPTIONS.personDefaultColor}
                            strokeWidth={1}
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
                                clipPath="url(#avatarClip)"
                                preserveAspectRatio="xMidYMid slice"
                            />
                        )}
                    </g>
                </Menu.Target>
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
