import { ActionIcon, Affix, Box, Button, Group, SegmentedControl, Stack, Text, Tooltip } from "@mantine/core";
import { useClipboard, useFullscreen, useHotkeys, useMouse } from "@mantine/hooks";
import { PolyculeGraphView } from "../view/PolyculeGraphView";
import { openAppModal } from "../../modals";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { DEFAULT_PERSON } from "../../store/data";
import { IconArrowBackUp, IconArrowForwardUp, IconCheck, IconCircles, IconCopy, IconMaximize, IconMinimize, IconShare, IconUser } from "@tabler/icons-react";
import { useGlobalTransformStore, useMousePosition } from "@alan404/react-workspace";
import { DotMenu } from "./overlays/DotMenu";
import { vec2 } from "@alan404/vec2";
import { useGraphUIStore } from "../view/useGraphUIStore";

export const MainLayout = () => {
    const { toggle: toggleFullscreen, fullscreen } = useFullscreen();
    const mode = useGraphUIStore(store => store.mode);

    return (
        <Box pos="relative">
            <PolyculeGraphView />
            <Keybinds />

            <Box className="viewport-safe-area small-viewport" style={{ position: "fixed", top:0,left:0, pointerEvents: "none" }}>
                <Affix withinPortal={false} style={{ left: 20, bottom: 20, userSelect: "none" }}>
                    <WorkspaceInfo />
                </Affix>
            </Box>

            <Affix position={{ right: 20, bottom: 20 }}>
                <Group gap="xs">
                    <SegmentedControl
                        data={[
                            { value: "drag", label: "Drag" },
                            { value: "link", label: "Link" },
                        ]}
                        value={mode}
                        onChange={(v) => useGraphUIStore.getState().setMode(v as any)}
                    />

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
    const { position, scale, fromScreenPosition } = useGlobalTransformStore();
    const client = useMouse();
    const ptr = fromScreenPosition(client);

    return (
        <Stack gap={0}>
            <Text ff="monospace" c="dimmed" fz="sm" inline span>
                Mouse: ({Math.round(ptr.x)}, {Math.round(ptr.y)})
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

        ["1", () => useGraphUIStore.getState().setMode("drag")],
        ["2", () => useGraphUIStore.getState().setMode("link")],
        
        ["p", () => openAppModal("PersonListModal", {})],
        ["s", () => openAppModal("SystemListModal", {})],
        
        ["n", () => {
            const id = addPerson(DEFAULT_PERSON);
            openAppModal("PersonEditorModal", { id });
        }],

        ["v", () => useGlobalTransformStore.getState().reset()],
        ["plus", () => useGlobalTransformStore.getState().changeScaleFrom(vec2(), 1.1)],
        ["-", () => useGlobalTransformStore.getState().changeScaleFrom(vec2(), 0.9)],
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
