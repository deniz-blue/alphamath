import { Item, ItemComponent } from "../../../types/app/item";
import { WithSetters } from "../../../types/utils";
import { ErrorCard } from "../../debug/ErrorCard";
import { match } from "@alan404/enum";
import { Transition } from "@mantine/core";
import { useState } from "react";
import { TransformProvider } from "@alan404/react-workspace";

export interface ItemRendererProps extends WithSetters<{ item: Item }> {
    onFocus?: () => void;
    onClose?: () => void;
}

export const ItemRenderer = ({
    item,
    setItem,
    onFocus,
    onClose,
}: ItemRendererProps) => {
    const [beingClosed, setBeingClosed] = useState(false);

    let Component = match(item)({
        _: () => () => (
            <ErrorCard
                message="Unknown Item"
                description={item.type}
            />
        ),
    }) as ItemComponent<typeof item["type"]>;

    return (
        <TransformProvider position={item.position} onChange={(position) => setItem({
            ...item,
            position,
        })}>
            <Transition
                mounted={!beingClosed}
                onExited={() => onClose?.()}
                transition="pop"
            >
                {(style) => (
                    <div style={style}>
                        <Component
                            data={item.data}
                            onChange={(data) => setItem({
                                ...item,
                                data,
                            } as Item)}
                            onFocus={onFocus}
                            onClose={() => {
                                setBeingClosed(true);
                            }}
                        />
                    </div>
                )}
            </Transition>
        </TransformProvider>
    )
};
