import { ActionIcon, CloseButton, Group, Modal, Stack } from "@mantine/core";
import { ModalBreadcrumbs } from "./ModalBreadcrumbs";
import { IconArrowLeft } from "@tabler/icons-react";
import { modals } from "@mantine/modals";

export const AppModalHeader = () => {
    return (
        <Stack>
            <Group>
                <Modal.CloseButton icon={<IconArrowLeft />} />
                <ModalBreadcrumbs flex="1" />
                <CloseButton
                    onClick={() => modals.closeAll()}
                />
            </Group>
        </Stack>
    )
};