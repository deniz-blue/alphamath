import { useEffect } from "react";
import { compute, type ComputeResult } from "../force";
import { useGraphUIStore } from "../useGraphUIStore";
import { useGraphStore } from "../store";
import { dispatchFps, dispatchRender } from "./useRenderingStore";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useCoordsStore = create<{
	coords: ComputeResult | null;
}>()(immer(() => ({ coords: null })));

export const useRenderer = () => {
	useEffect(() => {
		let lastTime = performance.now();
		const render: FrameRequestCallback = (time) => {
			const coords = compute(useGraphStore.getState(), useCoordsStore.getState().coords ?? undefined, {
				isDragging: !!useGraphUIStore.getState().activeNodeIds,
			});

			useCoordsStore.setState({ coords });

			for (let [id, node] of Object.entries(coords.nodes))
				dispatchRender(id, node);

			const delta = time - lastTime;
			const fps = 1000 / delta;
			dispatchFps(fps);
			lastTime = time;

			requestAnimationFrame(render);
		};

		let f = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(f);
		};
	}, []);
};
