import { useCallback, useEffect, useRef, useState } from "react";
import { OPTIONS } from "./options";
import { compute, type ComputeResult } from "../../lib/force";
import { Workspace } from "@alan404/react-workspace";
import { vec2, vec2add, vec2distance, type Vec2 } from "@alan404/vec2";
import { usePolyculeStore } from "../../store/usePolyculeStore";
import { GraphRelationship } from "./svg/GraphRelationship";
import { GraphPerson } from "./svg/GraphPerson";
import { GraphSystem } from "./svg/GraphSystem";
import { updateSVG } from "./update-svg";
import { Information } from "./Information";
import { useGraphUIStore } from "./useGraphUIStore";

export const useComputedGraph = () => {
	const coordsRef = useRef<ComputeResult>(null);

	const updateCoordinates = useCallback(() => {
		if (useGraphUIStore.getState().mode == "link" && !!useGraphUIStore.getState().activeNodeIds.size) return;

		coordsRef.current = compute(usePolyculeStore.getState().root, coordsRef.current ?? undefined, {
			isDragging: !!useGraphUIStore.getState().activeNodeIds.size,
		});
	}, [compute]);

	return { coordsRef, updateCoordinates };
};

export const useGraphRendering = ({ coordsRef }: { coordsRef: React.RefObject<ComputeResult | null> }) => {
	const refSvg = useRef<SVGSVGElement>(null);

	const renderCoords = useCallback(() => {
		const svg = refSvg.current;
		if (!coordsRef.current || !svg) return;
		updateSVG(svg, coordsRef.current);
	}, []);

	return {
		refSvg,
		renderCoords,
	};
};

export const useDragNewLink = ({
	coordsRef,
}: {
	coordsRef: React.RefObject<ComputeResult | null>;
}) => {
	const newLinkCoord = useRef(vec2());

	const createOnDragHandler = useCallback((personId: string) => (delta: Vec2) => {
		if (useGraphUIStore.getState().mode == "link") {
			newLinkCoord.current = vec2add(
				newLinkCoord.current,
				delta,
			)
		} else {
			if (coordsRef.current)
				coordsRef.current.people[personId] = vec2add(
					coordsRef.current.people[personId],
					delta,
				);
		}
	}, []);

	const getLinkTargetId = useCallback(() => {
		if (!coordsRef.current) return null;
		const maxDist = 1.2 * OPTIONS.personRadius;
		const candidates = Object.entries(coordsRef.current.people)
			.map(([id, v]) => ({
				id,
				dist: vec2distance(newLinkCoord.current, v),
			}))
			.filter(x => x.dist < maxDist)
		return candidates[0]?.id ?? null;
	}, []);

	const createOnDragStateHandler = useCallback((personId: string) => (dragging: boolean) => {
		if (dragging) {
			useGraphUIStore.getState().activeNodeIds.add(personId);
			if (coordsRef.current)
				newLinkCoord.current = coordsRef.current.people[personId];
		} else {
			let targetId = getLinkTargetId();
			if (targetId) {
				const fromId = personId; // or compute from activeNodeIdsRef?
				usePolyculeStore.getState().addRelationship({
					from: { type: "person", id: fromId },
					to: { type: "person", id: targetId },
				})
			}

			useGraphUIStore.getState().activeNodeIds.delete(personId);
			newLinkCoord.current = vec2();
			useGraphUIStore.setState({ connectingNodeId: null });
		}
	}, []);

	const render = useCallback((svg: SVGSVGElement | null) => {
		if (!coordsRef.current || !svg) return;
		let newlink = svg.querySelector("line[data-type='newlink']")!;
		if (useGraphUIStore.getState().mode == "link" && !!useGraphUIStore.getState().activeNodeIds.size) {
			let fromId = useGraphUIStore.getState().activeNodeIds.values().next().value!;
			let from = coordsRef.current.people[fromId];
			let to = newLinkCoord.current;
			newlink.setAttribute("x1", from.x.toString());
			newlink.setAttribute("y1", from.y.toString());
			newlink.setAttribute("x2", to.x.toString());
			newlink.setAttribute("y2", to.y.toString());
			newlink.setAttribute("opacity", "1");

			useGraphUIStore.setState({ connectingNodeId: getLinkTargetId() });
		} else {
			newlink.setAttribute("opacity", "0");
		}
	}, []);

	return {
		createOnDragHandler,
		createOnDragStateHandler,
		render,
	};
};

export const PolyculeGraphView = () => {
	const root = usePolyculeStore(store => store.root);

	const { coordsRef, updateCoordinates } = useComputedGraph();
	const { refSvg, renderCoords } = useGraphRendering({ coordsRef });

	const connectingNodeId = useGraphUIStore(store => store.connectingNodeId);

	const {
		createOnDragHandler,
		createOnDragStateHandler,
		render: renderNewLink,
	} = useDragNewLink({ coordsRef });

	useEffect(() => {
		let f: number;
		const loop = () => {
			f = requestAnimationFrame(loop);
			updateCoordinates();
			renderCoords();
			renderNewLink(refSvg.current);
		};
		f = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(f);
	}, [renderCoords, updateCoordinates, renderNewLink]);

	return (
		<Workspace
			viewProps={{ ref: refSvg }}
		>
			<defs>
				<clipPath id="avatarClip">
					<circle
						r={OPTIONS.personRadius}
					/>
				</clipPath>
			</defs>

			{root.people.length === 0 && (
				<Information />
			)}

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
					highlight={connectingNodeId == person.id}
					onDrag={createOnDragHandler(person.id)}
					onDragState={createOnDragStateHandler(person.id)}
				/>
			))}

			<line
				data-type="newlink"
				stroke={OPTIONS.linkDefaultColor}
				strokeWidth={OPTIONS.linkDefaultWidth}
				strokeLinecap="round"
			/>
		</Workspace>
	);
};

