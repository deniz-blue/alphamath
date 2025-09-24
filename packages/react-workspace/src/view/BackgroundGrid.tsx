import { useGlobalTransform } from "../hooks/useGlobalTransform.js";

export type BackgroundGridProps = {
    color?: string;
    distance?: number;
    thickness?: number;
};

export const BackgroundGrid = ({
    color = "#2f2f2f",
    distance = 500,
    thickness = 1,
}: BackgroundGridProps) => {
    const { position, scale } = useGlobalTransform();

    const size = `${distance * scale}px`;
    const line = `${color} ${thickness}px`;
    const backgroundImage = `linear-gradient(to right, ${line}, transparent 1px), linear-gradient(to bottom, ${line}, transparent 1px)`;
    const backgroundPosition = `${position.x}px ${position.y}px`;
    const backgroundSize = `${size} ${size}`;

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                backgroundSize,
                backgroundImage,
                backgroundPosition,
                position: "absolute",
            }}
        />
    )
}
