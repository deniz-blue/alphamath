import React, { PropsWithChildren, useContext } from "react";
import { GlobalTransform } from "../core/GlobalTransformContext.js";
import { mergeRefs, useElementSize } from "@mantine/hooks";

export type WorkspaceViewProps = PropsWithChildren<React.JSX.IntrinsicElements["svg"]>;

export const WorkspaceView = ({
    children,
    ref,
    ...props
}: WorkspaceViewProps) => {
    const { ref: sizeRef, height, width } = useElementSize();
    const { position, scale } = useContext(GlobalTransform);

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
        >
            <g>
                {children}
            </g>
        </svg>
    )
};
