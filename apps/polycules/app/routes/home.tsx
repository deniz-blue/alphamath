import { Stack } from "@mantine/core";
import { PolyculeContext } from "../contexts/PolyculeContext";
import { useImmer } from "use-immer";
import { createPolyculeManifest } from "../lib/graph";
import { MainLayout } from "../components/layout/MainLayout";
import type { PolyculeManifest } from "../lib/types";
import { ModalsProvider } from "@mantine/modals";
import { MODALS } from "../modals";

const TEST_MANIFEST: PolyculeManifest = {
	...createPolyculeManifest(),
	people: [
		{ id: "p_0", name: "deniz" },
		{ id: "p_1", name: "bulut" },
		{ id: "p_2", name: "ispik" },
		{ id: "p_3", name: "athenya" },
	],
};

export default function Home() {
	const [root, update] = useImmer(() => TEST_MANIFEST);

	return (
		<PolyculeContext value={{
			root,
			update
		}}>
			<ModalsProvider modals={MODALS}>
				<MainLayout />
			</ModalsProvider>
		</PolyculeContext>
	);
}
