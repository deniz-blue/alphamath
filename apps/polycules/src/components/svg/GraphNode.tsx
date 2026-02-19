import { Menu } from "@mantine/core";
import { useCallback, useRef, useState } from "react";
import { useGraphTheme } from "./useGraphTheme";
import type { Vec2 } from "@alan404/vec2";
import { useRendering } from "../../lib/rendering/useRenderingStore";
import { useRelativeDrag } from "@alan404/react-workspace/gestures";
import { useGraphUIStore } from "../../lib/useGraphUIStore";
import { useCoordsStore } from "../../lib/rendering/useRenderer";

export interface GraphNodeProps {
	nodeId: string;
	color?: string;
	avatarUrl?: string;
	primaryName?: string;
	secondaryName?: string;
	dropdown?: React.ReactNode;
}

export const GraphNode = ({
	nodeId,
	color,
	avatarUrl,
	primaryName,
	secondaryName,
	dropdown,
}: GraphNodeProps) => {
	const ref = useRef<SVGGElement>(null);
	const [opened, setOpened] = useState(false);
	const theme = useGraphTheme();

	useRelativeDrag(ref, {
		onDrag: (delta) => {
			useCoordsStore.setState((state) => {
				if (!state.coords) return;
				let node = state.coords.nodes[nodeId as any];
				if (!node) node = state.coords.nodes[nodeId as any] = { x: 0, y: 0 };
				node.x += delta.x;
				node.y += delta.y;
			});
		},
		onDragStart: () => useGraphUIStore.getState().activateNode(nodeId),
		onDragEnd: () => useGraphUIStore.getState().deactivateNode(nodeId),
		onClick: () => setOpened((o) => !o),
	});

	const render = useCallback((vec: Vec2) => {
		if (!ref.current) return;
		ref.current.setAttribute("transform", `translate(${vec.x}, ${vec.y})`);
	}, [ref]);

	useRendering(nodeId, render);

	return (
		<g
			data-type="node"
			data-id={nodeId}
			style={{ cursor: "pointer" }}
			onPointerDown={e => e.stopPropagation()}
			ref={ref}
		>
			<Menu
				withArrow
				hideDetached={false}
				offset={theme.nodePadding}
				shadow="md"
				position="top"
				arrowSize={12}
				opened={opened}
				onChange={setOpened}
				closeOnClickOutside
				withOverlay
				overlayProps={{
					opacity: 0,
				}}
			>
				<g>
					<Menu.Target>
						<circle
							fill={color ?? theme.nodeColor}
							r={theme.nodeSize / 2}
						/>
					</Menu.Target>

					<clipPath id={`avatarClip-${nodeId}`}>
						<circle
							r={theme.nodeSize / 2}
						/>
					</clipPath>

					{avatarUrl && (
						<image
							href={avatarUrl}
							x={-theme.nodeSize / 2}
							y={-theme.nodeSize / 2}
							width={theme.nodeSize}
							height={theme.nodeSize}
							clipPath={`url(#avatarClip-${nodeId})`}
							preserveAspectRatio="xMidYMid slice"
							pointerEvents="none"
						/>
					)}
				</g>

				<Menu.Dropdown
					fz="sm"
				>
					{dropdown}
				</Menu.Dropdown>
			</Menu>

			<text
				textAnchor="middle"
				y={theme.nodeSize/2 + theme.nodePadding + theme.primaryTextSize}
				fontSize={theme.primaryTextSize}
				fill={theme.primaryTextColor}
				pointerEvents="none"
			>
				{primaryName ?? ""}
			</text>

			{secondaryName && (
				<text
					textAnchor="middle"
					y={theme.nodeSize/2 + theme.nodePadding + theme.primaryTextSize + theme.nodePadding + theme.secondaryTextSize}
					fontSize={theme.secondaryTextSize}
					fill={theme.secondaryTextColor}
					pointerEvents="none"
				>
					{secondaryName ?? ""}
				</text>
			)}
		</g>
	);
};
