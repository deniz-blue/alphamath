import type { ModalsProviderProps } from "@mantine/modals";
import { PersonEditModal } from "./components/editor/person/PersonEditor";
import { PersonListModal } from "./components/editor/person/PersonList";

export const MODALS = {
    PersonEditModal,
    PersonListModal,
} satisfies ModalsProviderProps["modals"];

declare module '@mantine/modals' {
    export interface MantineModalsOverride {
        modals: typeof MODALS;
    }
}
