import { useWindowEvent } from "@mantine/hooks";
import React, { useCallback, useState } from "react";
import { Vec2, vec2, vec2add, vec2average, vec2client, vec2div, vec2sub } from "@alan404/vec2";
import { getMouseButtons } from "../utils/index.js";
import { useGlobalTransform } from "./useGlobalTransform.js";
import { MouseEvents, TouchEvents } from "./events.js";

export interface UseRelativeDragOptions {
    position: Vec2;
    onDrag: (position: Vec2) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    scale?: number;
    disabled?: boolean;
    allowMultitouch?: boolean;
};

export interface UseRelativeDrag {
    isDragging: boolean;
    props: MouseEvents & TouchEvents;
};

type MouseEv = React.MouseEventHandler<any>;
type TouchEv = React.TouchEventHandler<any>;

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
    
    const [isDragging, _setIsDragging] = useState(false);
    const [startDragPosition, setStartDragPosition] = useState<Vec2>(vec2());
    const [start, setStart] = useState<Vec2>(vec2());

    const setIsDragging = (b: boolean) => {
        _setIsDragging((prev) => {
            if(prev == b) return prev;
            if(prev)
                onDragEnd?.();
            else
                onDragStart?.();
            return b;
        });
    };

    const onInputMove = useCallback((delta: Vec2) => {
        if (disabled) return;
        onDrag(vec2add(startDragPosition, vec2div(vec2sub(delta, start), scale || defaultScale)));
    }, [startDragPosition, disabled, start, scale]);

    useWindowEvent("keydown", (e) => {
        if(e.key == "Escape" && isDragging) setIsDragging(false);
    });

    const onMouseDown: MouseEv = useCallback((e) => {
        if (!getMouseButtons(e).left) return;
        if (disabled) return;
        e.stopPropagation();
        e.preventDefault();
        (document.activeElement as HTMLElement)?.blur();

        setIsDragging(true);
        setStart(vec2client(e));
        setStartDragPosition(position);
    }, [position]);

    useWindowEvent("mousemove", useCallback((e) => {
        if (!isDragging || disabled) return;
        if (!getMouseButtons(e).left) return setIsDragging(false);
        onInputMove(vec2client(e));
    }, [disabled, isDragging, scale]));

    const onMouseUp: MouseEv = useCallback((e) => {
        setIsDragging(false);
    }, []);

    const onTouchStart: TouchEv = useCallback((e) => {
        if (!e.touches.length) return; 
        if (e.touches.length !== 1 && !allowMultitouch) return setIsDragging(false); 
        e.preventDefault();
        e.stopPropagation();

        let touches = Array(e.touches.length).fill(0).map((_,i) => e.touches[i]!);
        setIsDragging(true);
        setStart(vec2average(touches.map(vec2client)));
        setStartDragPosition(position);
    }, [position]);

    const onTouchMove: TouchEv = useCallback((e) => {
        if (!isDragging) return;
        if (e.touches.length != 1 && !allowMultitouch) return setIsDragging(false);
        e.preventDefault();

        let touches = Array(e.touches.length).fill(0).map((_,i) => e.touches[i]!);
        onInputMove(vec2average(touches.map(vec2client)));
    }, [isDragging, position]);

    const onTouchEnd: TouchEv = useCallback((e) => {
        setIsDragging(false);
    }, []);

    const props = {
        onMouseDown,
        onMouseUp,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };

    return {
        isDragging,
        props,
    };
};
