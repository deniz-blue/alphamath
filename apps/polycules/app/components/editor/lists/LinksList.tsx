import { ActionIcon, Avatar, Button, CheckIcon, Combobox, Group, Select, Stack, Text, TextInput, useCombobox } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { nodeRefEq, usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { useState } from "react";
import type { GraphNodeRef, Relationship } from "../../../lib/types";
import { PersonCard } from "../../cards/PersonCard";
import { SystemCard } from "../../cards/SystemCard";
import { SearchableList } from "../common/SearchableList";

export const LinksListModal = ({
    innerProps: { target },
}: ContextModalProps<{ target: GraphNodeRef }>) => {
    return <LinksList target={target} />;
};

export const LinksList = ({
    target,
}: {
    target: GraphNodeRef;
}) => {
    const getRelationshipsOfNode = usePolyculeStore(state => state.getRelationshipsOfNode);
    const getPerson = usePolyculeStore(state => state.getPerson);
    const getSystem = usePolyculeStore(state => state.getSystem);
    const addRelationship = usePolyculeStore(state => state.addRelationship);
    
    const relationships = getRelationshipsOfNode(target);
    
    const getOther = (relationship: Relationship) => nodeRefEq(relationship.to, target)
        ? relationship.from
        : relationship.to;

    return (
        <Stack gap="xs">

            <SearchableList<Relationship>
                data={relationships}
                getItemId={r => r.id}
                getItemText={r => {
                    const o = getOther(r);
                    return o.type === "person"
                        ? getPerson(o.id)?.name ?? ""
                        : getSystem(o.id)?.name ?? "";
                }}
                renderItem={r => {
                    const o = getOther(r);
                    return o.type === "person"
                        ? <PersonCard person={getPerson(o.id)!} />
                        : <SystemCard system={getSystem(o.id)!} />;
                }}
                onItemSelect={id => {
                    openAppModal("RelationshipEditorModal", { id });
                }}
                onCreateNew={() => {
                    openAppModal("NodeSelectModal", {
                        onSelect: (node) => {
                            addRelationship({
                                from: target,
                                to: node,
                            });
                        },
                    });
                }}
                createNewLabel="Link"
            />
        </Stack>
    )
};
