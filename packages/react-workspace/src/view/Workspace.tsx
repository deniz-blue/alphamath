import React, { forwardRef, PropsWithChildren, ReactNode, useImperativeHandle, useRef } from "react";
import { BackgroundGrid } from "./BackgroundGrid.js";
import { WorkspaceView } from "./WorkspaceView.js";
import { usePanning } from "../hooks/index.js";

export interface WorkspaceProps extends PropsWithChildren {
    background?: ReactNode;
    withCursor?: boolean;
}

export const Workspace = ({
    background,
    children,
    ref,
    withCursor = true,
}: WorkspaceProps & React.JSX.IntrinsicElements["svg"]) => {
    const { isPanning, props } = usePanning();

    return (
        <div>
            {background ?? <BackgroundGrid />}
            <WorkspaceView
                ref={ref}
                {...props}
                style={{
                    cursor: withCursor ? (isPanning ? "grabbing" : "all-scroll") : undefined,
                }}
            >
                {children}
            </WorkspaceView>
        </div>
    )
};
