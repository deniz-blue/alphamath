import type { GraphNode, GraphNodeRef } from "../../lib/legacy-schema/legacy-types";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { PersonCard } from "./PersonCard";
import { SystemCard } from "./SystemCard";

export const GraphNodeRefCard = ({
    node,
}: {
    node?: GraphNodeRef | null;
}) => {
    const getSystem = usePolyculeStore(store => store.getSystem);
    const getPerson = usePolyculeStore(store => store.getPerson);

    if (!node) return null;

    return <GraphNodeCard node={{
        type: node.type,
        data: (node.type == "person" ? getPerson(node.id)! : getSystem(node.id)!),
    } as GraphNode} />;
};

export const GraphNodeCard = ({
    node,
}: {
    node?: GraphNode | null;
}) => {
    if (!node) return null;

    return node.type == "person"
        ? <PersonCard person={node.data} />
        : <SystemCard system={node.data} />;
};
