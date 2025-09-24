import { PersonEditModal } from "./components/editor/person/PersonEditor";
import { PersonListModal } from "./components/editor/person/PersonList";

export const MODALS = {
    PersonEditModal,
    PersonListModal,
};

declare module '@mantine/modals' {
    export interface MantineModalsOverride {
        modals: typeof MODALS;
    }
}
