import { vec2add } from "@alan404/vec2";
import { useRelativeDrag } from "../gestures/index.js";
import { useRef } from "react";
import { mergeRefs } from "@mantine/hooks";
import { useTransform } from "../hooks/useTransform.js";

export type DragHandleProps = {
    onDragStart?: () => void;
    onDragEnd?: () => void;
    withCursor?: boolean;
    disabled?: boolean;
} & Omit<React.JSX.IntrinsicElements["g"], "onDragStart" | "onDragEnd">;

export const DragHandle = ({
    children,
    style,
    withCursor,
    onDragStart,
    onDragEnd,
    disabled,
    ref: _ref,
    ...props
}: DragHandleProps) => {
    const ref = useRef<SVGGElement>(null);
    const { position, setPosition } = useTransform();

    useRelativeDrag(ref, {
        disabled,
        onDrag: (delta) => {
            setPosition(vec2add(position, delta));
        },
        onDragStart,
        onDragEnd,
    });

    return (
        <g
            {...props}
            ref={mergeRefs(ref, _ref)}
            // data-dragging={isDragging}
            style={{
                // cursor: withCursor !== false ? (isDragging ? "grabbing" : "grab") : undefined,
                ...style,
            }}
        >
            {children}
        </g>
    )
};
