import { ActionIcon, Box, Button, CloseButton, ColorInput, DEFAULT_THEME, Group, Paper, Stack, TextInput, UnstyledButton } from "@mantine/core";
import type { Relationship } from "../../../lib/types";
import { modals, type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { IconArrowsRightLeft } from "@tabler/icons-react";
import { GraphNodeCard } from "../../cards/GraphNodeCard";
import { openAppModal } from "../../../modals";
import { AppModalHeader } from "../../modal/AppModalHeader";

export const RelationshipEditorModal = ({
    innerProps: { id },
    id: modalId,
}: ContextModalProps<{ id: string }>) => {
    return <RelationshipEditor id={id} modalId={modalId} />;
};

export const RelationshipEditor = ({
    id,
    modalId,
}: {
    id: string;
    modalId?: string;
}) => {
    const relationship = usePolyculeStore(store => store.getRelationship(id));
    const updateRelationship = usePolyculeStore(store => store.updateRelationship);
    const removeRelationship = usePolyculeStore(store => store.removeRelationship);

    if (!relationship) return null;

    return (
        <RelationshipEditorForm
            value={relationship}
            onChange={p => updateRelationship({ ...p, id })}
            onDelete={() => {
                if (modalId) modals.close(modalId);
                removeRelationship(id);
            }}
        />
    );
};

export const RelationshipEditorForm = ({
    value,
    onChange,
    onDelete,
}: {
    value: Relationship;
    onChange: (v: Partial<Relationship>) => void;
    onDelete?: () => void;
}) => {
    const getNode = usePolyculeStore(store => store.getNode);

    return (
        <Stack>
            <AppModalHeader />

            <Group gap="xs" align="center">
                <UnstyledButton
                    flex="1"
                    onClick={() => {
                        if(value.from.type == "person") {
                            openAppModal("PersonEditorModal", { id: value.from.id });
                        } else {
                            openAppModal("SystemEditorModal", { id: value.from.id });
                        }
                    }}
                >
                    <Paper bg="dark" p="xs">
                        <GraphNodeCard node={getNode(value.from)} />
                    </Paper>
                </UnstyledButton>
                <IconArrowsRightLeft />
                <UnstyledButton
                    flex="1"
                    onClick={() => {
                        if(value.to.type == "person") {
                            openAppModal("PersonEditorModal", { id: value.to.id });
                        } else {
                            openAppModal("SystemEditorModal", { id: value.to.id });
                        }
                    }}
                >
                    <Paper bg="dark" p="xs">
                        <GraphNodeCard node={getNode(value.to)} />
                    </Paper>
                </UnstyledButton>
            </Group>

            <TextInput
                label="Label"
                placeholder="<no label>"
                value={value.label}
                onChange={e => onChange({ label: e.currentTarget.value })}
            />

            <Button
                color="red"
                variant="light"
                onClick={onDelete}
            >
                Delete Relationship
            </Button>
        </Stack>
    )
};
