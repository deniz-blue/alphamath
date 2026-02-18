import { Avatar, Button, Combobox, Group, Stack, Text, TextInput, useCombobox } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { SystemCard } from "../../cards/SystemCard";
import { SearchableList } from "../common/SearchableList";
import type { GraphNodeRef } from "../../../lib/legacy-schema/legacy-types";
import { PersonCard } from "../../cards/PersonCard";
import { AppModalHeader } from "../../modal/AppModalHeader";

export interface NodeSelectProps {
    onSelect?: (node: GraphNodeRef) => void;
    filterOnly?: "person" | "system";
    filterFn?: (node: GraphNodeRef) => boolean;
};

export const NodeSelectModal = ({
    innerProps,
    context,
    id: modalId,
}: ContextModalProps<NodeSelectProps>) => {
    return (
        <NodeSelect
            {...innerProps}
            onSelect={n => {
                context.closeModal(modalId);
                innerProps.onSelect?.(n);
            }}
        />
    );
};

export const NodeSelect = ({
    onSelect,
    filterOnly,
    filterFn,
}: NodeSelectProps) => {
    const systems = usePolyculeStore(state => state.root.systems);
    const people = usePolyculeStore(state => state.root.people);
    
    const getSystem = usePolyculeStore(state => state.getSystem);
    const getPerson = usePolyculeStore(state => state.getPerson);

    const sp = "$$$";

    return (
        <Stack>
            <AppModalHeader />

            <SearchableList<GraphNodeRef>
                data={[
                    ...systems.map(s => ({ type: "system" as const, id: s.id })),
                    ...people.map(p => ({ type: "person" as const, id: p.id })),
                ]}
                getItemId={item => item.type + sp + item.id}
                getItemText={item => item.type === "system"
                    ? getSystem(item.id)?.name ?? ""
                    : getPerson(item.id)?.name ?? ""
                }
                renderItem={item => item.type === "system"
                    ? <SystemCard system={getSystem(item.id)!} />
                    : <PersonCard person={getPerson(item.id)!} />
                }
                onItemSelect={id => {
                    const [type, realId] = id.split(sp);
                    if(type && realId) {
                        onSelect?.({ type: type as "system" | "person", id: realId });
                    }
                }}
                filterFn={(item) => {
                    if(!filterOnly) return true;
                    return item.type == filterOnly && (filterFn?.(item) ?? true);
                }}
            />
        </Stack>
    )
};
