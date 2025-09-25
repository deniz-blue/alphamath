import { PersonEditorModal } from "./components/editor/person/PersonEditor";
import { PersonListModal } from "./components/editor/lists/PersonList";
import { SystemListModal } from "./components/editor/lists/SystemList";
import { SystemEditorModal } from "./components/editor/system/SystemEditor";
import { modals, type ContextModalProps } from "@mantine/modals";
import type React from "react";

export const MODALS = {
    PersonEditorModal,
    PersonListModal,
    SystemListModal,
    SystemEditorModal,
} as const;

declare module '@mantine/modals' {
    export interface MantineModalsOverride {
        modals: typeof MODALS;
    }
}

type InnerPropsOf<T> = T extends React.FC<infer P extends ContextModalProps> ? P["innerProps"] : never;

export const openAppModal = <Key extends keyof typeof MODALS>(
    name: Key,
    props: InnerPropsOf<(typeof MODALS)[Key]>,
) => {
    modals.openContextModal({
        modal: name,
        innerProps: props,
    });
};
