import { create } from "zustand";

type Mode = "drag" | "link";

interface GraphUIState {
	mode: Mode;
	activeNodeIds: Set<string>;
	connectingNodeId: string | null;
}

interface GraphUIActions {
	setMode: (mode: Mode) => void;
}

export const useGraphUIStore = create<GraphUIState & GraphUIActions>()((set, get) => ({
	mode: "drag",
	activeNodeIds: new Set(),
	connectingNodeId: null,
	setMode: (mode) => {
		set({ mode });
	},
}))
