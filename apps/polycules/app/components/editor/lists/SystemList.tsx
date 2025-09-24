import { Button, Stack } from "@mantine/core";
import { usePolycule } from "../../../contexts/PolyculeContext";
import { modals, type ContextModalProps } from "@mantine/modals";

export const SystemListModal = ({}: ContextModalProps) => {
    return <SystemList />;
};

export const SystemList = () => {
    const { root } = usePolycule();

    return (
        <Stack>
            {root.systems.map(system => (
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
