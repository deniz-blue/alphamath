import { useGlobalTransformStore, useMousePosition } from "@alan404/react-workspace";
import type { Vec2 } from "@alan404/vec2";
import { Stack, Text } from "@mantine/core";

export const InfoCornerOverlay = () => {
    const mouse = useMousePosition();
    const global = useGlobalTransformStore(store => store.position);

    const vec2string = (v: Vec2) =>
        `(${[v.x, v.y].map(Math.round).join(", ")})`;

    return (
        <Stack gap={0} fz="xs" c="dimmed">
            {[
                `Mouse: ${vec2string(mouse)}`,
                `Workspace: ${vec2string(global)}`,
                `alphamath dev`,
            ].map((line, i) => (
                <Text span inherit key={i}>
                    {line}
                </Text>
            ))}
        </Stack>
    )
};
