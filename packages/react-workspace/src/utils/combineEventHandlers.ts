import React from "react";

export type MaybeEventHandler<Event extends React.SyntheticEvent<any>> = React.EventHandler<Event> | null | undefined;
export const combineEventHandlers = <Event extends React.SyntheticEvent<any>>(
    handlers: MaybeEventHandler<Event>[]
): React.EventHandler<Event> => {
    // TODO: can we useCallback here?
    return (e: Event) => {
        for (let callback of handlers)
            callback?.(e);
    };
};

export type EventHandlerProps = Omit<React.DOMAttributes<Element>, "children" | "dangerouslySetInnerHTML">;
export type AnyEventHandler = React.EventHandler<React.SyntheticEvent<Element>>;
export const combineEventHandlerProps = <PropsList extends EventHandlerProps[]>(
    propsList: PropsList,
): Record<keyof PropsList[number], AnyEventHandler> => {
    const map: Partial<Record<keyof PropsList[number], AnyEventHandler[]>> = {};
    for (let props of propsList)
        for (let [k, v] of Object.entries(props) as [keyof PropsList[number], AnyEventHandler][])
            (map[k] ||= []).push(v);
    
    const props: Partial<Record<keyof PropsList[number], AnyEventHandler>> = {};
    for(let [k, v] of Object.entries(map) as [keyof PropsList[number], AnyEventHandler[]][])
        props[k] = combineEventHandlers(v);

    return props as Record<keyof PropsList[number], AnyEventHandler>;
};
