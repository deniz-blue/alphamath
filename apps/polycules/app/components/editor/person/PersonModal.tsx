import { Button, Stack } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { PersonCard } from "../../cards/PersonCard";
import { confirmableCallback } from "../openConfirmModal";
import { AppModalHeader } from "../../modal/AppModalHeader";

export const PersonModal = ({
    innerProps: { id },
    context,
    id: modalId,
}: ContextModalProps<{ id: string }>) => {
    const person = usePolyculeStore(store => store.getPerson(id));
    const removePerson = usePolyculeStore(store => store.removePerson);
    const addPersonToSystem = usePolyculeStore(store => store.addPersonToSystem);
    const removePersonFromSystem = usePolyculeStore(store => store.removePersonFromSystem);

    if (!person) return null;
    return (
        <Stack gap="xs">
            <AppModalHeader />

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

            {!!person.systemId && (
                <Button
                    variant="light"
                    onClick={() => openAppModal("SystemModal", { id: person.systemId! })}
                >
                    Show System
                </Button>
            )}

            {!!person.systemId && (
                <Button
                    variant="light"
                    color="red"
                    onClick={confirmableCallback(
                        `Are you sure you want to unlink ${person.name || "<unnamed>"} from the system? They will appear as a singlet.`,
                        () => removePersonFromSystem(person.id, person.systemId!),
                    )}
                >
                    Unlink from System
                </Button>
            )}

            {!person.systemId && (
                <Button
                    variant="light"
                    onClick={() => openAppModal("NodeSelectModal", {
                        filterOnly: "system",
                        onSelect: ({ id }) => {
                            addPersonToSystem(person.id, id);
                        },
                    })}
                >
                    Add to System
                </Button>
            )}

            <Button
                variant="light"
                color="red"
                onClick={confirmableCallback(
                    `Are you sure you want to delete ${person.name || "<unnamed>"}?`,
                    () => {
                        if(modalId) context.closeModal(modalId);
                        removePerson(id);
                    },
                )}
            >
                Delete
            </Button>
        </Stack>
    );
};
