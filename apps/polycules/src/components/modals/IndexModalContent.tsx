import { ActionIcon, Anchor, Button, Collapse, Image, Input, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { useCallback, useState } from "react";
import { useATProtoAuthStore } from "../../lib/atproto/useATProtoStore";
import { ATProtoAccountItem } from "../atproto/ATProtoAccountItem";
import { IconArrowRight, IconAt } from "@tabler/icons-react";
import type { Did, Handle } from "@atcute/lexicons";
import { isDid, isHandle, type AtprotoDid } from "@atcute/lexicons/syntax";

export const IndexModalContent = ({
	onViewGraph,
	onEditRelationships,
}: {
	onViewGraph?: (handleOrDid: Handle | Did) => void;
	onEditRelationships?: (did: Did) => void;
}) => {
	return (
		<Stack align="center" w="100%" gap="xl">
			<Title order={2}>
				Atmosphere Polycule Grapher
			</Title>

			<Stack gap={0} align="center" ta="center">
				<Text inherit>
					A graph viewer for <Anchor
						href="https://en.wikipedia.org/wiki/Polyamory"
						target="_blank"
					>
						non-monogamous
					</Anchor> relationships with <Anchor
						href="https://morethanone.info"
						target="_blank"
					>
						plurality
					</Anchor> (using <Anchor
						href="https://plural.host"
						target="_blank"
					>
						plural.host
					</Anchor>).
				</Text>

				<Text inherit>
					Relationships are stored on the <Anchor
						href="https://atproto.com"
						target="_blank"
					>
						Atmosphere
					</Anchor> - you own your data.
				</Text>
			</Stack>

			<Stack w="100%">
				<SimpleGrid
					w="100%"
					type="container"
					cols={{ base: 1, "600px": 2 }}
				>
					<ViewGraphInput onViewGraph={onViewGraph} />
					<EditRelationshipsSection onEditRelationships={onEditRelationships} />
				</SimpleGrid>
			</Stack>

			<Stack>
				<Text c="dimmed" fz="xs">
					This project is <Anchor
						href="https://github.com/deniz-blue/alphamath/tree/main/apps/polycules"
						target="_blank"
						inherit
					>
						open source
					</Anchor>.
				</Text>
			</Stack>
		</Stack>
	)
};

export const ViewGraphInput = ({ onViewGraph }: { onViewGraph?: (handleOrDid: Handle | Did) => void }) => {
	const [input, setInput] = useState("");

	const onSubmit = useCallback(() => {
		if (!input) return;
		if (!isHandle(input) && !isDid(input)) return;
		onViewGraph?.(input);
	}, [input, onViewGraph]);

	return (
		<Stack gap={4}>
			<TextInput
				autoFocus
				label="View someone's graph"
				description="Enter their handle or DID"
				placeholder="alice.bsky.social or did:plc:..."
				value={input}
				onChange={e => setInput(e.currentTarget.value)}
				onKeyUp={(e) => e.key === "Enter" && onSubmit()}
				rightSection={<IconArrowRight />}
				leftSection={<IconAt size={18} />}
			/>
			<Collapse in={!!input}>
				<Button
					disabled={!input || (!isHandle(input) && !isDid(input))}
					onClick={onSubmit}
					fullWidth
					rightSection={<IconArrowRight size={18} />}
				>
					View Graph
				</Button>
			</Collapse>
		</Stack>
	);
};

export const EditRelationshipsSection = ({ onEditRelationships }: { onEditRelationships?: (did: AtprotoDid) => void }) => {
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const sessions = useATProtoAuthStore(store => store.sessions);

	const onSubmit = useCallback(() => {
		if (!input) return;
		setLoading(true);
		useATProtoAuthStore.getState().startAuthorization(input)
			.finally(() => setLoading(false));
	}, [input]);

	return (
		<Stack gap="xl">
			<Stack gap={4}>
				<TextInput
					label="Edit your relationships"
					description="Log in via the Atmosphere"
					placeholder="alice.bsky.social or did:plc:..."
					value={input}
					onChange={e => setInput(e.currentTarget.value)}
					onKeyUp={(e) => e.key === "Enter" && onSubmit()}
					leftSection={<IconAt size={18} />}
					rightSection={<IconArrowRight size={18} />}
				/>
				<Collapse in={!!input}>
					<Button
						disabled={!input || (!isHandle(input) && !isDid(input))}
						loading={loading}
						onClick={onSubmit}
						fullWidth
						rightSection={<IconArrowRight size={18} />}
					>
						Authorize
					</Button>
				</Collapse>
				{loading ? (
					<Input.Description>
						Redirecting...
					</Input.Description>
				) : (
					<Input.Description>
						You'll be redirected to your PDS to authorize the app.
					</Input.Description>
				)}
			</Stack>

			<Stack gap={4}>
				{!!sessions?.length && (
					<Text c="dimmed" fz="sm">
						Or select from your active sessions:
					</Text>
				)}

				<Stack gap={4} w="100%">
					{sessions?.map((did) => (
						<ATProtoAccountItem
							key={did}
							did={did as AtprotoDid}
							onClick={() => onEditRelationships?.(did as AtprotoDid)}
						/>
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};
