import { Avatar, Button, Combobox, Group, Stack, Text, TextInput, useCombobox } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { useState } from "react";
import { OPTIONS } from "../../view/options";

export const SystemMembersListModal = ({
    innerProps: { id },
}: ContextModalProps<{ id: string }>) => {
    return <SystemMembersList id={id} />;
};

export const SystemMembersList = ({
    id
}: {
    id: string;
}) => {
    const system = usePolyculeStore(state => state.getSystem(id));
    if(!system) return null;
    
    const getMembersOfSystem = usePolyculeStore(state => state.getMembersOfSystem);
    const members = getMembersOfSystem(id);
    
    const [search, setSearch] = useState("");
    const filteredMembers = members.filter(m => (
        m.name.toLowerCase().includes(search.toLowerCase())
    ));
    
    const combobox = useCombobox();

    return (
        <Stack>
            <Combobox
                store={combobox}
                onOptionSubmit={id => openAppModal("PersonEditorModal", { id })}
            >
                <Group justify="space-between" align="center">
                    <Combobox.EventsTarget>
                        <TextInput
                            data-autofocus
                            value={search}
                            onChange={e => {
                                setSearch(e.currentTarget.value);
                                combobox.updateSelectedOptionIndex();
                            }}
                            placeholder="Search..."
                            flex="1"
                        />
                    </Combobox.EventsTarget>

                    {/* <Button
                        variant="light"
                        color="green"
                        onClick={() => {
                            const id = addSystem(DEFAULT_SYSTEM);
                            openAppModal("SystemEditorModal", { id });
                        }}
                    >
                        New
                    </Button> */}
                </Group>

                <Combobox.Options>
                    {filteredMembers.map(person => (
                        <Combobox.Option value={person.id} key={person.id}>
                            <Group gap="xs">
                                <Avatar
                                    color={person.color ?? OPTIONS.systemDefaultColor}
                                    variant="filled"
                                    src={person.avatarUrl}
                                    alt={person.name}
                                    size="sm"
                                    children={" "}
                                />
                                <Stack gap={0}>
                                    <Text inherit span>
                                        {person.name || "(No name)"}
                                    </Text>
                                    <Text inherit span inline c="dimmed" fz="xs">
                                        
                                    </Text>
                                </Stack>
                            </Group>
                        </Combobox.Option>
                    ))}

                    {filteredMembers.length === 0 && (
                        <Combobox.Empty>
                            No results
                        </Combobox.Empty>
                    )}
                </Combobox.Options>
            </Combobox>
        </Stack>
    )
};
