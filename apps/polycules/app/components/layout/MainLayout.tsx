import { Affix, Box, Button, Stack } from "@mantine/core";
import { PolyculeGraphView } from "../view/PolyculeGraphView";
import { modals } from "@mantine/modals";

export const MainLayout = () => {
    return (
        <Box pos="relative">
            <PolyculeGraphView />

            <Affix position={{ left: 20, top: 20 }}>
                <Stack>
                    <Button
                        variant="light"
                        onClick={() => modals.openContextModal({
                            modal: "PersonListModal",
                            innerProps: {},
                        })}
                    >
                        List People
                    </Button>
                    <Button
                        variant="light"
                        onClick={() => modals.openContextModal({
                            modal: "SystemListModal",
                            innerProps: {},
                        })}
                    >
                        List Systems
                    </Button>
                </Stack>
            </Affix>
        </Box>
    )
};
