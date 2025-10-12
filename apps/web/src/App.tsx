import { MainOverlay } from "./components/workspace/overlay/MainOverlay";
import { ToolProvider } from "./components/workspace/ToolContext";
import { WorkspaceContext, WorkspaceProvider } from "./components/workspace/WorkspaceContext";
import { useContext, useRef } from "react";
import { ItemRenderer } from "./components/workspace/items/ItemRenderer";
import { IconCrosshair } from "@tabler/icons-react";
import { ContextStack } from "./components/util/ContextStack";
import { SelectionContextProvider } from "./components/math/select/SelectionContext";
import { BackgroundGrid, TransformProvider, WorkspaceView } from "@alan404/react-workspace";
import { usePanning, usePinchScaling, useWheelScaling } from "@alan404/react-workspace/gestures";

const RootItemRenderer = () => {
    const { items, setItems } = useContext(WorkspaceContext);

    return (
        items.map((item) => (
            <ItemRenderer
                key={item.id}
                item={item}
                setItem={(data) => setItems(items.map((x) => x.id == item.id ? data : x))}
                onFocus={() => setItems([...(items.filter((x) => x.id !== item.id)), item])}
                onClose={() => setItems([...(items.filter((x) => x.id !== item.id))])}
            />
        ))
    )
}

const MainView = () => {
    const ref = useRef<SVGSVGElement>(null);

    usePanning(ref);
    usePinchScaling(ref);
    useWheelScaling(ref);

    return (
        <div>
            <BackgroundGrid />
            <WorkspaceView
                ref={ref}
                id="workspace-view"
                style={{
                    // cursor: isPanning ? "grabbing" : "all-scroll",
                }}
            >
                <div  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                }} />

                <TransformProvider position={{ x: -25, y: -25 }}>
                    <foreignObject>
                        <IconCrosshair size={50} />
                    </foreignObject>
                </TransformProvider>

                <RootItemRenderer />
            </WorkspaceView>
            <MainOverlay />
        </div>
    )
};

const App = () => {
    return (
        <ContextStack providers={[
            WorkspaceProvider,
            ToolProvider,
            SelectionContextProvider,
        ]}>
            <MainView />
        </ContextStack>
    );
}

export default App
