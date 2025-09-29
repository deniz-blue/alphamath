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

// A person
export interface Person {
    id: string;
    systemId?: string;

    name: string;
    avatarUrl?: string | null;
    color?: string | null;

    // extra metadata for filtering or 3rd party tools
    meta?: Record<string, string>;
};

// Plural system
// each member is defined as a Person with a `systemId`
// and is referenced back in `memberIds`
export interface System {
    id: string;
    name: string;
    avatarUrl?: string | null;
    color?: string | null;
    memberIds: string[];
    pluralkitId?: string | null; // might remove? or stay?
};

// Two-way relationship
export interface Relationship {
    id: string;
    from: GraphNodeRef;
    to: GraphNodeRef;

    label?: string;

    // might expand!
};

// A relationship that is a group
// Not exactly implemented anywhere *yet*
// i.e friend groups, polycules where everyone is with each other etc.
export interface GroupRelationship {
    id: string;
    memberIds: string[];

    // might expand!
};
