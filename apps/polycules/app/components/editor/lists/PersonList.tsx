import { Button, Stack } from "@mantine/core";
import { usePolycule } from "../../../contexts/PolyculeContext";
import { modals, type ContextModalProps } from "@mantine/modals";

export const PersonListModal = ({}: ContextModalProps) => {
    return <PersonList />;
};

export const PersonList = () => {
    const { root } = usePolycule();

    return (
        <Stack>
            {root.people.map(person => (
                <Button
                    variant="light"
                    key={person.id}
                    onClick={() => modals.openContextModal({
                        modal: "PersonEditorModal",
                        innerProps: { id: person.id },
                    })}
                >
                    Edit {person.name}
                </Button>
            ))}
        </Stack>
    )
};
