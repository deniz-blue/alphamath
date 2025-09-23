import React, { forwardRef, PropsWithChildren, useContext } from "react";
import { GlobalTransform } from "../core/GlobalTransformContext.js";

export type WorkspaceViewProps = PropsWithChildren & React.JSX.IntrinsicElements["div"];

export const WorkspaceView = forwardRef<HTMLDivElement, WorkspaceViewProps>(({
    children,
    ...props
}, ref) => {
    const { position, scale } = useContext(GlobalTransform);

    return (
        <div
            {...props}
            ref={ref}
            style={{
                overflow: "hidden",
                position: "fixed",
                width: "100%",
                height: "100%",
                ...(props.style || {}),
            }}
        >
            <div
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            >
                {children}
            </div>
        </div>
    )
})
