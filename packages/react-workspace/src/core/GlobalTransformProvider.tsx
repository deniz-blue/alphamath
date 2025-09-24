import { PropsWithChildren, useCallback, useLayoutEffect } from "react";
import { vec2, Vec2, vec2round } from "@alan404/vec2";
import { GlobalTransform, IGlobalTransform } from "./GlobalTransformContext.js";
import { useUncontrolled, useViewportSize } from "@mantine/hooks";

export interface GlobalTransformProviderProps extends PropsWithChildren, Partial<IGlobalTransform> {};

export const GlobalTransformProvider = ({
    children,
    position: _position,
    initialPosition,
    setPosition: _setPosition,
    scale: _scale,
    initialScale,
    setScale: _setScale,
    maxScale = 2,
    minScale = 0.2,
}: GlobalTransformProviderProps) => {
    const [scale, setScale] = useUncontrolled<number>({
        value: _scale,
        defaultValue: initialScale,
        finalValue: 0.7,
        onChange: _setScale,
    });

    const viewport = useViewportSize();

    const fallbackPosition = vec2(viewport.width/2, viewport.height/2);
    const [positionMaybeNull, setPosition] = useUncontrolled<Vec2 | null>({
        value: _position,
        defaultValue: initialPosition,
        finalValue: null,
        onChange: _setPosition ? (pos => _setPosition(pos ?? fallbackPosition)) : undefined,
    });
    const position = positionMaybeNull ?? fallbackPosition;

    // round position to avoid subpixel rendering issues
    const setPositionRounded = useCallback((pos: Vec2) => {
        setPosition(vec2round(pos));
    }, [setPosition]);

    return (
        <GlobalTransform.Provider value={{
            scale,
            initialScale,
            setScale,
            position,
            initialPosition,
            setPosition: setPositionRounded,
            minScale,
            maxScale,
        }}>
            {children}
        </GlobalTransform.Provider>
    )
}
