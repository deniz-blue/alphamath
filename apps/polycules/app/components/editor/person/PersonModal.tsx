import { Button, Stack } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { PersonCard } from "../../cards/PersonCard";

export const PersonModal = ({
    innerProps: { id },
}: ContextModalProps<{ id: string }>) => {
    const person = usePolyculeStore(store => store.getPerson(id));

    if(!person) return null;
    return (
        <Stack gap="xs">
            <PersonCard person={person} />

            <Button
                variant="light"
                onClick={() => openAppModal("PersonEditorModal", { id })}
            >
                Edit
            </Button>

            <Button
                variant="light"
                onClick={() => openAppModal("LinksListModal", { target: { type: "person", id } })}
            >
                Relationships
            </Button>
        </Stack>
    );
};
