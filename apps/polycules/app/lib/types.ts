export interface PolyculeManifest {
    v: 1;
    people: Person[];
    systems: System[];
    relationships: Relationship[];
    groupRelationships: GroupRelationship[];
};

export type NodeRef =
    | { type: "person"; id: string }
    | { type: "system"; id: string };

export interface Person {
    id: string;
    systemId?: string;

    name: string;
    avatarUrl?: string;
    color?: string;
    website?: string;
};

export interface System {
    id: string;
    name: string;
    avatarUrl?: string;
    color?: string;
    memberIds: string[];
    pluralkitId?: string;
};

export interface Relationship {
    id: string;
    from: NodeRef;
    to: NodeRef;
    label?: string;
};

export interface GroupRelationship {
    memberIds: string[];
};
