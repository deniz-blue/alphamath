import { MainLayout } from "../../components/layout/MainLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
	component: IndexPage,
});

export function IndexPage() {
	// useImportFromHash();

	return (
		<MainLayout />
	)
}

// export const useImportFromHash = () => {
// 	const location = useLocation();
// 	const navigate = useNavigate();
// 	const setGraphState = usePolyculeStore.setState;

// 	useEffect(() => {
// 		const hash = location.hash.slice(1);
// 		if (!hash) return;

// 		(async () => {
// 			try {
// 				const graph = await decodeGraph(hash);
// 				setGraphState({ root: graph });

// 				navigate(location.pathname + location.search, { replace: true });
// 			} catch (err) {
// 				console.error("Failed to decode data:", err);
// 				modals.open({
// 					title: "Error",
// 					children: (
// 						<Text>
// 							Failed to import polycule from URL:

// 							<Code block>
// 								{err instanceof ZodError ? prettifyError(err) : ("" + err)}
// 							</Code>
// 						</Text>
// 					),
// 				})
// 			}
// 		})()
// 	}, [location, navigate]);
// };
