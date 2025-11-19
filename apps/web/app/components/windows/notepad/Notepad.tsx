import { Stack, Text, Textarea } from "@mantine/core";
import { useState } from "react";
import { useWorkspace } from "../../../store/useWorkspace";

export const NotepadWindow = ({ windowId }: { windowId: string }) => {
    const value: string | undefined = useWorkspace(store => store.windows.find(x => x.id == windowId)?.data?.content);

    return (
        <Stack h="100%">
            <Textarea
                value={value}
                onChange={e => {
                    useWorkspace.setState(state => {
                        const window = state.windows.find(x => x.id == windowId);
                        if(!window) return;
                        window.data.content = e.currentTarget.value;
                    })
                }}
                h="100%"
                styles={{ wrapper: { height: "100%" }, input: { height: "100%" } }}
                variant="unstyled"
            />
        </Stack>
    )
};
