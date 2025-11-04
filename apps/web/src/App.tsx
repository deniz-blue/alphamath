import { MainOverlay } from "./components/workspace/overlay/MainOverlay";
import { ToolProvider } from "./components/workspace/ToolContext";
import { WorkspaceContext, WorkspaceProvider } from "./components/workspace/WorkspaceContext";
import { useContext, useRef } from "react";
import { ItemRenderer } from "./components/workspace/items/ItemRenderer";
import { IconCrosshair } from "@tabler/icons-react";
import { ContextStack } from "./components/util/ContextStack";
import { SelectionContextProvider } from "./components/math/select/SelectionContext";
import { BackgroundGrid, TransformProvider, Workspace, WorkspaceView } from "@alan404/react-workspace";
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

    return (
        <Workspace
            viewProps={{ ref }}
        >
            <text
                y={20}
                textAnchor="middle"
            >
                meow
            </text>

            {/* <foreignObject>
                <math>
                    <mrow>
                        <mi>x</mi>
                        <mo>+</mo>
                        <mi>y</mi>
                    </mrow>
                </math>
            </foreignObject> */}
            <TransformProvider>
                <IconCrosshair size={50} />
            </TransformProvider>

            <RootItemRenderer />
            <foreignObject>
                <MainOverlay />
            </foreignObject>
        </Workspace>
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
