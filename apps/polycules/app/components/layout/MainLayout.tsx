import { ActionIcon, Affix, Box, Button, Stack } from "@mantine/core";
import { useFullscreen, useHotkeys } from "@mantine/hooks";
import { PolyculeGraphView } from "../view/PolyculeGraphView";
import { openAppModal } from "../../modals";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { DEFAULT_PERSON } from "../../store/data";
import { IconMaximize, IconMinimize } from "@tabler/icons-react";

export const MainLayout = () => {
    const addPerson = usePolyculeStore(store => store.addPerson);
    const { undo, redo } = usePolyculeStore.temporal.getState();

    const { toggle: toggleFullscreen, fullscreen } = useFullscreen();

    useHotkeys([
        ["mod+z", () => undo()],
        ["mod+shift+z", () => redo()],
        ["mod+y", () => redo()],
        ["1", () => openAppModal("PersonListModal", {})],
        ["2", () => openAppModal("SystemListModal", {})],
        ["n", () => {
            const id = addPerson(DEFAULT_PERSON);
            openAppModal("PersonEditorModal", { id });
        }],
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

            <Affix position={{ right: 20, bottom: 20 }}>
                <ActionIcon
                    variant="light"
                    color="gray"
                    onClick={toggleFullscreen}
                >
                    {fullscreen ? <IconMinimize /> : <IconMaximize />}
                </ActionIcon>
            </Affix>
        </Box>
    )
};
