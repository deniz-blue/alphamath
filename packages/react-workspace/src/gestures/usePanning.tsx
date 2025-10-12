import React from "react";
import { useGlobalTransformStore } from "../core/globalTransformStore.js";
import { useRelativeDrag } from "./useRelativeDrag.js";

export const usePanning = (
    ref: React.RefObject<Element | null>,
) => {
    useRelativeDrag(ref, {
        scale: 1,
        onDrag: (delta) => {
            useGlobalTransformStore.getState().moveBy(delta);
        },
    });
};
