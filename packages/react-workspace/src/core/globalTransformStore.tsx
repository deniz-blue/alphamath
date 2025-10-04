import { createStore } from 'zustand';

export type GlobalTransformState = {
    scale: number;
    translateX: number;
    translateY: number;
};

export type GlobalTransformActions = {
    setScale: (scale: number) => void;
    setTranslate: (x: number, y: number) => void;
    reset: () => void;
};

export const useGlobalTransformStore = createStore<GlobalTransformState & GlobalTransformActions>((set) => ({
    scale: 1,
    translateX: 0,
    translateY: 0,
    setScale: (scale) => set({ scale }),
    setTranslate: (x, y) => set({ translateX: x, translateY: y }),
    reset: () => set({ scale: 1, translateX: 0, translateY: 0 }),
}));
