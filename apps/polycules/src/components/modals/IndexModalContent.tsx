import { ActionIcon, Anchor, Image, Input, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import { useCallback, useState } from "react";
import { useATProtoAuthStore } from "../../lib/atproto/useATProtoStore";
import { ATProtoAccountItem } from "../atproto/ATProtoAccountItem";
import { IconArrowRight } from "@tabler/icons-react";
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
						<Text inline inherit span ff="Times New Roman">&pi;</Text> non-monogamous
					</Anchor> relationships that can include <Anchor
						href="https://morethanone.info"
						target="_blank"
					>
						<Image
							w={20}
							h={20}
							display="inline"
							style={{
								lineHeight: 1,
								verticalAlign: "middle",
								imageRendering: "auto",
							}}
							src="https://github.com/deniz-blue/md-emojis/raw/main/emojis/identity/plurality-colors.svg"
						/>
						{" "}plurality
					</Anchor>
				</Text>

				<Text inherit>
					Relationships are stored on the <Anchor
						href="https://atproto.com"
						target="_blank"
					>
						Atmosphere
					</Anchor>
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
					</Anchor>! Made with 💜 by <Anchor
						href="https://deniz.blue"
						target="_blank"
						inherit
					>
						@deniz.blue
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
		<TextInput
			label="View someone's graph"
			description="Enter their handle or DID"
			placeholder="alice.bsky.social or did:plc:..."
			value={input}
			onChange={e => setInput(e.currentTarget.value)}
			onKeyUp={(e) => e.key === "Enter" && onSubmit()}
			rightSection={(
				<ActionIcon
					disabled={!input}
					onClick={onSubmit}
				>
					<IconArrowRight />
				</ActionIcon>
			)}
		/>
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
			<Stack gap={0}>
				<TextInput
					label="Edit your relationships"
					description="Enter your handle or DID"
					placeholder="alice.bsky.social or did:plc:..."
					value={input}
					onChange={e => setInput(e.currentTarget.value)}
					onKeyUp={(e) => e.key === "Enter" && onSubmit()}
					rightSection={(
						<ActionIcon
							disabled={!input}
							loading={loading}
							onClick={onSubmit}
						>
							<IconArrowRight />
						</ActionIcon>
					)}
				/>
				{loading && (
					<Input.Description>
						Redirecting...
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
