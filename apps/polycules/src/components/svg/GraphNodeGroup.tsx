import { useGraphTheme } from "./useGraphTheme";

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
	const theme = useGraphTheme();

	return (
		<g
			data-type="group"
			data-id={groupId}
		>
			<circle
				fill={color ?? theme.groupDefaultColor}
				opacity={theme.groupBackgroundOpacity}
			/>

			<text
				textAnchor="middle"
				fontSize={theme.secondaryTextSize}
				fill={theme.secondaryTextColor}
				pointerEvents="none"
				opacity={0.2}
			>
				{primaryName ?? ""}
			</text>
		</g>
	)
};
