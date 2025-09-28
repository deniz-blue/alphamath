import { useCallback } from "react";
import type { Person } from "../../../lib/types";
import { openAppModal } from "../../../modals";
import { useHotkeys } from "@mantine/hooks";
import { Menu, Text } from "@mantine/core";
import { IconCircles, IconLink, IconPencil } from "@tabler/icons-react";

export const GraphPersonActions = ({
    person,
    onClose,
}: {
    person: Person;
    onClose?: () => void;
}) => {
    const actionEdit = useCallback(() => {
        openAppModal("PersonModal", { id: person.id });
        onClose?.();
    }, [person.id]);

    const actionSystem = useCallback(() => {
        if (!person.systemId) return;
        openAppModal("SystemModal", { id: person.systemId });
        onClose?.();
    }, [person.systemId]);

    const actionRelationships = useCallback(() => {
        openAppModal("LinksListModal", { target: { type: "person", id: person.id } });
        onClose?.();
    }, [person.id]);

    useHotkeys([
        ["e", actionEdit],
        ["s", actionSystem],
        ["r", actionRelationships],
    ]);

    return (
        <>
            <Menu.Label>
                {person.name || "(No name)"}
            </Menu.Label>
            <Menu.Item
                onClick={actionEdit}
                leftSection={<IconPencil size={14} />}
            >
                <Text span inline inherit td="underline">E</Text>dit
            </Menu.Item>
            {person.systemId && (
                <Menu.Item
                    onClick={actionSystem}
                    leftSection={<IconCircles size={14} />}
                >
                    <Text span inline inherit td="underline">S</Text>ystem
                </Menu.Item>
            )}
            <Menu.Item
                onClick={actionRelationships}
                leftSection={<IconLink size={14} />}
            >
                <Text span inline inherit td="underline">R</Text>elationships
            </Menu.Item>
        </>
    );
};
