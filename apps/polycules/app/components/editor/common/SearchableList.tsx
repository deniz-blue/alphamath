import { Button, Combobox, Group, TextInput, useCombobox } from "@mantine/core";
import { useState } from "react";

export const SearchableList = <T,>({
    data,
    renderItem,
    getItemText,
    getItemId,
    onItemSelect,
    onCreateNew,
    createNewLabel,
}: {
    data: T[];
    getItemId: (item: T) => string;
    getItemText: (item: T) => string;
    renderItem: (item: T) => React.ReactNode;
    onItemSelect: (id: string) => void;
    onCreateNew?: () => void;
    createNewLabel?: string;
}) => {
    const [search, setSearch] = useState("");
    const combobox = useCombobox();

    const filteredItems = data.filter(item => (
        getItemText(item).toLowerCase().includes(search.toLowerCase())
    ));

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={onItemSelect}
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

                {onCreateNew && (
                    <Button
                        variant="light"
                        color="green"
                        onClick={onCreateNew}
                    >
                        {createNewLabel ?? "New"}
                    </Button>
                )}
            </Group>

            <Combobox.Options>
                {filteredItems.map(item => (
                    <Combobox.Option value={getItemId(item)} key={getItemId(item)}>
                        {renderItem(item)}
                    </Combobox.Option>
                ))}

                {filteredItems.length === 0 && (
                    <Combobox.Empty>
                        No results
                    </Combobox.Empty>
                )}
            </Combobox.Options>
        </Combobox>
    );
}
