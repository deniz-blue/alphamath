import { randomId, useHotkeys } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import React, { type PropsWithChildren, type ReactNode } from "react";

export const ConfirmModalShim = ({
    children,
    onConfirm,
}: PropsWithChildren<{
    onConfirm?: () => void;
}>) => {
    useHotkeys([
        ["Enter", () => onConfirm?.()],
    ]);

    return children;
};

export const confirmableCallback = (
    message: ReactNode,
    onConfirm?: () => any,
) => {
    return (e: React.MouseEvent) => {
        if(e.shiftKey) return onConfirm?.();
        openAppConfirmModal(message, onConfirm);
    };
};

export const openAppConfirmModal = (
    message: ReactNode,
    onConfirm?: () => void,
) => {
    const modalId = randomId();
    modals.openConfirmModal({
        title: "Confirmation",
        modalId,
        children: (
            <ConfirmModalShim onConfirm={() => {
                modals.close(modalId);
                onConfirm?.();
            }}>
                {message}
            </ConfirmModalShim>
        ),
        labels: { confirm: "Proceed", cancel: "Cancel" },
        //                  ^ findher.ogg
        confirmProps: {
            color: "red",
        },
        onConfirm,
    });
};
