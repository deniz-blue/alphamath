import { OPTIONS } from "./useGraphTheme";

export interface GraphNodeGroupProps {
	groupId: string;
	color?: string;
	primaryName?: string;
};

export const GraphSystem = ({
	groupId,
	color,
	primaryName,
}: GraphNodeGroupProps) => {
	return (
		<g
			data-type="group"
			data-id={groupId}
		>
			<circle
				fill={color ?? OPTIONS.systemDefaultColor}
				opacity={OPTIONS.systemBackgroundOpacity}
			/>

			<text
				textAnchor="middle"
				fontSize={OPTIONS.systemNameBackgroundFontSize}
				fill={OPTIONS.systemNameColor}
				pointerEvents="none"
				opacity={0.2}
			>
				{primaryName ?? ""}
			</text>
		</g>
	)
};
