import { useCallback, useRef } from "react";
import type { Vec2 } from "@alan404/vec2";
import { useRendering } from "../../lib/rendering/useRenderingStore";
import { useGraphTheme } from "./useGraphTheme";

export interface GraphLinkProps {
	from: string;
	to: string;
	color?: string;
	width?: number;
};

export const GraphLink = ({
	from,
	to,
	color,
	width,
}: GraphLinkProps) => {
	const theme = useGraphTheme();
	const ref = useRef<SVGLineElement>(null);

	const renderFrom = useCallback((vec: Vec2) => {
		if (!ref.current) return;
		ref.current.setAttribute("x1", vec.x.toString());
		ref.current.setAttribute("y1", vec.y.toString());
	}, [ref]);

	const renderTo = useCallback((vec: Vec2) => {
		if (!ref.current) return;
		ref.current.setAttribute("x2", vec.x.toString());
		ref.current.setAttribute("y2", vec.y.toString());
	}, [ref]);

	useRendering(from, renderFrom);
	useRendering(to, renderTo);

	return (
		<line
			ref={ref}
			data-from={from}
			data-to={to}
			data-type="link"
			stroke={color ?? theme.linkColor}
			strokeWidth={width ?? theme.linkWidth}
			strokeLinecap="round"
		/>
	);
};
