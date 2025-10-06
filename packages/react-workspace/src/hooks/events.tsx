import type React from "react";

export type ReactEventHandlers<Keys extends keyof React.DOMAttributes<Element>> = Pick<React.DOMAttributes<Element>, Keys>;
