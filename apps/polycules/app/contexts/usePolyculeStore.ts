import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { temporal } from "zundo";
import { TEST_MANIFEST } from "./data";
import type { Actions, State } from "./store.type";
import type { NodeRef } from "../lib/types";

const randomId = (prefix = ""): string => prefix + Math.random().toString(36).slice(2).toString();

const nodeRefEq = (a: NodeRef, b: NodeRef) => a.type == b.type && a.id == b.id;

export const usePolyculeStore = create<State & Actions>()(
    temporal(
        immer((set, get) => ({
            root: TEST_MANIFEST,

            getPerson: (personId) => 
                get().root.people.find(x => x.id == personId) ?? null,
            getSystem: (systemId) =>
                get().root.systems.find(x => x.id == systemId) ?? null,
            getMembersOfSystem: (systemId) =>
                get().getSystem(systemId)?.memberIds.map(memberId => get().getPerson(memberId)).filter(x => !!x) ?? [],

            addPerson: (p) => {
                const id = randomId("p_");
                set(state => {
                    state.root.people.push({ id, ...p });

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
                set(state => {
                    const systemIndex = state.root.systems.findIndex(x => x.id == systemId);
                    if (systemIndex !== -1) {
                        const system = state.root.systems[systemIndex];
                        // Remove members' systemId
                        state.root.people.forEach(person => {
                            if (person.systemId === systemId) {
                                person.systemId = undefined;
                            }
                        });
                        // Remove relationships
                        state.root.relationships = state.root.relationships.filter(r => !(
                            (r.from.type === "system" && r.from.id === systemId) ||
                            (r.to.type === "system" && r.to.id === systemId)
                        ));
                        // Remove system
                        state.root.systems.splice(systemIndex, 1);
                    }
                });
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
        }))
    )
);
