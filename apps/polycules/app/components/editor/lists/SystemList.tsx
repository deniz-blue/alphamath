import { Button, Stack } from "@mantine/core";
import { modals, type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../contexts/usePolyculeStore";

export const SystemListModal = ({}: ContextModalProps) => {
    return <SystemList />;
};

export const SystemList = () => {
    const systems = usePolyculeStore(state => state.root.systems);

    return (
        <Stack>
            {systems.map(system => (
                <Button
                    variant="light"
                    key={system.id}
                    onClick={() => modals.openContextModal({
                        modal: "SystemEditorModal",
                        innerProps: { id: system.id },
                    })}
                >
                    Edit {system.name}
                </Button>
            ))}
        </Stack>
    )
};
