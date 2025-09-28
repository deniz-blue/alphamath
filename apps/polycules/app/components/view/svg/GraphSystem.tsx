import type { System } from "../../../lib/types";
import { OPTIONS } from "../options";

export const GraphSystem = ({
    system,
}: {
    system: System;
}) => {
    return (
        <g
            data-type="system"
            data-id={system.id}
        >
            <circle
                fill={system.color ?? OPTIONS.systemDefaultColor}
                opacity={OPTIONS.systemBackgroundOpacity}
            />

            <text
                textAnchor="middle"
                fontSize={OPTIONS.systemNameFontSize}
                fill={OPTIONS.systemNameColor}
                pointerEvents="none"
            >
                {system.name || "(No system name)"}
            </text>
        </g>
    )
};
