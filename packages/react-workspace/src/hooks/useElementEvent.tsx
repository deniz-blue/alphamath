import React, { useCallback, useEffect } from "react";

export type AllEventMaps = ElementEventMap & GlobalEventHandlersEventMap;

/**
 * React hook for registering events to a RefObject of any DOM element
 * @param ref RefObject to the element
 * @param eventName Name of the event
 * @param listener Listener to attach to the event
 * @param deps Effect Dependencies (listener will get reattached when they change)
 * @param extra addEventListener options
 */
export const useElementEvent = <
    El extends Element,
    Event extends keyof AllEventMaps,
>(
    ref: React.RefObject<El | null>,
    eventName: Event,
    listener: (this: El, e: AllEventMaps[Event]) => any,
    deps: React.DependencyList = [],
    extra?: Omit<AddEventListenerOptions, "signal">,
) => {
    const memoizedListener = useCallback(listener, [
        ref,
        listener,
        ...deps,
    ]);

    useEffect(() => {
        let el = ref.current;
        if(!el) return;
        const ctrl = new AbortController();
        el.addEventListener(eventName, memoizedListener as any, {
            ...extra,
            signal: ctrl.signal,
        });
        return () => ctrl.abort();
    }, [ref, memoizedListener, ...deps]);
};
