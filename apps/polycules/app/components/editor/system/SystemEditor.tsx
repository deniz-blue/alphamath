import { ColorInput, DEFAULT_THEME, Stack, TextInput } from "@mantine/core";
import type { System } from "../../../lib/types";
import type { ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../contexts/usePolyculeStore";

export const SystemEditorModal = ({
    innerProps: { id },
}: ContextModalProps<{ id: string }>) => {
    return <SystemEditor id={id} />;
};

export const SystemEditor = ({
    id,
}: {
    id: string;
}) => {
    const system = usePolyculeStore(store => store.getSystem(id));
    const updateSystem = usePolyculeStore(store => store.updateSystem);

    if (!system) return null;

    return (
        <SystemEditorForm
            value={system}
            onChange={p => updateSystem({ ...p, id })}
        />
    );
};

export const SystemEditorForm = ({
    value,
    onChange,
}: {
    value: System;
    onChange: (v: Partial<System>) => void;
}) => {
    return (
        <Stack>
            <TextInput
                label="System Name"
                placeholder="System Name"
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
                value={value.avatarUrl ?? ""}
                onChange={e => onChange({ avatarUrl: e.currentTarget.value })}
            />

            <TextInput
                label="Pluralkit ID"
                placeholder="<none>"
                value={value.pluralkitId ?? ""}
                onChange={e => onChange({ pluralkitId: e.currentTarget.value })}
            />
        </Stack>
    )
};
