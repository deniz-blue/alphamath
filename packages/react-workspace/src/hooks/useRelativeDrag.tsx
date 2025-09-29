import { useWindowEvent } from "@mantine/hooks";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Vec2, vec2, vec2add, vec2average, vec2client, vec2div, vec2sub } from "@alan404/vec2";
import { getMouseButtons } from "../utils/index.js";
import { useGlobalTransform } from "./useGlobalTransform.js";
import { MouseEvents, TouchEvents } from "./events.js";

export interface UseRelativeDragOptions {
    position: Vec2;
    onDrag: (newPosition: Vec2, delta: Vec2) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    scale?: number;
    disabled?: boolean;
    allowMultitouch?: boolean;
};

export interface UseRelativeDrag {
    isDragging: boolean;
    props: React.DOMAttributes<Element>;
};

export const useRelativeDrag = (
    {
        position,
        onDrag,
        onDragStart,
        onDragEnd,
        scale,
        disabled = false,
        allowMultitouch = false,
    }: UseRelativeDragOptions,
): UseRelativeDrag => {
    const { scale: defaultScale } = useGlobalTransform();


    const [isDragging, setIsDragging] = useState(false);
    const lastPosRef = useRef<Vec2 | null>(null);
    const activePointerId = useRef<number | null>(null);

    const endDrag = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            lastPosRef.current = null;
            activePointerId.current = null;
            onDragEnd?.();
        }
    }, [isDragging, onDragEnd]);

    const handleMove = useCallback((client: Vec2) => {
        if (!isDragging || disabled || !lastPosRef.current) return;

        const clientDelta = vec2sub(client, lastPosRef.current);
        const delta = vec2div(clientDelta, scale || defaultScale);
        
        lastPosRef.current = client;
        onDrag(vec2add(position, delta), delta);
    }, [isDragging, disabled, position, onDrag, scale]);

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (disabled) return;

            // Only track one pointer at a time (the first active one)
            if (activePointerId.current !== null) return;

            // e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            activePointerId.current = e.pointerId;
            lastPosRef.current = { x: e.clientX, y: e.clientY };
            setIsDragging(true);
            onDragStart?.();
        },
        [disabled, onDragStart]
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (disabled) return;
            if (e.pointerId !== activePointerId.current) return;
            handleMove(vec2client(e));
        },
        [disabled, handleMove]
    );

    const handlePointerUpOrCancel = useCallback(
        (e: React.PointerEvent) => {
            if (e.pointerId !== activePointerId.current) return;
            e.currentTarget.releasePointerCapture(e.pointerId);
            endDrag();
        },
        [endDrag]
    );

    const props = {
        onPointerDown: handlePointerDown,
        onPointerMove: handlePointerMove,
        onPointerUp: handlePointerUpOrCancel,
        onPointerCancel: handlePointerUpOrCancel,
    };

    return {
        isDragging,
        props,
    };
};
