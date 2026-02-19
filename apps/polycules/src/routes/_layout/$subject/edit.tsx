import { Affix, Button, Modal, Stack, Text } from "@mantine/core"
import { useHotkeys } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react";
import { EditModalContent } from "../../../components/modals/EditModalContent";
import type { AtprotoDid } from "@atcute/lexicons/syntax";
import { useATProtoAuthStore } from "../../../lib/atproto/useATProtoStore";

export const Route = createFileRoute("/_layout/$subject/edit")({
	component: RouteComponent,
	beforeLoad: async ({ params: { subject } }) => {
		await useATProtoAuthStore.getState().signIn(subject as AtprotoDid);
	},
})

function RouteComponent() {
	const { subject } = Route.useParams();
	const [opened, setOpened] = useState(true);

	useHotkeys([
		["e", () => setOpened(o => !o)],
	]);

	return (
		<g>
			<Affix
				position={{ bottom: 20 }}
				w="100%"
			>
				<Stack w="100%" align="center" style={{ pointerEvents: "none" }}>
					<Button
						onClick={() => setOpened(true)}
						style={{ pointerEvents: "all" }}
						size="lg"
						leftSection={<IconEdit />}
					>
						<Text
							inline span inherit
							td="underline"
						>E</Text>dit
					</Button>
				</Stack>
			</Affix>
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				size="xl"
				title="Edit Relationships"
			>
				<EditModalContent did={subject as AtprotoDid} />
			</Modal>
		</g>
	)
}

