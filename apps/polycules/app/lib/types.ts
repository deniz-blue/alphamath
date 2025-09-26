export interface PolyculeManifest {
    v: 1;
    people: Person[];
    systems: System[];
    relationships: Relationship[];
    groupRelationships: GroupRelationship[];
};

export type GraphNode =
    | { type: "person"; data: Person }
    | { type: "system"; data: System };

export type GraphNodeRef =
    | { type: "person"; id: string }
    | { type: "system"; id: string };

export interface Person {
    id: string;
    systemId?: string;

    name: string;
    avatarUrl?: string | null;
    color?: string | null;
    website?: string | null;
};

export interface System {
    id: string;
    name: string;
    avatarUrl?: string | null;
    color?: string | null;
    memberIds: string[];
    pluralkitId?: string | null;
};

export interface Relationship {
    id: string;
    from: GraphNodeRef;
    to: GraphNodeRef;
    label?: string;
};

export interface GroupRelationship {
    id: string;
    memberIds: string[];
};
