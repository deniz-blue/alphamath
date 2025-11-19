import type { Enum } from "@alan404/enum";
import { vec2, type Vec2 } from "@alan404/vec2";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type IWindowEnum = Enum<{
    Calculator: any;
    Notepad: { content: string; };
}>;

export interface IBaseWindow {
    id: string;
    position: Vec2;
    size: Vec2;
};

export type IWindow = IBaseWindow & IWindowEnum;

export type State = {
    windows: IWindow[];
};

export type Actions = {
    openWindow: (data: IWindowEnum & Partial<Pick<IBaseWindow, "position" | "size">>) => void;
    moveWindow: (id: string, pos: Vec2) => void;
    resizeWindow: (id: string, pos: Vec2) => void;
    closeWindow: (id: string) => void;
};

export const useWorkspace = create<State & Actions>()(
    persist(
        immer((set, get) => ({
            windows: [],
            openWindow: (data) => set(state => {
                const id = Math.random().toString(36).slice(2);
                state.windows.push({
                    id,
                    position: vec2(0, 0),
                    size: vec2(300, 400),
                    ...data,
                });
            }),
            moveWindow: (id, pos) => set(state => {
                let w = state.windows.find(x => x.id == id)
                if (!w) return
                w.position = pos
            }),
            resizeWindow: (id, size) => set(state => {
                let w = state.windows.find(x => x.id == id)
                if (!w) return
                w.size = size
            }),
            closeWindow: (id) => set(state => {
                state.windows = state.windows.filter(x => x.id !== id)
            }),
        })),
        {
            name: "alphamath:workspace",
            version: 0,
        },
    )
);
