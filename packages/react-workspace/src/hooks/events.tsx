import React from "react";

export type MouseEv = React.MouseEventHandler<Element>;
export type TouchEv = React.TouchEventHandler<Element>;

export type MouseEvents = Pick<
    React.DOMAttributes<Element>,
    "onMouseDown" | "onMouseMove" | "onMouseUp" | "onWheel"
>;

export type TouchEvents = Pick<
    React.DOMAttributes<Element>,
    "onTouchStart" | "onTouchMove" | "onTouchEnd"
>;


