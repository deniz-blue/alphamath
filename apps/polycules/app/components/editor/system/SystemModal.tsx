import { Button, Stack } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { SystemCard } from "../../cards/SystemCard";

export const SystemModal = ({
    innerProps: { id },
}: ContextModalProps<{ id: string }>) => {
    const system = usePolyculeStore(store => store.getSystem(id));

    if(!system) return null;
    return (
        <Stack gap="xs">
            <SystemCard system={system} />

            <Button
                variant="light"
                onClick={() => openAppModal("SystemEditorModal", { id })}
            >
                Edit System
            </Button>

            <Button
                variant="light"
                onClick={() => openAppModal("SystemMembersListModal", { id })}
            >
                Members
            </Button>

            <Button
                variant="light"
                onClick={() => openAppModal("LinksListModal", { target: { type: "system", id } })}
            >
                Relationships
            </Button>
        </Stack>
    );
};
