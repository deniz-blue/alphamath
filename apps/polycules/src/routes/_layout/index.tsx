import { MainLayout } from "../../components/layout/MainLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/")({
	component: IndexPage,
});

export function IndexPage() {
	return (
		<MainLayout />
	)
}
