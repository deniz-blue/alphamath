import { ColorInput, DEFAULT_THEME, Stack, TextInput } from "@mantine/core";
import type { Person } from "../../../lib/types";
import type { ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../contexts/usePolyculeStore";

export const PersonEditorModal = ({
    innerProps: { id },
}: ContextModalProps<{ id: string }>) => {
    return <PersonEditor id={id} />;
};

export const PersonEditor = ({
    id,
}: {
    id: string;
}) => {
    const person = usePolyculeStore(store => store.getPerson(id));
    const updatePerson = usePolyculeStore(store => store.updatePerson);

    if(!person) return null;

    return (
        <PersonEditorForm
            value={person}
            onChange={p => updatePerson({ ...p, id })}
        />
    );
};

export const PersonEditorForm = ({
    value,
    onChange,
}: {
    value: Person;
    onChange: (v: Partial<Person>) => void;
}) => {
    return (
        <Stack>
            <TextInput
                label="Name"
                placeholder="Name"
                value={value.name}
                onChange={e => onChange({ name: e.currentTarget.value })}
            />

            <ColorInput
                label="Color"
                format="hex"
                value={value.color}
                onChange={color => onChange({ color })}
                swatches={['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
            />

            <TextInput
                label="Avatar URL"
                placeholder="<none>"
                value={value.avatarUrl}
                onChange={e => onChange({ avatarUrl: e.currentTarget.value })}
            />
        </Stack>
    )
};
