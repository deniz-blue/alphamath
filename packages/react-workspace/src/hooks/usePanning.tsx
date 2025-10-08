import React, { useCallback, useState } from "react";
import { useRelativeDrag } from "./useRelativeDrag.js";
import { useBoolean } from "./useBoolean.js";
import { vec2, Vec2, vec2add, vec2average, vec2client, vec2distance, vec2mul, vec2sub } from "@alan404/vec2";
import { useMousePosition } from "./useMousePosition.js";
import { ReactEventHandlers } from "./events.js";
import { mergeProps } from "../utils/index.js";
import { useGlobalTransformStore } from "../core/globalTransformStore.js";
import { combineEventHandlerProps } from "../utils/combineEventHandlers.js";

export interface UsePanningOptions {
    wheelScaleOn?: "cursor" | "window";
    onScalingStart?: () => void;
    onScalingEnd?: () => void;
};

export const usePanning = ({
    onScalingEnd,
    onScalingStart,
    wheelScaleOn = "cursor",
}: UsePanningOptions = {}) => {
    const {
        isDragging: isPanning,
        props: dragEvents,
    } = useRelativeDrag({
        position: () => useGlobalTransformStore.getState().position,
        onDrag: (pos, delta) => {
            useGlobalTransformStore.getState().setPosition(pos);
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
    const [startScale, setStartScale] = useState(useGlobalTransformStore.getState().scale);
    const mouse = useMousePosition();

    const handleScaleChange = (
        scaleChange: number,
        point: Vec2 | null,
    ) => {
        const { scale, setScale, setPosition, position } = useGlobalTransformStore.getState();
        let newScale = scale + scaleChange;
        setScale(newScale);
        setPosition(vec2sub(position, vec2mul(point || position, newScale)));
    };

    const scaleEvents: ReactEventHandlers<"onWheel" | "onTouchStart" | "onTouchMove" | "onTouchEnd"> = {
        onWheel: useCallback((e: React.WheelEvent<Element>) => {
            e.preventDefault();
            const scaleMultiplier = e.deltaY < 0 ? 1.1 : 0.9;
            const { fromScreenPosition, changeScaleFrom } = useGlobalTransformStore.getState();
            const coordPoint = fromScreenPosition(vec2client(e));
            console.log("pt", coordPoint, e)
            changeScaleFrom(coordPoint, scaleMultiplier);
        }, [mouse, wheelScaleOn]),

        onTouchStart: useCallback((e: React.TouchEvent<Element>) => {
            if (e.touches.length !== 2) return;
            e.preventDefault();
            setStart(vec2average([vec2client(e.touches[0]!), vec2client(e.touches[1]!)]));
            setStartScale(useGlobalTransformStore.getState().scale);
            setStartDragPosition(useGlobalTransformStore.getState().position);
            setIsScaling(true);
        }, []),

        onTouchMove: useCallback((e: React.TouchEvent<HTMLElement>) => {
            if (e.touches.length !== 2) return;
            let a = vec2client(e.touches[0]!);
            let b = vec2client(e.touches[1]!);
            const distance = vec2distance(a, b);
            let point = vec2average([a, b]);

            if (lastPinchDistance !== null) {
                const scaleMultiplier = distance / lastPinchDistance;
                const { fromScreenPosition, changeScaleFrom } = useGlobalTransformStore.getState();
                const coordPoint = fromScreenPosition(point);
                changeScaleFrom(coordPoint, scaleMultiplier);
            }

            setLastPinchDistance(distance);
        }, [lastPinchDistance]),

        onTouchEnd: useCallback(() => {
            setLastPinchDistance(null);
            setIsScaling(false);
        }, []),
    };

    // const props =
    //     combineEventHandlerProps([dragEvents, scaleEvents]);

    return {
        isPanning,
        isScaling,
        props: { ...dragEvents, ...scaleEvents },
    };
};
