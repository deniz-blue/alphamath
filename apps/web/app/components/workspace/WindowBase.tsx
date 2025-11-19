import { useElementEvent } from "@alan404/react-workspace";
import { useRelativeDrag } from "@alan404/react-workspace/gestures";
import { vec2, vec2add, vec2max, type Vec2 } from "@alan404/vec2";
import { ActionIcon, Group, Paper, Stack, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useRef, useState, type PropsWithChildren } from "react";

export interface WindowBaseProps extends PropsWithChildren {
    position: Vec2;
    size: Vec2;
    title?: React.ReactNode;
    onResize?: (s: Vec2) => void;
    onMove?: (p: Vec2) => void;
};

export const WindowBase = ({
    children,
    position,
    size,
    title,
    onMove,
    onResize,
}: WindowBaseProps) => {
    const ref = useRef<HTMLDivElement>(null);
    useElementEvent(ref, "pointerdown", e => e.stopPropagation());
    useElementEvent(ref, "touchstart", e => e.stopPropagation());

    const titlebarRef = useRef<HTMLDivElement>(null);
    useRelativeDrag(titlebarRef, {
        onDrag(delta) {
            onMove?.(vec2add(position, delta));
        },
    });

    const rightBottomCornerRef = useRef<HTMLDivElement>(null);
    useRelativeDrag(rightBottomCornerRef, {
        onDrag(delta) {
            onResize?.(vec2max(vec2add(size, delta), 200));
        },
    });

    return (
        <foreignObject
            x={position.x}
            y={position.y}
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
                    style={{ borderWidth: "2px" }}
                    w="100%"
                    h="100%"
                >
                    <Stack gap={0} h="100%">
                        <Paper
                            ref={titlebarRef}
                            bg="dark"
                        >
                            <Group justify="space-between" px={4}>
                                <Group>
                                    <Text ff="monospace" fz="sm" style={{ userSelect: "none" }}>
                                        {title}
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
