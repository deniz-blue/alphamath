export interface PolyculeManifest {
    v: 1;
    people: Person[];
    systems: System[];
    relationships: Relationship[];
    groupRelationships: GroupRelationship[];
};

export interface Person {
    id: string;
    name: string;
    avatarUrl?: string;
    systemId?: string;
};

export interface System {
    id: string;
    name: string;
    avatarUrl?: string;
    memberIds: string[];
};

export interface Relationship {
    id: string;
    from: string;
    to: string;
    label?: string;
};

export interface GroupRelationship {
    memberIds: string[];
};
