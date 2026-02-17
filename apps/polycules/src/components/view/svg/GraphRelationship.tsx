import type { Relationship } from "../../../lib/types";
import { OPTIONS } from "../options";

export const GraphRelationship = ({
    relationship,
}: {
    relationship: Relationship;
}) => {
    return (
        <line
            key={relationship.id}
            data-id={relationship.id}
            data-type="relationship"
            stroke={OPTIONS.linkDefaultColor}
            strokeWidth={OPTIONS.linkDefaultWidth}
            strokeLinecap="round"
        />
    );
};
