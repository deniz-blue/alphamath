import { useElementEvent, Workspace } from "@alan404/react-workspace";
import { Calculator } from "../windows/calculator/Calculator";
import { useRef } from "react";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { vec2, vec2add, vec2max } from "@alan404/vec2";
import { ActionIcon, Group, Paper, Stack, Text } from "@mantine/core";
import { useRelativeDrag } from "@alan404/react-workspace/gestures";
import { IconX } from "@tabler/icons-react";

export default function MainLayout() {
    return (
        <Workspace>
            <WindowBase>
                <Calculator />
            </WindowBase>
        </Workspace>
    )
}

export const WindowBase = ({ children }: PropsWithChildren) => {
    const [size, setSize] = useState(vec2(300, 500));
    const [pos, setPos] = useState(vec2(0, 0));

    const ref = useRef<HTMLDivElement>(null);
    useElementEvent(ref, "pointerdown", e => e.stopPropagation());
    useElementEvent(ref, "touchstart", e => e.stopPropagation());

    const titlebarRef = useRef<HTMLDivElement>(null);
    useRelativeDrag(titlebarRef, {
        onDrag(delta) {
            setPos(old => vec2add(old, delta));
        },
    });

    const rightBottomCornerRef = useRef<HTMLDivElement>(null);
    useRelativeDrag(rightBottomCornerRef, {
        onDrag(delta) {
            setSize(old => vec2max(vec2add(old, delta), 200));
        },
    });

    return (
        <foreignObject
            x={pos.x}
            y={pos.y}
            width={size.x}
            height={size.y}
        >
            <div
                ref={ref}
                style={{
                    pointerEvents: "auto",
                    userSelect: "text",
                    height: "100%",
                }}
            >
                <Paper
                    withBorder
                    w="100%"
                    h="100%"
                >
                    <Stack gap={0}>
                        <Paper
                            ref={titlebarRef}
                            bg="dark"
                        >
                            <Group justify="space-between" px={4}>
                                <Group>
                                    <Text ff="monospace" fz="sm" style={{ userSelect: "none" }}>
                                        Window Name
                                    </Text>
                                </Group>
                                <Group>
                                    <ActionIcon
                                        variant="light"
                                        color="gray"
                                        size="xs"
                                    >
                                        <IconX />
                                    </ActionIcon>
                                </Group>
                            </Group>
                        </Paper>

                        {children}
                    </Stack>
                </Paper>

                <div
                    ref={rightBottomCornerRef}
                    style={{
                        position: "absolute",
                        right: "0",
                        bottom: "0",
                        width: "1rem",
                        height: "1rem",
                        cursor: "nwse-resize",
                    }}
                />
            </div>
        </foreignObject>
    )
};
