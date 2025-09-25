import { Button, Stack } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../contexts/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { DEFAULT_PERSON } from "../../../contexts/data";

export const PersonListModal = ({}: ContextModalProps) => {
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
                    onClick={() => openAppModal("PersonEditorModal", { id: person.id })}
                >
                    Edit {person.name}
                </Button>
            ))}

            <Button
                variant="light"
                onClick={() => {
                    const id = addPerson(DEFAULT_PERSON);
                    openAppModal("PersonEditorModal", { id });
                }}
            >
                Add new person
            </Button>
        </Stack>
    )
};
