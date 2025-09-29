import { modals, ModalsProvider } from "@mantine/modals";
import { MainLayout } from "../components/layout/MainLayout";
import { GlobalTransformProvider } from "@alan404/react-workspace";
import { MODALS } from "../modals";
import { Code, ScrollArea, Text } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
import { usePolyculeStore } from "../store/usePolyculeStore";
import { useEffect } from "react";
import { decodeGraph } from "../lib/serde";

export default function Home() {
	useImportFromHash();

	return (
		<GlobalTransformProvider initialScale={1.5}>
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

export const useImportFromHash = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const setGraphState = usePolyculeStore.setState;

	useEffect(() => {
		const hash = location.hash.slice(1);
		if (!hash) return;

		(async () => {
			try {
				const graph = await decodeGraph(hash);
				setGraphState({ root: graph });

				navigate(location.pathname + location.search, { replace: true });
			} catch (err) {
				console.error("Failed to decode data:", err);
				modals.open({
					title: "Error",
					children: (
						<Text>
							Failed to import polycule from URL:

							<Code block>
								{"" + err}
							</Code>
						</Text>
					),
				});
			}
		})()
	}, [location, navigate]);
};
