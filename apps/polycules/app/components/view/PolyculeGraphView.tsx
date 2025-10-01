import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { OPTIONS } from "./options";
import { compute, type ComputeResult } from "../../lib/force";
import { Workspace } from "@alan404/react-workspace";
import type { GraphNodeRef, Person, PolyculeManifest } from "../../lib/types";
import { vec2, vec2add, vec2average, vec2distance } from "@alan404/vec2";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { GraphRelationship } from "./svg/GraphRelationship";
import { GraphPerson } from "./svg/GraphPerson";
import { GraphSystem } from "./svg/GraphSystem";

export const PolyculeGraphView = () => {
    const root = usePolyculeStore(store => store.root);
    const ref = useRef<SVGSVGElement>(null);
    const coordsRef = useRef<ComputeResult>(null);

    const updateCoordinates = useCallback(() => {
        coordsRef.current = compute(usePolyculeStore.getState().root, coordsRef.current ?? undefined);
    }, [compute]);

    const renderCoords = useCallback(() => {
        if (!coordsRef.current) return;
        const svg = ref.current;
        if (!svg) return;

        const state = usePolyculeStore.getState();

        const people = svg.querySelectorAll<SVGGElement>("g[data-type='person']");
        people.forEach(personEl => {
            const id = personEl.dataset.id;
            if (!id) return console.log("No id on person element", personEl);
            const person = state.getPerson(id);
            if (!person) return console.log("No person for id", id);
            const coords = coordsRef.current?.people[person.id];
            if (!coords) return console.log("No coords for person", person);
            personEl.setAttribute("transform", `translate(${coords.x}, ${coords.y})`);
        });

        const relationships = svg.querySelectorAll<SVGLineElement>("line[data-type='relationship']");
        relationships.forEach(relEl => {
            const id = relEl.dataset.id;
            if (!id) return console.log("No id on relationship element", relEl);
            const rel = state.getRelationship(id);
            if (!rel) return console.log("No relationship for id", id);

            const getRefCoord = (n: GraphNodeRef) =>
                (n.type === "person" ? coordsRef.current?.people[n.id] : coordsRef.current?.systems[n.id]) ?? vec2();

            const from = getRefCoord(rel.from);
            const to = getRefCoord(rel.to);

            relEl.setAttribute("x1", from.x.toString());
            relEl.setAttribute("y1", from.y.toString());
            relEl.setAttribute("x2", to.x.toString());
            relEl.setAttribute("y2", to.y.toString());
        });

        const systems = svg.querySelectorAll<SVGLineElement>("g[data-type='system']");
        systems.forEach(sysEl => {
            const id = sysEl.dataset.id;
            if (!id) return console.log("No id on system element", sysEl);
            const sys = state.getSystem(id);
            if (!sys) return console.log("No system for id", id);

            const members = state.getMembersOfSystem(id);
            const memberCoords = members.map(member => coordsRef?.current?.people[member.id])
                .filter(x => !!x);
            const avg = vec2average(memberCoords);
            let r = 0;
            for(let coord of memberCoords) {
                let dist = vec2distance(avg, coord);
                if(dist > r) r = dist;
            }

            r += OPTIONS.personRadius + OPTIONS.systemBackgroundPadding;

            sysEl.childNodes.forEach((el) => {
                if(el.nodeName == "circle") (el as SVGCircleElement).setAttribute("r", r.toString());
            });
            sysEl.setAttribute("transform", `translate(${avg.x}, ${avg.y})`);
        });
    }, []);

    useEffect(() => {
        let i = setInterval(() => {
            updateCoordinates();
            renderCoords();
        }, 100); // TODO: debug interval
        return () => clearInterval(i);
    }, [renderCoords, updateCoordinates]);

    return (
        <div
            style={{ width: "100vw", height: "100vh" }}
        >
            <Workspace
                viewProps={{ ref }}
            >
                <defs>
                    <clipPath id="avatarClip">
                        <circle
                            r={OPTIONS.personRadius}
                        />
                    </clipPath>
                </defs>

                {root.systems.map(system => (
                    <GraphSystem
                        key={system.id}
                        system={system}
                    />
                ))}

                {root.relationships.map(rel => (
                    <GraphRelationship
                        key={rel.id}
                        relationship={rel}
                    />
                ))}

                {root.people.map(person => (
                    <GraphPerson
                        key={person.id}
                        person={person}
                        onDrag={(newPos, delta) => {
                            console.log("PersonDrag<"+person.id+">", newPos, delta);
                            if(coordsRef.current)
                                coordsRef.current.people[person.id] = vec2add(
                                    coordsRef.current.people[person.id],
                                    delta,
                                );
                        }}
                    />
                ))}
            </Workspace>
        </div >
    );
};





