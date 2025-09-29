import React, { forwardRef, PropsWithChildren, useContext } from "react";
import { GlobalTransform } from "../core/GlobalTransformContext.js";

export type WorkspaceViewProps = PropsWithChildren<React.JSX.IntrinsicElements["svg"]>;

export const WorkspaceView = ({
    children,
    ref,
    ...props
}: WorkspaceViewProps) => {
    const { position, scale } = useContext(GlobalTransform);

    return (
        <svg
            {...props}
            ref={ref}
            width="100%"
            height="100%"
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
            <g
                transform={`translate(${position.x}, ${position.y}) scale(${scale})`}
            >
                {children}
            </g>
        </svg>
    )
};
