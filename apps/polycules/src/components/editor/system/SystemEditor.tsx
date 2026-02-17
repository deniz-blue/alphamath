import { ActionIcon, Button, CloseButton, ColorInput, DEFAULT_THEME, Stack, TextInput } from "@mantine/core";
import type { System } from "../../../lib/types";
import { modals, type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { AppModalHeader } from "../../modal/AppModalHeader";

export const SystemEditorModal = ({
    innerProps: { id },
    id: modalId,
}: ContextModalProps<{ id: string }>) => {
    return <SystemEditor id={id} modalId={modalId} />;
};

export const SystemEditor = ({
    id,
    modalId,
}: {
    id: string;
    modalId?: string;
}) => {
    const system = usePolyculeStore(store => store.getSystem(id));
    const updateSystem = usePolyculeStore(store => store.updateSystem);

    if (!system) return null;

    return (
        <Stack>
            <SystemEditorForm
                value={system}
                onChange={p => updateSystem({ ...p, id })}
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

export const SystemEditorForm = ({
    value,
    onChange,
}: {
    value: System;
    onChange: (v: Partial<System>) => void;
}) => {
    return (
        <Stack>
            <AppModalHeader />

            <TextInput
                data-autofocus
                label="System Name"
                placeholder="System Name"
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
                value={value.avatarUrl ?? ""}
                onChange={e => onChange({ avatarUrl: e.currentTarget.value })}
            />

            {/* <TextInput
                label="Pluralkit ID"
                placeholder="<none>"
                value={value.pluralkitId ?? ""}
                onChange={e => onChange({ pluralkitId: e.currentTarget.value })}
            /> */}
        </Stack>
    )
};
