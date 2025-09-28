import { ActionIcon, Affix, Box, Button, Group, Stack, Tooltip } from "@mantine/core";
import { useClipboard, useFullscreen, useHotkeys } from "@mantine/hooks";
import { PolyculeGraphView } from "../view/PolyculeGraphView";
import { openAppModal } from "../../modals";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { DEFAULT_PERSON } from "../../store/data";
import { IconArrowBackUp, IconArrowForwardUp, IconCheck, IconMaximize, IconMinimize, IconShare } from "@tabler/icons-react";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { encodeGraph } from "../../lib/serde";

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
                    <CopyLinkButton />

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

export const CopyLinkButton = () => {
    const { copied, copy, error, reset } = useClipboard();

    useEffect(() => {
        if(!error) return;
        notifications.show({
            title: "Error",
            message: ""+error,
            color: "red",
        });
    }, [error]);

    return (
        <Tooltip label={copied ? "Copied!" : "Copy share link"}>
            <ActionIcon
                onClick={() => copy(
                    `${window.location.origin}${window.location.pathname}#${encodeGraph(usePolyculeStore.getState().root)}`
                )}
                color={copied ? "teal" : "gray"}
                variant="light"
            >
                {copied ? <IconCheck /> : <IconShare />}
            </ActionIcon>
        </Tooltip>
    )
};
