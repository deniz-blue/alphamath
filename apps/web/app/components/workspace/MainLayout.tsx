import { Workspace } from "@alan404/react-workspace";
import { Calculator } from "../windows/calculator/Calculator";
import { NotepadWindow } from "../windows/notepad/Notepad";
import { WindowBase } from "./WindowBase";
import { useWorkspace } from "../../store/useWorkspace";
import { useHotkeys } from "@mantine/hooks";
import { InfoCornerOverlay } from "./overlays/InfoCornerOverlay";
import { ActionBarOverlay } from "./overlays/ActionBarOverlay";
import { Flex } from "@mantine/core";

export default function MainLayout() {
    const openWindow = useWorkspace(store => store.openWindow);
    const windows = useWorkspace(store => store.windows);

    useHotkeys([
        ["shift+n", () => openWindow({
            type: "Notepad",
            data: { content: "" },
        })],
        ["shift+c", () => openWindow({
            type: "Calculator",
            data: {},
        })],
    ])

    return (
        <div>
            <Workspace>
                <text
                    fontSize={12}
                    textAnchor="middle"
                    y={4}
                    fill="#aaaaaa66"
                >
                    welcome to the demo
                </text>

                {windows.map((w) => (
                    <WindowBase
                        key={w.id}
                        position={w.position}
                        size={w.size}
                        onMove={(pos) => useWorkspace.getState().moveWindow(w.id, pos)}
                        onResize={(size) => useWorkspace.getState().resizeWindow(w.id, size)}
                        title={w.id}
                    >
                        {w.type == "Calculator" && <Calculator />}
                        {w.type == "Notepad" && <NotepadWindow windowId={w.id} />}
                    </WindowBase>
                ))}
            </Workspace>
            <div className="small-viewport viewport-safe-area" style={{ pointerEvents: "none", position: "fixed", top: 0 }}>
                <div style={{ position: "fixed", bottom: 0, margin: 4 }}>
                    <InfoCornerOverlay />
                </div>
                <div style={{ position: "fixed", bottom: 0, margin: 4, width: "100%" }}>
                    <Flex justify="center">
                        <ActionBarOverlay />
                    </Flex>
                </div>
            </div>
        </div>
    )
}
