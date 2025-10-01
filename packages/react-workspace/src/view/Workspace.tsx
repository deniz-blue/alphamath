import { PropsWithChildren, ReactNode } from "react";
import { BackgroundGrid } from "./BackgroundGrid.js";
import { WorkspaceView, WorkspaceViewProps } from "./WorkspaceView.js";
import { usePanning } from "../hooks/index.js";

export interface WorkspaceProps extends PropsWithChildren {
    background?: ReactNode;
    withCursor?: boolean;
    viewProps?: WorkspaceViewProps;
}

export const Workspace = ({
    background,
    children,
    withCursor = true,
    viewProps,
}: WorkspaceProps) => {
    const { isPanning, props } = usePanning();

    return (
        <div>
            {background ?? <BackgroundGrid />}
            <WorkspaceView
                {...props}
                {...viewProps}
                style={{
                    cursor: withCursor ? (isPanning ? "grabbing" : "all-scroll") : undefined,
                }}
            >
                {children}
            </WorkspaceView>
        </div>
    )
};
