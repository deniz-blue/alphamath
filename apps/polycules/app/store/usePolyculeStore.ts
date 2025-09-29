import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { temporal } from "zundo";
import { DEFAULT_MANIFEST } from "./data";
import type { Actions, State } from "./store.type";
import type { GraphNodeRef } from "../lib/types";

const randomId = (prefix = ""): string => prefix + Math.random().toString(36).slice(2).toString();

export const nodeRefEq = (a: GraphNodeRef, b: GraphNodeRef) => a.type == b.type && a.id == b.id;

export const usePolyculeStore = create<State & Actions>()(
    temporal(
        immer((set, get) => ({
            root: DEFAULT_MANIFEST,

            getPerson: (personId) =>
                get().root.people.find(x => x.id == personId) ?? null,
            getSystem: (systemId) =>
                get().root.systems.find(x => x.id == systemId) ?? null,

            getNode: (ref) => {
                if (ref.type == "person") {
                    let data = get().getPerson(ref.id);
                    if (!data) return null;
                    return { type: "person", data };
                };

                if (ref.type == "system") {
                    let data = get().getSystem(ref.id);
                    if (!data) return null;
                    return { type: "person", data };
                };

                return null;
            },

            getMembersOfSystem: (systemId) => {
                const root = get().root;
                const system = root.systems.find(s => s.id == systemId);
                if (!system) return [];
                return root.people.filter(p => system.memberIds.includes(p.id));
            },

            addPerson: (p) => {
                const id = randomId("p_");
                set(state => {
                    state.root.people.push({ ...p, id });

                    if (p.systemId) {
                        const system = state.root.systems.find(s => s.id == p.systemId);
                        if (system) system.memberIds.push(id);
                    }
                });
                return id;
            },

            updatePerson: ({ id, ...p }) => {
                set(state => {
                    const person = state.root.people.find(x => x.id == id);
                    if (person) {
                        Object.assign(person, p);
                    };
                });
            },

            removePerson: (personId) => {
                set(state => {
                    const personIndex = state.root.people.findIndex(x => x.id == personId);
                    if (personIndex !== -1) {
                        const person = state.root.people[personIndex];
                        // Remove from system
                        if (person.systemId) {
                            const system = state.root.systems.find(s => s.id == person.systemId);
                            if (system) {
                                system.memberIds = system.memberIds.filter(id => id !== personId);
                            }
                        }
                        // Remove relationships
                        state.root.relationships = state.root.relationships.filter(r => !(
                            (r.from.type === "person" && r.from.id === personId) ||
                            (r.to.type === "person" && r.to.id === personId)
                        ));
                        // Remove person
                        state.root.people.splice(personIndex, 1);
                    }
                });
            },

            addSystem: (s) => {
                const id = randomId("s_");
                set(state => {
                    state.root.systems.push({
                        id,
                        ...s,
                    });
                });
                return id;
            },
            
            updateSystem: ({ id, ...s }) => {
                set(state => {
                    const system = state.root.systems.find(x => x.id == id);
                    if (system) {
                        Object.assign(system, s);
                    };
                });
            },

            removeSystem: (systemId) => {
                let system = get().getSystem(systemId);
                if(!system) return;

                let rels = get().getRelationshipsOfNode({
                    type: "system",
                    id: systemId,
                });

                for(let rel of rels) get().removeRelationship(rel.id);
                for(let personId of system.memberIds) get().removePerson(personId);

                set(state => {
                    const systemIndex = state.root.systems.findIndex(x => x.id == systemId);
                    if (systemIndex !== -1)
                        state.root.systems.splice(systemIndex, 1);
                });
            },

            unlinkSystem: (systemId) => {
                let system = get().getSystem(systemId);
                if(!system) return;
                for(let memberId of system.memberIds) get().removePersonFromSystem(memberId, systemId);
                get().removeSystem(systemId);
            },

            addPersonToSystem(personId, systemId) {
                set(state => {
                    let system = state.root.systems.find(x => x.id == systemId);
                    if (!system?.memberIds.includes(personId)) system?.memberIds.push(personId);
                    let person = state.root.people.find(x => x.id == personId);
                    if (person) person.systemId = systemId;
                })
            },

            removePersonFromSystem(personId, systemId) {
                set(state => {
                    let system = state.root.systems.find(x => x.id == systemId);
                    if (system) system.memberIds = system.memberIds.filter(x => x !== personId);
                    let person = state.root.people.find(x => x.id == personId);
                    if (person) person.systemId = undefined;
                })
            },

            getRelationship: (relationshipId) => {
                return get().root.relationships.find(x => x.id == relationshipId) ?? null;
            },
            getRelationshipsOfNode: (node) => {
                return get().root.relationships.filter(r =>
                    (r.from.type === node.type && r.from.id === node.id) ||
                    (r.to.type === node.type && r.to.id === node.id)
                );
            },
            addRelationship: (r) => {
                const id = randomId("r_");
                set(state => {
                    state.root.relationships.push({
                        id,
                        ...r,
                    });
                });
                return id;
            },
            updateRelationship: ({ id, ...r }) => {
                set(state => {
                    const relationship = state.root.relationships.find(x => x.id == id);
                    if (relationship) {
                        Object.assign(relationship, r);
                    };
                });
            },
            removeRelationship: (id) => {
                set(state => {
                    state.root.relationships = state.root.relationships.filter(x => x.id !== id);
                });
            },

            addGroupRelationship: (gr) => {
                const id = randomId("gr_");
                set(state => {
                    state.root.groupRelationships.push({ id, ...gr });
                });
                return id;
            },
            updateGroupRelationship: ({ id, ...gr }) => {
                set(state => {
                    const groupRelationship = state.root.groupRelationships.find(x => x.id == id);
                    if (groupRelationship) {
                        Object.assign(groupRelationship, gr);
                    };
                });
            },
            removeGroupRelationship: (id) => {
                set(state => {
                    state.root.groupRelationships = state.root.groupRelationships.filter(x => x.id !== id);
                });
            },
        })),
    )
);
