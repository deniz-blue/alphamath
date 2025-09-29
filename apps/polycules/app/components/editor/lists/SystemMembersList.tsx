import { Avatar, Button, Combobox, Group, Stack, Text, TextInput, useCombobox } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { SearchableList } from "../common/SearchableList";
import { PersonCard } from "../../cards/PersonCard";
import { DEFAULT_PERSON } from "../../../store/data";

export const SystemMembersListModal = ({
    innerProps: { id },
}: ContextModalProps<{ id: string }>) => {
    return <SystemMembersList systemId={id} />;
};

export const SystemMembersList = ({
    systemId
}: {
    systemId: string;
}) => {
    const getMembersOfSystem = usePolyculeStore(state => state.getMembersOfSystem);
    const addPerson = usePolyculeStore(store => store.addPerson);
    const addPersonToSystem = usePolyculeStore(store => store.addPersonToSystem);
    const members = getMembersOfSystem(systemId);

    return (
        <Stack>
            <SearchableList
                data={members}
                getItemId={person => person.id}
                getItemText={person => person.name}
                onItemSelect={id => openAppModal("PersonModal", { id })}
                renderItem={(person) => (
                    <PersonCard person={person} />
                )}
                controls={[
                    <Button
                        variant="light"
                        color="green"
                        onClick={() => {
                            const id = addPerson({
                                ...DEFAULT_PERSON,
                                systemId: systemId,
                            });
                            openAppModal("PersonModal", { id });
                        }}
                    >
                        New
                    </Button>,
                    <Button
                        variant="light"
                        onClick={() => {
                            openAppModal("NodeSelectModal", {
                                filterOnly: "person",
                                onSelect: ({ id }) => {
                                    addPersonToSystem(id, systemId);
                                },
                            });
                        }}
                    >
                        Add
                    </Button>,
                ]}
            />
        </Stack>
    )
};
