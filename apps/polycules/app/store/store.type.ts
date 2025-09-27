import type { GraphNode, GraphNodeRef, GroupRelationship, Person, PolyculeManifest, Relationship, System } from "../lib/types";

export type New<T> = Omit<T, "id">;
export type Patch<T> = Partial<T> & { id: string };

export type State = {
    root: PolyculeManifest;
};

export type Actions = {
    getNode: (ref: GraphNodeRef) => GraphNode | null;

    getPerson: (personId: string) => Person | null;
    getSystem: (systemId: string) => System | null;
    getMembersOfSystem: (systemId: string) => Person[];

    addPerson: (p: New<Person>) => string;
    updatePerson: (p: Patch<Person>) => void;
    removePerson: (personId: string) => void;

    addSystem: (s: New<System>) => string;
    updateSystem: (s: Patch<System>) => void;
    removeSystem: (systemId: string) => void;

    getRelationship: (relationshipId: string) => Relationship | null;
    getRelationshipsOfNode: (ref: GraphNodeRef) => Relationship[];
    addRelationship: (r: New<Relationship>) => string;
    updateRelationship: (r: Patch<Relationship>) => void;
    removeRelationship: (relationshipId: string) => void;

    addGroupRelationship: (gr: New<GroupRelationship>) => string;
    updateGroupRelationship: (gr: Patch<GroupRelationship>) => void;
    removeGroupRelationship: (groupRelationshipId: string) => void;
};
