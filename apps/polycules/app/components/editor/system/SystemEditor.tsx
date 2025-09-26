import { ActionIcon, Button, CloseButton, ColorInput, DEFAULT_THEME, Stack, TextInput } from "@mantine/core";
import type { System } from "../../../lib/types";
import { modals, type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { confirmableCallback } from "../openConfirmModal";

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
    const removeSystem = usePolyculeStore(store => store.removeSystem);

    if (!system) return null;

    return (
        <SystemEditorForm
            value={system}
            onChange={p => updateSystem({ ...p, id })}
            onDelete={() => {
                if (modalId) modals.close(modalId);
                removeSystem(id);
            }}
        />
    );
};

export const SystemEditorForm = ({
    value,
    onChange,
    onDelete,
}: {
    value: System;
    onChange: (v: Partial<System>) => void;
    onDelete?: () => void;
}) => {
    return (
        <Stack>
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

            <TextInput
                label="Pluralkit ID"
                placeholder="<none>"
                value={value.pluralkitId ?? ""}
                onChange={e => onChange({ pluralkitId: e.currentTarget.value })}
            />

            <Button
                variant="light"
                onClick={() => openAppModal("SystemMembersListModal", { id: value.id })}
            >
                Edit Members
            </Button>

            <Button
                variant="light"
                onClick={() => openAppModal("LinksListModal", { target: { type: "system", id: value.id } })}
            >
                Edit Relationships
            </Button>

            <Button
                color="red"
                variant="light"
                onClick={confirmableCallback(`Are you sure you want to delete ${value.name || "<unnamed>"}& and all its alters?`, onDelete)}
            >
                Delete System
            </Button>
        </Stack>
    )
};
