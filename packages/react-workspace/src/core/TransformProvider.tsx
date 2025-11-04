import { forwardRef, PropsWithChildren } from "react";
import { useUncontrolled } from "@mantine/hooks";
import { Transform } from "./TransformContext.js";
import { Vec2 } from "@alan404/vec2";

export interface TransformProviderOptions {
    initialPosition?: Vec2;
    position?: Vec2;
    onChange?: (position: Vec2) => void;
}

export type TransformProviderProps = TransformProviderOptions
    & PropsWithChildren
    & Omit<React.JSX.IntrinsicElements["g"], keyof TransformProviderOptions>

export const TransformProvider = ({
    children,
    initialPosition,
    onChange,
    position: _position,
    style,
    ...props
}: TransformProviderProps) => {
    let [position, setPosition] = useUncontrolled<Vec2>({
        value: _position,
        defaultValue: initialPosition,
        finalValue: { x: 0, y: 0 },
        onChange,
    });
    
    return (
        <Transform.Provider value={{
            position,
            setPosition,
        }}>
            <g
                // transform={`translate(${position.x}px, ${position.y}px)`}
                x={position.x}
                y={position.y}
                {...props}
            >
                {children}
            </g>
        </Transform.Provider>
    );
};

