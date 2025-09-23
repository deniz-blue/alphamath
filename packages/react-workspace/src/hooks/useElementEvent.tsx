import React, { useEffect } from "react";

export const useElementEvent = <
    Element extends HTMLElement,
    Event extends keyof HTMLElementEventMap,
>(
    ref: React.RefObject<Element | null>,
    eventName: Event,
    listener: (this: Element, e: HTMLElementEventMap[Event]) => any,
    deps: React.DependencyList = [],
    extra?: Omit<AddEventListenerOptions, "signal">,
) => {
    useEffect(() => {
        let el = ref.current;
        if(!el) return;
        const ctrl = new AbortController();
        el.addEventListener(eventName, listener as any, {
            ...extra,
            signal: ctrl.signal,
        });
        return () => ctrl.abort();
    }, [ref, ...deps]);
};
