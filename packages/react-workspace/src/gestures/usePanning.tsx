import React from "react";
import { useGlobalTransformStore } from "../core/globalTransformStore.js";
import { useRelativeDrag } from "./useRelativeDrag.js";
import { useElementEvent } from "../hooks/useElementEvent.js";
import { vec2, vec2mul } from "@alan404/vec2";

export const usePanning = (
    ref: React.RefObject<Element | null>,
) => {
    useRelativeDrag(ref, {
        scale: 1,
        onDrag: (delta) => {
            useGlobalTransformStore.getState().moveBy(delta);
        },
    });

    useElementEvent(ref, "wheel", (e) => {
        if (e.ctrlKey) return;
        e.preventDefault();
        let delta = vec2mul(vec2(e.deltaX, e.deltaY), -1);
        useGlobalTransformStore.getState().moveBy(delta);
    })
};
