import { vec2, Vec2, vec2add, vec2div, vec2mul, vec2round, vec2sub } from "@alan404/vec2";
import { create } from 'zustand';
import { devtools } from "zustand/middleware";

export type GlobalTransformState = {
    position: Vec2;
    scale: number;
};

export type GlobalTransformActions = {
    setScale: (scale: number) => void;
    setPosition: (position: Vec2) => void;
    reset: () => void;
    center: () => void;
    moveBy: (delta: Partial<Vec2>) => void;
    fromScreenPosition: (v: Vec2) => Vec2;
    changeScaleFrom: (point: Vec2, delta: number) => void;
};

export type DefaultGlobalOptions = {
    initialPosition: Vec2;
    initialScale: number;
    minScale: number;
    maxScale: number;
};

export const DefaultGlobalOptions: DefaultGlobalOptions = {
    initialPosition: vec2(),
    initialScale: 1,
    minScale: 0.2,
    maxScale: 2,
};

export const useGlobalTransformStore = create<(
    GlobalTransformState
    & DefaultGlobalOptions
    & GlobalTransformActions
)>()(
    devtools((set, get) => ({
        scale: 1,
        position: vec2(),
        ...DefaultGlobalOptions,
        setScale: (scale) => set({
            scale: Math.max(get().minScale, Math.min(scale, get().maxScale)),
        }),
        setPosition: (position) => set({
            position: position,
            // position: vec2round(position),
        }),
        reset: () => {
            const { setScale, initialScale, center } = get();
            setScale(initialScale);
            center();
        },
        center: () => {
            get().setPosition(typeof window == "undefined" ? vec2() : vec2div(vec2(
                window.innerWidth || 0,
                window.innerHeight || 0,
            ), 2));
        },
        moveBy: (delta) => set({
            position: vec2add(get().position, vec2(delta.x, delta.y)),
        }),
        fromScreenPosition: (v) => vec2div(vec2sub(v, get().position), get().scale),
        changeScaleFrom: (point: Vec2, delta: number) => {
            console.log("changeScaleFrom", point, delta);


            // A = 2x2 matrix that scales i-hat and j-hat by `delta`
            // A = [delta, 0; 0, delta]
            // p is `point`
            // Ap = N


            const { scale, minScale, maxScale, position } = get();

            const newScale = scale * delta;
            const scaleRatio = newScale / scale;

            const newPosition = vec2sub(
                point,
                vec2mul(delta, vec2sub(point, position)),
            )

            console.log("before", position, scale);
            console.log("after", newPosition, newScale);

            set({
                scale: newScale,
                position: vec2mul(position, scaleRatio),
            });
        },
    }))
);
