import { ModalsProvider } from "@mantine/modals";
import { MainLayout } from "../components/layout/MainLayout";
import { GlobalTransformProvider } from "@alan404/react-workspace";
import { MODALS } from "../modals";
import { ScrollArea } from "@mantine/core";

export default function Home() {
	return (
		<GlobalTransformProvider>
			<ModalsProvider
				modals={MODALS}
				modalProps={{
					size: "md",
					scrollAreaComponent: ScrollArea.Autosize,
				}}
			>
				<MainLayout />
			</ModalsProvider>
		</GlobalTransformProvider>
	);
}
