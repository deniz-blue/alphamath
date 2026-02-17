import { Avatar, Group, Stack, Text } from "@mantine/core";
import type { Person } from "../../lib/types";
import { OPTIONS } from "../view/options";
import { usePolyculeStore } from "../../store/usePolyculeStore";

export const PersonCard = ({ person }: { person: Person }) => {
    const getSystem = usePolyculeStore(state => state.getSystem);

    return (
        <Group gap="xs">
            <Avatar
                color={person.color ?? OPTIONS.personDefaultColor}
                variant="filled"
                src={person.avatarUrl}
                alt={person.name}
                size="sm"
                children={" "}
            />
            <Stack gap={0}>
                <Text inherit span>
                    {person.name || "(No name)"}
                </Text>
                <Text inherit span inline c="dimmed" fz="xs">
                    {getSystem(person.systemId ?? "")?.name}{person.systemId && "&"}
                </Text>
            </Stack>
        </Group>
    );
};