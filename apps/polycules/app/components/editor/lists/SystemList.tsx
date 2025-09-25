import { Button, Stack } from "@mantine/core";
import { modals, type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../contexts/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { DEFAULT_PERSON, DEFAULT_SYSTEM } from "../../../contexts/data";

export const SystemListModal = ({}: ContextModalProps) => {
    return <SystemList />;
};

export const SystemList = () => {
    const systems = usePolyculeStore(state => state.root.systems);
    const addSystem = usePolyculeStore(state => state.addSystem);

    return (
        <Stack>
            {systems.map(system => (
                <Button
                    variant="light"
                    key={system.id}
                    onClick={() => openAppModal("SystemEditorModal", { id: system.id })}
                >
                    Edit {system.name}
                </Button>
            ))}

            <Button
                variant="light"
                onClick={() => {
                    const id = addSystem(DEFAULT_SYSTEM);
                    openAppModal("SystemEditorModal", { id });
                }}
            >
                Add new system
            </Button>
        </Stack>
    )
};
