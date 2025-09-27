import type { GraphNode } from "../../lib/types";
import { PersonCard } from "./PersonCard";
import { SystemCard } from "./SystemCard";

export const GraphNodeCard = ({
    node,
}: {
    node?: GraphNode | null;
}) => {
    if(!node) return null;

    return node.type == "person"
        ? <PersonCard person={node.data} />
        : <SystemCard system={node.data} />;
};
