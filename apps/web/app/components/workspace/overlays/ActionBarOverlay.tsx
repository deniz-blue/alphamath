import { ActionIcon, Group, Paper, Stack, Tooltip } from "@mantine/core";
import { IconCalculator, IconNote } from "@tabler/icons-react";
import { useWorkspace } from "../../../store/useWorkspace";

export const ActionBarOverlay = () => {
    const openWindow = useWorkspace(store => store.openWindow);

    return (
        <Stack>
            <Paper
                withBorder
                p="xs"
                style={{ pointerEvents: "auto" }}
            >
                <Group gap="xs">
                    <Tooltip label="New Note">
                        <ActionIcon
                            variant="light"
                            color="gray"
                            size="xl"
                            onClick={() => openWindow({
                                type: "Notepad",
                                data: { content: "" },
                            })}
                        >
                            <IconNote />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="New Calculator">
                        <ActionIcon
                            variant="light"
                            color="gray"
                            size="xl"
                            onClick={() => openWindow({
                                type: "Calculator",
                                data: {},
                            })}
                        >
                            <IconCalculator />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Paper>
        </Stack>
    );
};
