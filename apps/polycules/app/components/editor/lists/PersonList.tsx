import { Button, Stack } from "@mantine/core";
import { modals, type ContextModalProps } from "@mantine/modals";
import { addPerson } from "../../../lib/graph";
import { usePolyculeStore } from "../../../contexts/usePolyculeStore";

export const PersonListModal = ({ }: ContextModalProps) => {
    return <PersonList />;
};

export const PersonList = () => {
    const people = usePolyculeStore(state => state.root.people);
    const addPerson = usePolyculeStore(state => state.addPerson);

    return (
        <Stack>
            {people.map(person => (
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

            <Button
                variant="light"
                onClick={() => {
                    const id = addPerson({ name: "New person" });
                    modals.openContextModal({
                        modal: "PersonEditorModal",
                        innerProps: { id: id! },
                    });
                }}
            >
                Add new person
            </Button>
        </Stack>
    )
};
