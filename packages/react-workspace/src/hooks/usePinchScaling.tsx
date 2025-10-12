import React, { useRef, useState } from "react";
import { useElementEvent } from "./useElementEvent.js";
import { vec2, Vec2, vec2average, vec2client, vec2distance } from "@alan404/vec2";
import { useGlobalTransformStore } from "../core/globalTransformStore.js";

export const usePinchScaling = (
    ref: React.RefObject<Element | null>,
) => {
    const lastDistance = useRef<number>(null);

    useElementEvent(ref, "touchstart", (e) => {
        if (e.touches.length !== 2) return;
        e.preventDefault();
    }, [], { passive: false });

    useElementEvent(ref, "touchmove", (e) => {
        if (e.touches.length !== 2) return;
        let a = vec2client(e.touches[0]!);
        let b = vec2client(e.touches[1]!);
        const distance = vec2distance(a, b);
        let point = vec2average([a, b]);

        if (lastDistance.current !== null) {
            const scaleMultiplier = distance / lastDistance.current;
            const { fromScreenPosition, changeScaleFrom } = useGlobalTransformStore.getState();
            const coordPoint = fromScreenPosition(point);
            changeScaleFrom(coordPoint, scaleMultiplier);
        }

        lastDistance.current = distance;
    }, []);

    useElementEvent(ref, "touchend", (e) => {
        lastDistance.current = null;
    }, []);
};
