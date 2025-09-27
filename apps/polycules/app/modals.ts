import type React from "react";
import { PersonEditorModal } from "./components/editor/person/PersonEditor";
import { PersonListModal } from "./components/editor/lists/PersonList";
import { SystemListModal } from "./components/editor/lists/SystemList";
import { SystemEditorModal } from "./components/editor/system/SystemEditor";
import { modals, type ContextModalProps } from "@mantine/modals";
import { SystemMembersListModal } from "./components/editor/lists/SystemMembersList";
import { LinksListModal } from "./components/editor/lists/LinksList";
import { NodeSelectModal } from "./components/editor/select/NodeSelect";
import { RelationshipEditorModal } from "./components/editor/relationship/RelationshipEditor";
import { SystemModal } from "./components/editor/system/SystemModal";
import { PersonModal } from "./components/editor/person/PersonModal";

export const MODALS = {
    PersonEditorModal,
    PersonListModal,
    SystemListModal,
    SystemEditorModal,
    SystemMembersListModal,
    LinksListModal,
    NodeSelectModal,
    RelationshipEditorModal,
    SystemModal,
    PersonModal,
} as const;

export const MODAL_TITLES: Record<keyof typeof MODALS, string> = {
    PersonEditorModal: "Edit Person",
    PersonListModal: "People",
    SystemListModal: "Systems",
    SystemEditorModal: "Edit System",
    SystemMembersListModal: "System Members",
    LinksListModal: "Links",
    NodeSelectModal: "Select Node",
    RelationshipEditorModal: "Edit Relationship",
    PersonModal: "Person",
    SystemModal: "System",
};

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
        title: MODAL_TITLES[name],
    });
};
