import { ActionIcon, Button, JsonInput, Menu, Stack, TextInput } from "@mantine/core";
import { IconCopy, IconDotsVertical, IconExternalLink, IconFileImport, IconJson } from "@tabler/icons-react";
import { useReportError } from "../../../utils/error-handling";
import { randomId, useClipboard, useFetch, useInputState } from "@mantine/hooks";
import { useEffect, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { createShareLink, encodeGraph } from "../../../lib/serde";
import { usePolyculeStore } from "../../../store/usePolyculeStore";
import { modals } from "@mantine/modals";
import { PolyculeManifestSchema } from "../../../lib/types";
import { prettifyError } from "zod";

export const DotMenu = () => {
    const { copied, copy, error } = useClipboard();

    useReportError(error);

    useEffect(() => {
        if (!copied) return;
        notifications.show({
            message: "Copied!",
            color: "green",
            autoClose: 500,
        })
    }, [copied]);

    return (
        <Menu>
            <Menu.Target>
                <ActionIcon
                    variant="light"
                    color="gray"
                >
                    <IconDotsVertical />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={() => copy(createShareLink(usePolyculeStore.getState().root))}
                    leftSection={<IconCopy />}
                >
                    Copy Link
                </Menu.Item>
                <Menu.Item
                    onClick={() => copy(JSON.stringify(usePolyculeStore.getState().root))}
                    leftSection={<IconJson />}
                >
                    Copy JSON
                </Menu.Item>
                <Menu.Sub position="left">
                    <Menu.Sub.Target>
                        <Menu.Sub.Item>
                            Import
                        </Menu.Sub.Item>
                    </Menu.Sub.Target>
                    <Menu.Sub.Dropdown>
                        <Menu.Item
                            onClick={() => {
                                const modalId = randomId();
                                modals.open({
                                    title: "Import from JSON",
                                    children: <JSONImportModal modalId={modalId} />,
                                    modalId,
                                });
                            }}
                            leftSection={<IconFileImport />}
                        >
                            Import JSON
                        </Menu.Item>
                        <Menu.Item
                            onClick={() => {
                                const modalId = randomId();
                                modals.open({
                                    title: "Import from URL",
                                    children: <URLImportModal modalId={modalId} />,
                                    modalId,
                                });
                            }}
                            leftSection={<IconFileImport />}
                        >
                            Import from URL
                        </Menu.Item>
                    </Menu.Sub.Dropdown>
                </Menu.Sub>
                <Menu.Item
                    component="a"
                    target="_blank"
                    href="https://github.com/deniz-blue/alphamath/tree/main/apps/polycules"
                    rightSection={<IconExternalLink />}
                >
                    Source code
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
};

export const JSONImportModal = ({ modalId }: { modalId: string }) => {
    const [input, setInput] = useInputState("");

    const isValidJSON = useMemo(() => {
        try {
            JSON.parse(input);
            return true;
        } catch (_) {
            return false;
        }
    }, [input]);

    const parsed = useMemo(() => {
        if (!isValidJSON) return null;
        return PolyculeManifestSchema.safeParse(JSON.parse(input));
    }, [isValidJSON, input]);

    return (
        <Stack>
            <JsonInput
                value={input}
                onChange={setInput}
                validationError="Invalid JSON"
                error={parsed?.error && prettifyError(parsed.error)}
                styles={{ error: { whiteSpace: "pre" } }}
                label="Polycule JSON"
                placeholder="Paste JSON here..."
                rows={10}
            />

            <Button
                variant="light"
                disabled={!isValidJSON || !parsed?.success}
                onClick={() => {
                    if (!parsed?.data) return;
                    usePolyculeStore.setState({
                        root: parsed?.data,
                    });
                    usePolyculeStore.temporal.getState().clear();
                    notifications.show({
                        message: "Imported!",
                        color: "green",
                    });
                    modals.close(modalId);
                }}
            >
                Import
            </Button>
        </Stack>
    );
};

export const URLImportModal = ({ modalId }: { modalId: string }) => {
    const [url, setUrl] = useInputState("");

    const {
        data,
        error,
        loading,
        refetch,
    } = useFetch(url, {
        autoInvoke: false,
    });

    useEffect(() => {
        const parsed = PolyculeManifestSchema.safeParse(data);
        if (parsed.error) return reportError(parsed.error);
        usePolyculeStore.setState({
            root: parsed.data,
        });
        usePolyculeStore.temporal.getState().clear();
        notifications.show({
            message: "Imported!",
            color: "green",
        });
        modals.close(modalId);
    }, [data]);

    return (
        <Stack>
            <TextInput
                value={url}
                onChange={setUrl}
                label="URL to Polycule JSON"
                placeholder="https://..."
            />

            <Button
                variant="light"
                disabled={!url}
                loading={loading}
                onClick={() => refetch()}
            >
                Import
            </Button>
        </Stack>
    );
};
