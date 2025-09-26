import { ActionIcon, Avatar, Button, CheckIcon, Combobox, Group, Select, Stack, Text, TextInput, useCombobox } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { DEFAULT_PERSON } from "../../../store/data";
import { useState } from "react";
import { OPTIONS } from "../../view/options";
import { IconFilter, IconFilterFilled } from "@tabler/icons-react";
import { PersonCard } from "../../cards/PersonCard";

export const PersonListModal = ({ }: ContextModalProps) => {
    return <PersonList />;
};

export const PersonList = () => {
    const people = usePolyculeStore(state => state.root.people);
    const addPerson = usePolyculeStore(state => state.addPerson);
    const getSystem = usePolyculeStore(state => state.getSystem);
    const [search, setSearch] = useState("");
    const [pluralityFilter, setPluralityFilter] = useState<"all" | "singlet" | "alter">("singlet");
    const filteredPeople = people.filter(p => (
        p.name.toLowerCase().includes(search.toLowerCase())
        && (pluralityFilter === "all"
            || (pluralityFilter === "singlet" && !p.systemId)
            || (pluralityFilter === "alter" && !!p.systemId)
        )
    ));

    const combobox = useCombobox();

    return (
        <Stack gap="xs">
            <Combobox
                store={combobox}
                onOptionSubmit={id => openAppModal("PersonEditorModal", { id })}
            >
                <Group justify="space-between" align="center" gap="xs">
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

                    <Button
                        variant="light"
                        color="green"
                        onClick={() => {
                            const id = addPerson(DEFAULT_PERSON);
                            openAppModal("PersonEditorModal", { id });
                        }}
                    >
                        New
                    </Button>

                    <PluralityFilterSelect
                        value={pluralityFilter}
                        onChange={setPluralityFilter}
                    />
                </Group>

                <Combobox.Options>
                    {filteredPeople.map(person => (
                        <Combobox.Option value={person.id} key={person.id}>
                            <PersonCard person={person} />
                        </Combobox.Option>
                    ))}

                    {filteredPeople.length === 0 && (
                        <Combobox.Empty>
                            No results
                        </Combobox.Empty>
                    )}
                </Combobox.Options>
            </Combobox>
        </Stack>
    )
};

export const PluralityFilterSelect = ({ value, onChange }: {
    value: "all" | "singlet" | "alter";
    onChange: (value: "all" | "singlet" | "alter") => void;
}) => {
    const combobox = useCombobox();

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={v => onChange(v as "all" | "singlet" | "alter")}
            width="auto"
            position="bottom-end"
        >
            <Combobox.Target>
                <ActionIcon
                    size="input-sm"
                    variant="light"
                    color="gray"
                    title="Filter"
                    onClick={() => combobox.toggleDropdown()}
                >
                    <IconFilter />
                </ActionIcon>
            </Combobox.Target>
            <Combobox.Dropdown>
                <Combobox.Options>
                    {[
                        { value: "all", label: "All" },
                        { value: "singlet", label: "Singlets" },
                        { value: "alter", label: "In Systems" },
                    ].map(opt => (
                        <Combobox.Option value={opt.value} key={opt.value}>
                            <Group gap={4}>
                                {value === opt.value && <CheckIcon size={16} />}
                                <Text>{opt.label}</Text>
                            </Group>
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};
