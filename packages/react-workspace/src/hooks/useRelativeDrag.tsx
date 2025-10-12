import React, { useRef, useState } from "react";
import { Vec2, vec2client, vec2div, vec2sub } from "@alan404/vec2";
import { useGlobalTransformStore } from "../core/globalTransformStore.js";
import { useElementEvent } from "./useElementEvent.js";

export interface UseRelativeDragOptions {
    onDrag: (delta: Vec2) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    scale?: number;
    disabled?: boolean;
};

export const useRelativeDrag = (
    ref: React.RefObject<Element | null>,
    {
        onDrag,
        onDragStart,
        onDragEnd,
        scale,
        disabled = false,
    }: UseRelativeDragOptions,
) => {
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;

    const [isDragging, setIsDragging] = useState(false);
    const lastPosRef = useRef<Vec2 | null>(null);
    const activePointerId = useRef<number | null>(null);

    useElementEvent(ref, "pointerdown", (e) => {
        if (disabledRef.current) return;

        // Only track one pointer at a time (the first active one)
        if (activePointerId.current !== null) return;

        // e.stopPropagation();
        ref.current?.setPointerCapture(e.pointerId);
        activePointerId.current = e.pointerId;
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        setIsDragging(true);
        onDragStart?.();
    }, []);

    useElementEvent(ref, "pointermove", (e) => {
        if (!isDragging || disabledRef.current || !lastPosRef.current) return;

        const client = vec2client(e);
        const clientDelta = vec2sub(client, lastPosRef.current);
        const delta = vec2div(clientDelta, scale ?? useGlobalTransformStore.getState().scale);

        lastPosRef.current = client;
        onDrag(delta);
    }, [isDragging]);

    const cancelDrag = () => {
        if (activePointerId.current) ref.current?.releasePointerCapture(activePointerId.current);
        activePointerId.current = null;
        setIsDragging(false);
        lastPosRef.current = null;
        activePointerId.current = null;
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
