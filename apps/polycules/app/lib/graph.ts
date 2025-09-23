import type { Person, PolyculeManifest, Relationship, System } from "./types";

export type New<T> = Omit<T, "id">;
export type Patch<T> = Partial<T> & { id: string };

export const fromTo = (a: [string, string]) => {
    const [from, to] = a.sort();
    return {
        from,
        to,
    };
};

export const normalizeFromTo = (r: Relationship): Relationship => {
    const { from, to } = fromTo([r.from, r.to]);
    r.from = from;
    r.to = to;
    return r;
};

const randomId = (prefix = ""): string => prefix + Math.random().toString(36).slice(2).toString();

export const createPolyculeManifest = (): PolyculeManifest => ({
    v: 1,
    people: [],
    systems: [],
    relationships: [],
    groupRelationships: [],
});

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
};

export const addSystem = (root: PolyculeManifest, s: New<System>) => {
    const id = randomId("s_");

    root.systems.push({
        id,
        ...s,
    });
};

export const updatePerson = (root: PolyculeManifest, { id, ...p }: Patch<Person>) => {
    const person = root.people.find(x => x.id == id);
    if (person) {
        Object.assign(person, p);
    };
};

export const updateSystem = (root: PolyculeManifest, { id, ...s }: Patch<System>) => {
    const system = root.systems.find(x => x.id == id);
    if (system) {
        Object.assign(system, s);
    };
};

export const createRelationship = (root: PolyculeManifest, r: New<Relationship>) => {
    const id = randomId("r_");
    const relationship = { id, ...r };
    normalizeFromTo(relationship);
    root.relationships.push(relationship);
};

export const getRelationshipAB = (root: PolyculeManifest, a: string, b: string) => {
    const { from, to } = fromTo([a, b]);
    return root.relationships.find(r => r.from == from && r.to == to) ?? null;
};

export const getRelationshipsOfPerson = (root: PolyculeManifest, personId: string) =>
    root.relationships.filter(x => x.from == personId || x.to == personId);

export const getPerson = (root: PolyculeManifest, personId: string) =>
    root.people.find(x => x.id == personId) ?? null;

export const getSystem = (root: PolyculeManifest, systemId: string) =>
    root.systems.find(x => x.id == systemId) ?? null;

export const getMembersOfSystem = (root: PolyculeManifest, systemId: string) =>
    getSystem(root, systemId)?.memberIds.map(memberId => getPerson(root, memberId)).filter(x => !!x) ?? [];
