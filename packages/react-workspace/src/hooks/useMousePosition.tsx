import { useMouse } from "@mantine/hooks";
import { Vec2 } from "@alan404/vec2";
import { useGlobalTransformStore } from "../core/globalTransformStore.js";

/**
 * Hook for getting mouse position in view coordinates
 * @returns The view position of the mouse
 */
export const useMousePosition = (): Vec2 => {
    const fromScreenPosition = useGlobalTransformStore(store => store.fromScreenPosition);
    const mouse = useMouse();
    return fromScreenPosition(mouse);
};
