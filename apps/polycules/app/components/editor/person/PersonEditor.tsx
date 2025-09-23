import { ColorInput, DEFAULT_THEME, Stack, TextInput } from "@mantine/core";
import { usePolycule } from "../../../contexts/PolyculeContext";
import { getPerson, updatePerson } from "../../../lib/graph";
import type { Person } from "../../../lib/types";
import type { ContextModalProps } from "@mantine/modals";

export const PersonEditModal = ({
    innerProps: { id },
}: ContextModalProps<{ id: string }>) => {
    return <PersonEditor id={id} />;
};

export const PersonEditor = ({
    id,
}: {
    id: string;
}) => {
    const { root, update } = usePolycule();

    const person = getPerson(root, id);
    if (!person) return null;

    return (
        <PersonEditorForm
            value={person}
            onChange={(v) => update((r) => updatePerson(r, { ...v, id }))}
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
