import React from "react";
import { useElementEvent } from "../hooks/useElementEvent.js";
import { useGlobalTransformStore } from "../core/globalTransformStore.js";
import { vec2client } from "@alan404/vec2";

export const useWheelScaling = (
    ref: React.RefObject<Element | null>,
) => {
    useElementEvent(ref, "wheel", (e) => {
        if(e.ctrlKey && e.deltaMode == e.DOM_DELTA_PIXEL) {
            // Trackpad 2-finger pinching
            e.preventDefault();
            const scaleMultiplier = 1 - (e.deltaY * 0.01);
            const { fromScreenPosition, changeScaleFrom } = useGlobalTransformStore.getState();
            const pos = fromScreenPosition(vec2client(e));
            changeScaleFrom(pos, scaleMultiplier);
        } else if(e.deltaMode == e.DOM_DELTA_LINE || e.deltaMode == e.DOM_DELTA_PAGE) {
            // Mousewheel zooming
            const scaleMultiplier = 1 - (e.deltaY * 0.05);
            const { fromScreenPosition, changeScaleFrom } = useGlobalTransformStore.getState();
            const pos = fromScreenPosition(vec2client(e));
            changeScaleFrom(pos, scaleMultiplier);
        }
    }, [], { passive: false });
};
