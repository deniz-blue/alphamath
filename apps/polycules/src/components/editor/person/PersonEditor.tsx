import { Button, CloseButton, ColorInput, DEFAULT_THEME, Stack, Text, TextInput } from "@mantine/core";
import type { Person } from "../../../lib/types";
import { modals, type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { AppModalHeader } from "../../modal/AppModalHeader";

export const PersonEditorModal = ({
    innerProps: { id },
    id: modalId,
}: ContextModalProps<{ id: string }>) => {
    return <PersonEditor id={id} modalId={modalId} />;
};

export const PersonEditor = ({
    id,
    modalId,
}: {
    id: string;
    modalId?: string;
}) => {
    const person = usePolyculeStore(store => store.getPerson(id));
    const updatePerson = usePolyculeStore(store => store.updatePerson);
    
    if (!person) return null;

    return (
        <Stack>
            <AppModalHeader />

            <PersonEditorForm
                value={person}
                onChange={p => updatePerson({ ...p, id })}
            />

            <Button
                variant="light"
                onClick={() => modalId && modals.close(modalId)}
            >
                Ok
            </Button>
        </Stack>
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
                data-autofocus
                label="Name"
                placeholder="Name"
                value={value.name}
                onChange={e => onChange({ name: e.currentTarget.value })}
            />

            <ColorInput
                label="Color"
                placeholder="Default color"
                rightSection={value.color && <CloseButton onClick={() => onChange({ color: null })} />}
                format="hex"
                value={value.color ?? undefined}
                onChange={color => onChange({ color })}
                swatches={['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
            />

            <TextInput
                label="Avatar URL"
                placeholder="<none>"
                value={value.avatarUrl ?? undefined}
                onChange={e => onChange({ avatarUrl: e.currentTarget.value })}
            />
        </Stack>
    )
};
