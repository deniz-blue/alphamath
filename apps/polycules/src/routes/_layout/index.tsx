import { createFileRoute } from "@tanstack/react-router";
import { Modal } from "@mantine/core";
import { IndexModalContent } from "../../components/modals/IndexModalContent";
import type { Did } from "@atcute/lexicons";

export const Route = createFileRoute("/_layout/")({
	component: IndexPage,
});

export function IndexPage() {
	const navigate = Route.useNavigate();

	return (
		<Modal
			opened
			onClose={() => { }}
			withCloseButton={false}
			closeOnEscape={false}
			closeOnClickOutside={false}
			size="xl"
		>
			<IndexModalContent
				onViewGraph={(subject) => navigate({ to: "./$subject", params: { subject } })}
				onEditRelationships={(did: Did) => navigate({ to: "./$subject/edit", params: { subject: did } })}
			/>
		</Modal>
	);
}
