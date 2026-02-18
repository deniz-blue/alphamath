import { vec2, vec2average, vec2distance } from "@alan404/vec2";
import type { ComputeResult } from "../../lib/force";
import type { GraphNodeRef } from "../../lib/legacy-schema/legacy-types";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { OPTIONS } from "./options";

export const updateSVG = (
    svg: SVGSVGElement,
    result: ComputeResult,
) => {
    const state = usePolyculeStore.getState();

    const people = svg.querySelectorAll<SVGGElement>("g[data-type='person']");
    people.forEach(personEl => {
        const id = personEl.dataset.id;
        if (!id) return console.log("No id on person element", personEl);
        const person = state.getPerson(id);
        if (!person) return console.log("No person for id", id);
        const coords = result.people[person.id];
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
            (n.type === "person" ? result.people[n.id] : result.systems[n.id]) ?? vec2();

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
        const memberCoords = members.map(member => result.people[member.id])
            .filter(x => !!x);
        const avg = vec2average(memberCoords);
        let r = 0;
        for (let coord of memberCoords) {
            let dist = vec2distance(avg, coord);
            if (dist > r) r = dist;
        }

        r += OPTIONS.personRadius + OPTIONS.systemBackgroundPadding;

        sysEl.childNodes.forEach((el) => {
            if (el.nodeName == "circle") (el as SVGCircleElement).setAttribute("r", r.toString());
        });
        sysEl.setAttribute("transform", `translate(${avg.x}, ${avg.y})`);
    });
};
