import React from "react";
import { useElementEvent } from "../hooks/useElementEvent.js";
import { useGlobalTransformStore } from "../core/globalTransformStore.js";
import { vec2client } from "@alan404/vec2";

export const useWheelScaling = (
    ref: React.RefObject<Element | null>,
) => {
    useElementEvent(ref, "wheel", (e) => {
        e.preventDefault();
        const scaleMultiplier = e.deltaY < 0 ? 1.1 : 0.9;
        const { fromScreenPosition, changeScaleFrom } = useGlobalTransformStore.getState();
        changeScaleFrom(fromScreenPosition(vec2client(e)), scaleMultiplier);
    }, [], { passive: false });
};
