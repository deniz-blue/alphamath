import { Stack } from "@mantine/core";
import { PolyculeContext } from "../contexts/PolyculeContext";
import { useImmer } from "use-immer";
import { createPolyculeManifest } from "../lib/graph";
import { MainLayout } from "../components/layout/MainLayout";
import type { PolyculeManifest } from "../lib/types";
import { ModalsProvider } from "@mantine/modals";
import { MODALS } from "../modals";
import { GlobalTransformProvider } from "@alan404/react-workspace";

const TEST_MANIFEST: PolyculeManifest = {
	...createPolyculeManifest(),
	people: [
		{ id: "p_0", name: "deniz" },
		{ id: "p_1", name: "bulut" },
		{ id: "p_2", name: "ispik" },
		{ id: "p_3", name: "kenn" },
		{ id: "p_4", name: "remi" },
		{ id: "p_5", name: "athenya" },
		{ id: "p_6", name: "cyan" },
	],
	relationships: [
		{ id: "r_0", from: "p_0", to: "p_2" },
		{ id: "r_1", from: "p_1", to: "p_2" },
		{ id: "r_2", from: "p_5", to: "p_6" },
	],
	systems: [
		{ id: "s_0", name: "C&", memberIds: ["p_0", "p_1"] },
		{ id: "s_1", name: "ispik&", memberIds: ["p_2", "p_3", "p_4"] },
	],
};

export default function Home() {
	const [root, update] = useImmer(() => TEST_MANIFEST);

	return (
		<PolyculeContext value={{
			root,
			update
		}}>
			<GlobalTransformProvider>
				<ModalsProvider modals={MODALS}>
					<MainLayout />
				</ModalsProvider>
			</GlobalTransformProvider>
		</PolyculeContext>
	);
}
