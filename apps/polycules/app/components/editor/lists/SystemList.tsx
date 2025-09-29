import { Avatar, Button, Combobox, Group, Stack, Text, TextInput, useCombobox } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { openAppModal } from "../../../modals";
import { DEFAULT_SYSTEM } from "../../../store/data";
import { SystemCard } from "../../cards/SystemCard";
import { SearchableList } from "../common/SearchableList";
import type { System } from "../../../lib/types";

export const SystemListModal = ({ }: ContextModalProps) => {
    return <SystemList />;
};

export const SystemList = () => {
    const systems = usePolyculeStore(state => state.root.systems);
    const addSystem = usePolyculeStore(state => state.addSystem);

    return (
        <Stack>
            <SearchableList<System>
                data={systems}
                getItemId={s => s.id}
                getItemText={s => s.name}
                renderItem={s => <SystemCard system={s} />}
                onItemSelect={id => openAppModal("SystemModal", { id })}
                controls={[
                    <Button
                        variant="light"
                        color="green"
                        onClick={() => {
                            const id = addSystem(DEFAULT_SYSTEM);
                            openAppModal("SystemModal", { id });
                        }}
                    >
                        New
                    </Button>
                ]}
            />
        </Stack>
    )
};
