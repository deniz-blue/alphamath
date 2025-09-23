import { JSX, useRef } from "react";
import { useElementEvent } from "../hooks/index.js";

export const NoPropagation = (props: JSX.IntrinsicElements["div"]) => {
    const ref = useRef<HTMLDivElement>(null);
    
    useElementEvent(ref, "mousedown", e => e.stopPropagation());
    useElementEvent(ref, "touchstart", e => e.stopPropagation());
    
    return (
        <div
            {...props}
            ref={ref}
        />
    )
};
