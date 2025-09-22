import { useEffect, useRef } from "react";

export const PolyculeGraphView = () => {
    const ref = useRef<SVGSVGElement>(null);

    useEffect(() => {
        
    }, []);

    return (
        <div>
            <svg ref={ref} />
        </div>
    );
};
