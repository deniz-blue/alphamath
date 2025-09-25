import { Affix, Box, Button, Stack } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { PolyculeGraphView } from "../view/PolyculeGraphView";
import { openAppModal } from "../../modals";
import { usePolyculeStore } from "../../contexts/usePolyculeStore";

export const MainLayout = () => {
    const { undo, redo } = usePolyculeStore.temporal.getState();

    useHotkeys([
        ["mod+z", () => undo()],
        ["mod+shift+z", () => redo()],
        ["mod+y", () => redo()],
    ]);

    return (
        <Box pos="relative">
            <PolyculeGraphView />

            <Affix position={{ left: 20, top: 20 }}>
                <Stack>
                    <Button
                        variant="light"
                        onClick={() => openAppModal("PersonListModal", {})}
                    >
                        List People
                    </Button>
                    <Button
                        variant="light"
                        onClick={() => openAppModal("SystemListModal", {})}
                    >
                        List Systems
                    </Button>
                    <Button
                        variant="light"
                        onClick={() => undo()}
                    >
                        UNDO
                    </Button>
                    <Button
                        variant="light"
                        onClick={() => redo()}
                    >
                        REDO
                    </Button>
                </Stack>
            </Affix>
        </Box>
    )
};
