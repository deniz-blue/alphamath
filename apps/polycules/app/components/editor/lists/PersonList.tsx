import { ActionIcon, Avatar, Button, CheckIcon, Combobox, Group, Select, Stack, Text, TextInput, useCombobox } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { DEFAULT_PERSON } from "../../../store/data";
import { useState } from "react";
import { IconFilter } from "@tabler/icons-react";
import { PersonCard } from "../../cards/PersonCard";
import { SearchableList } from "../common/SearchableList";
import type { Person } from "../../../lib/types";

export const PersonListModal = ({ }: ContextModalProps) => {
    return <PersonList />;
};

export const PersonList = () => {
    const people = usePolyculeStore(state => state.root.people);
    const addPerson = usePolyculeStore(state => state.addPerson);

    const [pluralityFilter, setPluralityFilter] = useState<"all" | "singlet" | "alter">("singlet");

    return (
        <Stack gap="xs">
            <SearchableList<Person>
                data={people}
                getItemId={p => p.id}
                getItemText={p => p.name}
                renderItem={p => <PersonCard person={p} />}
                onItemSelect={id => openAppModal("PersonModal", { id })}
                onCreateNew={() => {
                    const id = addPerson(DEFAULT_PERSON);
                    openAppModal("PersonModal", { id });
                }}
                extraFilter={(
                    <PluralityFilterSelect
                        value={pluralityFilter}
                        onChange={setPluralityFilter}
                    />
                )}
                filterItem={(item) => (pluralityFilter === "all"
                    || (pluralityFilter === "singlet" && !item.systemId)
                    || (pluralityFilter === "alter" && !!item.systemId)
                )}
            />
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
