import React, { useCallback, useState } from "react";
import { useGlobalTransform } from "./useGlobalTransform.js";
import { useRelativeDrag } from "./useRelativeDrag.js";
import { useBoolean } from "./useBoolean.js";
import { vec2, Vec2, vec2add, vec2average, vec2client, vec2distance, vec2mul, vec2sub } from "@alan404/vec2";
import { useMousePosition } from "./useMousePosition.js";
import { MouseEvents, TouchEvents } from "./events.js";
import { mergeProps } from "../utils/index.js";

export interface UsePanningOptions {
    wheelScaleOn?: "cursor" | "window";
    onScalingStart?: () => void;
    onScalingEnd?: () => void;
};

export const usePanning = ({
    onScalingEnd,
    onScalingStart,
    wheelScaleOn,
}: UsePanningOptions = {}) => {
    const {
        position,
        setPosition,
        scale,
        setScale,
        minScale,
        maxScale,
        getAbsolutePosition,
    } = useGlobalTransform();

    const {
        isDragging: isPanning,
        props: dragProps,
    } = useRelativeDrag({
        position,
        onDrag: (pos, delta) => {
            console.log("Panning onDrag", pos, delta)
            setPosition(pos)
        },
        scale: 1,
    });

    const [isScaling, setIsScaling] = useBoolean(false, {
        onTrue: onScalingStart,
        onFalse: onScalingEnd,
    });
    const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);
    const [startDragPosition, setStartDragPosition] = useState<Vec2>(vec2());
    const [start, setStart] = useState<Vec2>(vec2());
    const [startScale, setStartScale] = useState(scale);
    const mouse = useMousePosition();

    const handleScaleChange = (
        scaleChange: number,
        point: Vec2,
    ) => {
        let newScale = Math.max(minScale, Math.min(maxScale, scale + scaleChange));
        setScale(newScale);
        setPosition(vec2sub(position, vec2mul(point, newScale - scale)));
    };

    const scalingProps: TouchEvents & MouseEvents = {
        onWheel: useCallback((e: React.WheelEvent<HTMLElement>) => {
            e.preventDefault();
            const scaleChange = (e.deltaY < 0 ? 1 : -1) * 0.1;
            const origin = wheelScaleOn == "cursor" ? mouse : getAbsolutePosition(vec2(window.innerWidth / 2, window.innerHeight / 2));
            handleScaleChange(scaleChange, origin);
        }, [mouse, position]),

        onTouchStart: useCallback((e: React.TouchEvent<HTMLElement>) => {
            if (e.touches.length !== 2) return;
            e.preventDefault();
            setStartScale(scale);
            setStart(vec2average([vec2client(e.touches[0]!), vec2client(e.touches[1]!)]));
            setStartDragPosition(position);
            setIsScaling(true);
        }, [scale, position]),

        onTouchMove: useCallback((e: React.TouchEvent<HTMLElement>) => {
            if (e.touches.length !== 2) return;
            let a = vec2client(e.touches[0]!);
            let b = vec2client(e.touches[1]!);
            const distance = vec2distance(a, b);
            let point = vec2average([a, b]);
    
            if (lastPinchDistance !== null) {
                const scaleChange = (distance - lastPinchDistance) / 500;
                let newScale = Math.max(minScale, Math.min(maxScale, scale + scaleChange));
                setScale(newScale);
    
                setPosition(vec2add(
                    startDragPosition,
                    vec2sub(point, start),
                    vec2mul(vec2sub(point, startDragPosition), startScale - newScale),
                ));
            }
    
            setLastPinchDistance(distance);
        }, [lastPinchDistance, position, start, startDragPosition]),

        onTouchEnd: useCallback(() => {
            setLastPinchDistance(null);
            setIsScaling(false);
        }, []),
    };

    const props = mergeProps(dragProps, scalingProps);
   
    return {
        isPanning,
        isScaling,
        props,
    };
};
