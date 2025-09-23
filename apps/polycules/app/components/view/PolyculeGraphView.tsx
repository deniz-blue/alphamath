import { useEffect, useRef } from "react";
import { usePolycule } from "../../contexts/PolyculeContext";
import { GRAPH_VIEW_SETTINGS } from "./options";

export const PolyculeGraphView = () => {
    const { root } = usePolycule();
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        
    }, []);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <svg
                // TODO: make this viewport small/big height
                style={{ width: "100vw", height: "100vh" }}
                viewBox="-100 -100 100 100"
                width={100}
                height={100}
                ref={ref}
            >
                {root.people.map(person => (
                    <g data-type="person" data-id={person.id} key={person.id}>
                        <circle
                            fill={GRAPH_VIEW_SETTINGS.personDefaultColor}
                            r={GRAPH_VIEW_SETTINGS.personRadius}
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
};
