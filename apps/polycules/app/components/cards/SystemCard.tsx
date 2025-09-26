import { Avatar, Group, Stack, Text } from "@mantine/core";
import type { System } from "../../lib/types";
import { OPTIONS } from "../view/options";

export const SystemCard = ({ system }: { system: System }) => {
    return (
        <Group gap="xs">
            <Avatar
                color={system.color ?? OPTIONS.systemDefaultColor}
                variant="filled"
                src={system.avatarUrl}
                alt={system.name}
                size="sm"
                children="&"
                autoContrast
            />
            <Stack gap={0}>
                <Text inherit span>
                    {system.name || "(No name)"}
                </Text>
                <Text inherit span inline c="dimmed" fz="xs">
                    {system.memberIds.length} members
                </Text>
            </Stack>
        </Group>
    );
};
