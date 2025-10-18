import { PropsWithChildren, ReactNode, useRef } from "react";
import { BackgroundGrid } from "./BackgroundGrid.js";
import { WorkspaceView, WorkspaceViewProps } from "./WorkspaceView.js";
import { usePanning } from "../gestures/index.js";
import { mergeRefs } from "@mantine/hooks";
import { useWheelScaling } from "../gestures/useWheelScaling.js";
import { usePinchScaling } from "../gestures/usePinchScaling.js";

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
    const ref = useRef<SVGSVGElement>(null);

    useWheelScaling(ref);
    usePinchScaling(ref);
    usePanning(ref);

    return (
        <div className="large-viewport">
            {background ?? <BackgroundGrid />}
            <WorkspaceView
                {...viewProps}
                ref={mergeRefs(ref, viewProps?.ref)}
                style={{
                    // cursor: withCursor ? (isPanning ? "grabbing" : "all-scroll") : undefined,
                    ...viewProps?.style,
                }}
            >
                {children}
            </WorkspaceView>
        </div>
    )
};
