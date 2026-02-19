import { create } from "zustand";

type Mode = "drag" | "link";

interface GraphUIState {
	mode: Mode;
	activeNodeIds: Set<string>;
}

interface GraphUIActions {
	setMode: (mode: Mode) => void;
	activateNode: (nodeId: string) => void;
	deactivateNode: (nodeId: string) => void;
}

export const useGraphUIStore = create<GraphUIState & GraphUIActions>()((set, get) => ({
	mode: "drag",
	activeNodeIds: new Set(),
	connectingNodeId: null,
	setMode: (mode) => {
		set({ mode });
	},
	activateNode: (nodeId) => {
		set((state) => ({
			activeNodeIds: new Set(state.activeNodeIds).add(nodeId),
		}));
	},
	deactivateNode: (nodeId) => {
		set((state) => {
			const newSet = new Set(state.activeNodeIds);
			newSet.delete(nodeId);
			return { activeNodeIds: newSet };
		});
	},
}))
