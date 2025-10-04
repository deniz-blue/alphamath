import { ActionIcon, Affix, Box, Button, Group, Stack, Text, Tooltip } from "@mantine/core";
import { useClipboard, useFullscreen, useHotkeys } from "@mantine/hooks";
import { PolyculeGraphView } from "../view/PolyculeGraphView";
import { openAppModal } from "../../modals";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { DEFAULT_PERSON } from "../../store/data";
import { IconArrowBackUp, IconArrowForwardUp, IconCheck, IconCircles, IconCopy, IconMaximize, IconMinimize, IconShare, IconUser } from "@tabler/icons-react";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { encodeGraph } from "../../lib/serde";
import { useGlobalTransform, useMousePosition } from "@alan404/react-workspace";
import { DotMenu } from "./overlays/DotMenu";

export const MainLayout = () => {
    const { toggle: toggleFullscreen, fullscreen } = useFullscreen();

    return (
        <Box pos="relative">
            <PolyculeGraphView />
            <Keybinds />

            <Affix position={{ left: 20, top: 20 }}>
                <Stack>

                </Stack>
            </Affix>

            <Affix position={{ left: 20, bottom: 20 }}>
                <WorkspaceInfo />
            </Affix>

            <Affix position={{ right: 20, bottom: 20 }}>
                <Group gap="xs">
                    <Button
                        variant="light"
                        onClick={() => openAppModal("PersonListModal", {})}
                        size="compact-md"
                        leftSection={<IconUser />}
                    >
                        People
                    </Button>
                    <Button
                        variant="light"
                        onClick={() => openAppModal("SystemListModal", {})}
                        size="compact-md"
                        leftSection={<IconCircles />}
                    >
                        Systems
                    </Button>


                    <DotMenu />

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

export const WorkspaceInfo = () => {
    const { x, y } = useMousePosition();
    const { reset, position, scale } = useGlobalTransform();

    useHotkeys([
        ["v", reset],
    ]);

    return (
        <Stack gap={0}>
            <Text ff="monospace" c="dimmed" fz="sm" inline span>
                Mouse: ({Math.round(x)}, {Math.round(y)})
            </Text>
            <Text ff="monospace" c="dimmed" fz="sm" inline span>
                Workspace: ({Math.round(position.x)}, {Math.round(position.y)}) {scale}x
            </Text>
        </Stack>
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
