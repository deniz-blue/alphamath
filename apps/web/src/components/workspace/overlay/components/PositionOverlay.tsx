import { Box, Button, Group, Text } from "@mantine/core";
import { useGlobalTransformStore, useMousePosition } from "@alan404/react-workspace";

export const PositionOverlay = () => {
    const { position, scale, reset } = useGlobalTransformStore();
    const mouse = useMousePosition();

    return (
        <Box w="100%" style={{ position: "fixed", bottom: 0 }}>
            <Group justify="center" pb="xs">
                <Text c="dimmed" ta="center" fz="sm">
                    Workspace: ({position.x}, {position.y}) {scale.toString().slice(0, 3)}x
                    <br />
                    Mouse: ({Math.round(mouse.x)}, {Math.round(mouse.y)})
                </Text>
            </Group>
        </Box>
    )
}
