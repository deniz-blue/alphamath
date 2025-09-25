import type { NodeRef, Person, PolyculeManifest, Relationship, System } from "./types";

export type New<T> = Omit<T, "id">;
export type Patch<T> = Partial<T> & { id: string };

const randomId = (prefix = ""): string => prefix + Math.random().toString(36).slice(2).toString();

export const nodeRefEq = (a: NodeRef, b: NodeRef) => a.type == b.type && a.id == b.id;

export const createPolyculeManifest = (): PolyculeManifest => ({
    v: 1,
    people: [],
    systems: [],
    relationships: [],
    groupRelationships: [],
});

// PERSON

export const getPerson = (root: PolyculeManifest, personId: string) =>
    root.people.find(x => x.id == personId) ?? null;

export const addPerson = (root: PolyculeManifest, p: New<Person>) => {
    const id = randomId("p_");

    root.people.push({
        id,
        ...p,
    });

    if (p.systemId) {
        const system = root.systems.find(s => s.id == p.systemId);
        if (system) system.memberIds.push(id);
    }

    return id;
};

export const updatePerson = (root: PolyculeManifest, { id, ...p }: Patch<Person>) => {
    const person = root.people.find(x => x.id == id);
    if (person) {
        Object.assign(person, p);
    };
};

export const removePerson = (root: PolyculeManifest, personId: string) => {
    const personIndex = root.people.findIndex(x => x.id == personId);
    if (personIndex !== -1) {
        const person = root.people[personIndex];
        // Remove from system
        if (person.systemId) {
            const system = root.systems.find(s => s.id == person.systemId);
            if (system) {
                system.memberIds = system.memberIds.filter(id => id !== personId);
            }
        }
        // Remove relationships
        root.relationships = root.relationships.filter(r => !(
            nodeRefEq(r.from, { type: "person", id: personId }) ||
            nodeRefEq(r.to, { type: "person", id: personId })
        ));
        // Remove person
        root.people.splice(personIndex, 1);
    }
};

// SYSTEM

export const getSystem = (root: PolyculeManifest, systemId: string) =>
    root.systems.find(x => x.id == systemId) ?? null;

export const getMembersOfSystem = (root: PolyculeManifest, systemId: string) =>
    getSystem(root, systemId)?.memberIds.map(memberId => getPerson(root, memberId)).filter(x => !!x) ?? [];

export const addSystem = (root: PolyculeManifest, s: New<System>) => {
    const id = randomId("s_");

    root.systems.push({
        id,
        ...s,
    });

    return id;
};

export const updateSystem = (root: PolyculeManifest, { id, ...s }: Patch<System>) => {
    const system = root.systems.find(x => x.id == id);
    if (system) {
        Object.assign(system, s);
    };
};

export const removeSystem = (root: PolyculeManifest, systemId: string) => {
    const systemIndex = root.systems.findIndex(x => x.id == systemId);
    if (systemIndex !== -1) {
        // Remove system reference from members
        const system = root.systems[systemIndex];
        system.memberIds.forEach(memberId => {
            const person = root.people.find(p => p.id == memberId);
            if (person) {
                delete person.systemId;
            }
        });
        // Remove relationships involving the system
        root.relationships = root.relationships.filter(r => !(
            nodeRefEq(r.from, { type: "system", id: systemId }) ||
            nodeRefEq(r.to, { type: "system", id: systemId })
        ));
        // Remove system
        root.systems.splice(systemIndex, 1);
    }
};

// RELATIONSHIP

export const getRelationship = (root: PolyculeManifest, relationshipId: string) =>
    root.relationships.find(x => x.id == relationshipId) ?? null;

export const getRelationshipAB = (root: PolyculeManifest, a: NodeRef, b: NodeRef) => {
    return root.relationships.find(r => (
        (nodeRefEq(r.from, a) && nodeRefEq(r.to, b)) || (nodeRefEq(r.from, b) && nodeRefEq(r.to, a))
    )) ?? null;
};

export const getRelationshipsOfPerson = (root: PolyculeManifest, personId: string) =>
    root.relationships.filter(x => nodeRefEq(x.from, { type: "person", id: personId }) || nodeRefEq(x.to, { type: "person", id: personId }));

export const createRelationship = (root: PolyculeManifest, r: New<Relationship>) => {
    const id = randomId("r_");
    root.relationships.push({ id, ...r });
    return id;
};

export const updateRelationship = (root: PolyculeManifest, { id, ...r }: Patch<Relationship>) => {
    const relationship = root.relationships.find(x => x.id == id);
    if (relationship) {
        Object.assign(relationship, r);
    };
};

export const removeRelationship = (root: PolyculeManifest, relationshipId: string) => {
    const index = root.relationships.findIndex(x => x.id == relationshipId);
    if (index !== -1) {
        root.relationships.splice(index, 1);
    }
};




