import { MainLayout } from "../components/layout/MainLayout";
import { ModalsProvider } from "@mantine/modals";
import { MODALS } from "../modals";
import { GlobalTransformProvider } from "@alan404/react-workspace";

export default function Home() {
	return (
		<GlobalTransformProvider>
			<ModalsProvider modals={MODALS}>
				<MainLayout />
			</ModalsProvider>
		</GlobalTransformProvider>
	);
}
