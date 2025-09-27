import { ActionIcon, Affix, Box, Button, Group, Stack } from "@mantine/core";
import { useFullscreen, useHotkeys } from "@mantine/hooks";
import { PolyculeGraphView } from "../view/PolyculeGraphView";
import { openAppModal } from "../../modals";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { DEFAULT_PERSON } from "../../store/data";
import { IconArrowBackUp, IconArrowForwardUp, IconMaximize, IconMinimize } from "@tabler/icons-react";

export const MainLayout = () => {
    const { toggle: toggleFullscreen, fullscreen } = useFullscreen();

    return (
        <Box pos="relative">
            <PolyculeGraphView />
            <Keybinds />

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
                </Stack>
            </Affix>

            <Affix position={{ right: 20, bottom: 20 }}>
                <Group>
                    <UndoRedo />

                    <ActionIcon
                        variant="light"
                        color="gray"
                        onClick={toggleFullscreen}
                    >
                        {fullscreen ? <IconMinimize /> : <IconMaximize />}
                    </ActionIcon>
                </Group>
            </Affix>
        </Box>
    )
};

export const Keybinds = () => {
    const addPerson = usePolyculeStore(store => store.addPerson);
    const { undo, redo } = usePolyculeStore.temporal.getState();

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

    return null;
};

export const UndoRedo = () => {
    usePolyculeStore();
    const { undo, redo, futureStates, pastStates } = usePolyculeStore.temporal.getState();

    return (
        <ActionIcon.Group>
            <ActionIcon
                disabled={!pastStates.length}
                onClick={() => undo()}
                variant="light"
                color="gray"
            >
                <IconArrowBackUp />
            </ActionIcon>
            <ActionIcon
                disabled={!futureStates.length}
                onClick={() => redo()}
                variant="light"
                color="gray"
            >
                <IconArrowForwardUp />
            </ActionIcon>
        </ActionIcon.Group>
    );
};
