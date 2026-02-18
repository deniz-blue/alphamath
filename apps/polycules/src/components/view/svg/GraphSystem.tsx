import type { System } from "../../../lib/legacy-schema/legacy-types";
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
                fontSize={OPTIONS.systemNameBackgroundFontSize}
                fill={OPTIONS.systemNameColor}
                pointerEvents="none"
                opacity={0.2}
            >
                {system.name || "(No system name)"}
            </text>
        </g>
    )
};
