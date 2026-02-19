import type { Vec2 } from "@alan404/vec2";
import { useEffect } from "react";
import { create } from "zustand";

type RenderFn<T> = (payload: T) => void;
export interface RenderingStore {
	nodes: Map<string, RenderFn<Vec2>[]>;
	registerNode: (id: string, renderFn: RenderFn<Vec2>) => () => void;

	fpsListeners?: RenderFn<number>[];
	registerFpsListener?: (renderFn: RenderFn<number>) => () => void;
}

export const useRenderingStore = create<RenderingStore>()((set, get) => ({
	nodes: new Map(),
	registerNode: (id, onUpdate) => {
		const current = get().nodes.get(id) || [];
		get().nodes.set(id, [...current, onUpdate]);
		return () => {
			const current = get().nodes.get(id) || [];
			const filtered = current.filter(fn => fn !== onUpdate);
			if (filtered.length === 0) {
				get().nodes.delete(id);
			} else {
				get().nodes.set(id, filtered);
			}
		};
	},

	fpsListeners: [],
	registerFpsListener: (onUpdate) => {
		const current = get().fpsListeners || [];
		get().fpsListeners = [...current, onUpdate];
		return () => {
			const current = get().fpsListeners || [];
			const filtered = current.filter(fn => fn !== onUpdate);
			get().fpsListeners = filtered;
		};
	},
}));

export const useRendering = (id: string, renderFn: RenderFn<Vec2>) => {
	useEffect(() => {
		return useRenderingStore.getState().registerNode(id, renderFn);
	}, [renderFn, id]);
};

export const useFps = (renderFn: RenderFn<number>) => {
	useEffect(() => {
		const register = useRenderingStore.getState().registerFpsListener;
		if (!register) return;
		return register(renderFn);
	}, [renderFn]);
};

export const dispatchRender = (id: string, payload: Vec2) => {
	const fns = useRenderingStore.getState().nodes.get(id);
	if (fns) fns.forEach(fn => fn(payload));
};

export const dispatchFps = (fps: number) => {
	const fns = useRenderingStore.getState().fpsListeners;
	if (fns) fns.forEach(fn => fn(fps));
};

