import React, { useRef, useState } from "react";
import { vec2, Vec2, vec2abs, vec2add, vec2client, vec2distance, vec2div, vec2sub } from "@alan404/vec2";
import { useGlobalTransformStore } from "../core/globalTransformStore.js";
import { useElementEvent } from "../hooks/useElementEvent.js";

export interface UseRelativeDragOptions {
    onDrag: (delta: Vec2) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onClick?: () => void;
    scale?: number;
    disabled?: boolean;
    clickThreshold?: number;
};

export const useRelativeDrag = (
    ref: React.RefObject<Element | null>,
    {
        onDrag,
        onDragStart,
        onDragEnd,
        scale,
        disabled = false,
        clickThreshold = 4,
        onClick,
    }: UseRelativeDragOptions,
) => {
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;

    const [isDragging, setIsDragging] = useState(false);
    const lastPosRef = useRef<Vec2 | null>(null);
    const accumulatedPosRef = useRef<Vec2>(vec2());
    const activePointerId = useRef<number | null>(null);

    useElementEvent(ref, "pointerdown", (e) => {
        if (disabledRef.current) return;

        // Only track one pointer at a time (the first active one)
        if (activePointerId.current !== null) return;

        e.stopPropagation();
        e.preventDefault();
        ref.current?.setPointerCapture(e.pointerId);
        activePointerId.current = e.pointerId;
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
        onDragStart?.();
    }, []);

    useElementEvent(ref, "pointermove", (e) => {
        if (!isDragging) return;
        if (disabledRef.current || !lastPosRef.current) return;

        const client = vec2client(e);
        const clientDelta = vec2sub(client, lastPosRef.current);
        const delta = vec2div(clientDelta, scale ?? useGlobalTransformStore.getState().scale);

        lastPosRef.current = client;
        accumulatedPosRef.current = vec2add(accumulatedPosRef.current, delta);
        onDrag(delta);
    }, [isDragging]);

    const cancelDrag = () => {
        if (activePointerId.current) ref.current?.releasePointerCapture(activePointerId.current);
        activePointerId.current = null;
        setIsDragging(false);
        
        if (vec2distance(0, accumulatedPosRef.current) < clickThreshold) {
            onClick?.();
        }

        lastPosRef.current = null;
        activePointerId.current = null;
        accumulatedPosRef.current = vec2();
        onDragEnd?.();
    };

    useElementEvent(ref, "pointerup", (e) => {
        if (e.pointerId !== activePointerId.current) return;
        cancelDrag();
    }, []);

    useElementEvent(ref, "pointercancel", (e) => {
        if (e.pointerId !== activePointerId.current) return;
        cancelDrag();
    }, []);
};
