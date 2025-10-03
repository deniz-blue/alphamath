import { ActionIcon, Avatar, Button, CheckIcon, Combobox, Group, Select, Stack, Text, TextInput, useCombobox } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { nodeRefEq, usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import type { GraphNodeRef, Relationship } from "../../../lib/types";
import { SearchableList } from "../common/SearchableList";
import { GraphNodeRefCard } from "../../cards/GraphNodeCard";
import { AppModalHeader } from "../../modal/AppModalHeader";

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
        <Stack>
            <AppModalHeader />

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
                    return <GraphNodeRefCard node={o} />;
                }}
                onItemSelect={id => openAppModal("RelationshipEditorModal", { id })}
                controls={[
                    <Button
                        variant="light"
                        color="green"
                        onClick={() => {
                            openAppModal("NodeSelectModal", {
                                filterFn: (node) => {
                                    // Shouldn't be allowed to select itself
                                    if (nodeRefEq(node, target)) return false;
                                    // Shouldn't be allowed to create an existing relationship
                                    if (relationships.some(x => nodeRefEq(getOther(x), node))) return false;

                                    return true;
                                },
                                onSelect: (node) => {
                                    addRelationship({
                                        from: target,
                                        to: node,
                                    });
                                },
                            });
                        }}
                    >
                        Link
                    </Button>
                ]}
            />
        </Stack>
    )
};
