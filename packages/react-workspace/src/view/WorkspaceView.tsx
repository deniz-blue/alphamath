import React, { PropsWithChildren, useContext, useEffect } from "react";
import { mergeRefs, useElementSize } from "@mantine/hooks";
import { useGlobalTransformStore } from "../core/globalTransformStore.js";

export type WorkspaceViewProps = PropsWithChildren<React.JSX.IntrinsicElements["svg"]>;

export const WorkspaceView = ({
	children,
	ref,
	...props
}: WorkspaceViewProps) => {
	const { ref: sizeRef, height, width } = useElementSize();
	const position = useGlobalTransformStore(store => store.position);
	const scale = useGlobalTransformStore(store => store.scale);

	return (
		<svg
			{...props}
			ref={mergeRefs(ref, sizeRef)}
			width="100%"
			height="100%"
			viewBox={[
				(-position.x) / scale,
				(-position.y) / scale,
				width / scale,
				height / scale,
			].join(" ")}
			style={{
				overflow: "hidden",
				position: "fixed",
				width: "100%",
				height: "100%",
				display: "block",
				touchAction: "none",
				...(props.style || {}),
			}}
			className={"workspace-view " + (props.className ?? "")}
		>
			<g>
				{children}
			</g>
		</svg>
	)
};
