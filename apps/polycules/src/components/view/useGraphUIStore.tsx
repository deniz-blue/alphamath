import { create } from "zustand";

type Mode = "drag" | "link";

interface GraphUIState {
    mode: Mode;
}

interface GraphUIActions {
    setMode: (mode: Mode) => void;
}

export const useGraphUIStore = create<GraphUIState & GraphUIActions>()((set, get) => ({
    mode: "drag",
    setMode: (mode) => {
        set({ mode });
    },
}))
