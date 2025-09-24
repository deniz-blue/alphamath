import { PersonEditorModal } from "./components/editor/person/PersonEditor";
import { PersonListModal } from "./components/editor/lists/PersonList";
import { SystemListModal } from "./components/editor/lists/SystemList";
import { SystemEditorModal } from "./components/editor/system/SystemEditor";

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
