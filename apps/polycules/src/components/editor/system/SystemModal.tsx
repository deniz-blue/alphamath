import { Button, Stack } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { SystemCard } from "../../cards/SystemCard";
import { confirmableCallback } from "../openConfirmModal";
import { AppModalHeader } from "../../modal/AppModalHeader";

export const SystemModal = ({
    innerProps: { id },
    context,
    id: modalId,
}: ContextModalProps<{ id: string }>) => {
    const system = usePolyculeStore(store => store.getSystem(id));
    const removeSystem = usePolyculeStore(store => store.removeSystem);
    const unlinkSystem = usePolyculeStore(store => store.unlinkSystem);

    if (!system) return null;
    return (
        <Stack gap="xs">
            <AppModalHeader />

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

            <Button
                color="red"
                variant="light"
                onClick={confirmableCallback(
                    `Are you sure you want to unlink ${system.name || "<unnamed>"}&? Its alters will keep existing, but as singlets.`,
                    () => {
                        if(modalId) context.closeModal(modalId);
                        unlinkSystem(id);
                    },
                )}
            >
                Unlink System
            </Button>

            <Button
                color="red"
                variant="light"
                onClick={confirmableCallback(
                    `Are you sure you want to delete ${system.name || "<unnamed>"}& and all its alters?`,
                    () => {
                        if(modalId) context.closeModal(modalId);
                        removeSystem(id);
                    },
                )}
            >
                Delete System
            </Button>
        </Stack>
    );
};
