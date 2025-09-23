import { createContext } from "react";
import { vec2, Vec2 } from "@alan404/vec2";

export interface IGlobalTransform {
    position: Vec2;
    initialPosition?: Vec2;
    setPosition: (position: Vec2) => void;
    scale: number;
    initialScale?: number;
    setScale: (scale: number) => void;
    minScale: number;
    maxScale: number;
}

export const GlobalTransform = createContext<IGlobalTransform>({
    position: vec2(),
    scale: 1,
    setPosition: () => {},
    setScale: () => {},
    maxScale: Infinity,
    minScale: 0,
});
