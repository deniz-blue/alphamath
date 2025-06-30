import { Box, Text } from "@mantine/core"
import { PositionOverlay } from "./components/PositionOverlay"
import { ToolOverlay } from "./components/ToolOverlay"
import { CommandBarOverlay } from "./commandbar/CommandBar"


export const MainOverlay = () => {
    return (
        <Box style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none" }}>
            <ToolOverlay />
            <PositionOverlay />

            <CommandBarOverlay />

            <Text style={{ position: "fixed", bottom: 0, left: 0 }}>
                alphamath 0.1
            </Text>
        </Box>
    )
}
