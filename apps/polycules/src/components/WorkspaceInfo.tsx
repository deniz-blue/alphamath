import { useGlobalTransformStore } from "@alan404/react-workspace";
import { Stack, Text } from "@mantine/core";
import { useCallback, useRef } from "react";
import { useFps } from "../lib/rendering/useRenderingStore";

export const WorkspaceInfo = () => {
	const ref = useRef<HTMLElement>(null);
	const { position, scale } = useGlobalTransformStore();

	const updateFps = useCallback((fps: number) => {
		if (!ref.current) return;
		ref.current.textContent = fps.toFixed(1);
	}, [ref]);
	useFps(updateFps);

	return (
		<Stack gap={0} c="dimmed" fz="xs" ff="monospace">
			<Text inline span inherit>
				Workspace: ({Math.round(position.x)}, {Math.round(position.y)}) {(Math.round(scale * 100) / 100)}x
			</Text>
			<Text inline span inherit>
				FPS: <Text span inline inherit ref={ref as any}>?</Text>
			</Text>
		</Stack>
	)
};
