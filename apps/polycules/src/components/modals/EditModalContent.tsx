import { ActionIcon, Avatar, Button, Center, Collapse, Group, Loader, Menu, Paper, Popover, Stack, Text, TextInput } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { BlueDenizPolyRelationship } from "../../lexicons";
import { isHandle, type AtprotoDid, type CanonicalResourceUri, type Handle, type RecordKey } from "@atcute/lexicons/syntax";
import { IconCheck, IconDots, IconExternalLink, IconTrash, IconX } from "@tabler/icons-react";
import { parseCanonicalResourceUriValid } from "../../lib/atproto/util";
import { getAtprotoHandle, isAtprotoDid, type DidDocument } from "@atcute/identity";
import { useCallback, useState } from "react";
import { useATProtoAuthStore } from "../../lib/atproto/useATProtoStore";
import { handleResolver } from "../../lib/atproto/atproto-services";
import * as TID from "@atcute/tid";

export const EditModalContent = ({
	did,
}: {
	did: AtprotoDid;
}) => {
	const relationships = useQuery<Record<string, BlueDenizPolyRelationship.Main>>({
		queryKey: ["at", did, "blue.deniz.poly.relationship", "*"],
	});

	return (
		<Stack>
			<Collapse in={!relationships.data && relationships.isLoading}>
				<Center w="100%" h="100%">
					<Loader />
				</Center>
			</Collapse>

			<Stack gap={0}>
				{Object.entries(relationships.data ?? {}).map(([rkey, relationship]) => (
					<Relationship key={rkey} rkey={rkey} relationship={relationship} />
				))}
			</Stack>

			<AddRelationship />
		</Stack>
	)
};

export const AddRelationship = () => {
	const [input, setInput] = useState("");

	const mutation = useMutation({
		mutationFn: async (input: string) => {
			const { rpc, agent } = useATProtoAuthStore.getState();

			if (!isAtprotoDid(input)) {
				input = await handleResolver.resolve(input as Handle);
			}

			if (!rpc || !agent) throw new Error("Not authenticated");

			await rpc.post("com.atproto.repo.putRecord", {
				input: {
					repo: agent.sub,
					collection: "blue.deniz.poly.relationship",
					rkey: TID.now(),
					record: {
						$type: "blue.deniz.poly.relationship",
						subject: {
							$type: "blue.deniz.poly.relationship#didLink",
							did: input,
						},
						createdAt: new Date().toISOString(),
					} as BlueDenizPolyRelationship.Main,
				},
			})
		},
		onSuccess: () => {
			setInput("");
		},
	});

	const onSubmit = useCallback(() => {
		if (!input) return;
		mutation.mutate(input);
	}, [input]);

	return (
		<Stack>
			<TextInput
				label="Add relationship"
				description="Enter their handle or DID"
				placeholder="deniz.blue or did:plc:..."
				value={input}
				onChange={(event) => setInput(event.currentTarget.value)}
				onKeyUp={e => e.key == "Enter" && onSubmit()}
				rightSection={(
					<ActionIcon
						onClick={onSubmit}
						loading={mutation.isPending}
						disabled={!isHandle(input)}
					>
						<IconCheck size={16} />
					</ActionIcon>
				)}
			/>
		</Stack>
	)
};

export const Relationship = ({
	relationship,
	rkey,
}: {
	relationship: BlueDenizPolyRelationship.Main;
	rkey: RecordKey;
}) => {
	const [showConfirmation, setShowConfirmation] = useState(false);

	let did: AtprotoDid;

	if (relationship.subject.$type === "blue.deniz.poly.relationship#didLink") did = relationship.subject.did as AtprotoDid;
	else if (relationship.subject.$type === "blue.deniz.poly.relationship#recordLink") {
		const uri = relationship.subject.uri as CanonicalResourceUri;
		const parsed = parseCanonicalResourceUriValid(uri);
		if (!parsed) throw new Error("Invalid URI in relationship subject");
		did = parsed.repo as AtprotoDid;
	} else {
		throw new Error("Unknown relationship type");
	};

	const [deleted, setDeleted] = useState(false);
	const deleteMutation = useMutation({
		mutationFn: async () => {
			const { rpc, agent } = useATProtoAuthStore.getState();
			if (!rpc || !agent) throw new Error("Not authenticated");

			await rpc.post("com.atproto.repo.deleteRecord", {
				input: {
					repo: agent.sub,
					collection: "blue.deniz.poly.relationship",
					rkey,
				},
			});
		},
		onSuccess: () => {
			setDeleted(true);
		},
	});

	const handle = useQuery({
		queryKey: ["didDocument", did],
		select: (doc: DidDocument) => getAtprotoHandle(doc),
	});

	const avatarUrl = `https://blobs.blue/${did}/avatar-thumb`;

	return (
		<Paper w="100%">
			<Group gap={0} wrap="nowrap" align="center">
				<Button
					variant="subtle"
					color="gray"
					size="md"
					flex="1"
					justify="left"
					styles={{
						root: { padding: 4 },
						label: { overflow: "visible" },
						section: { marginInlineStart: 4 },
					}}
					leftSection={(
						<Avatar
							src={avatarUrl}
							size="sm"
						/>
					)}
				>
					<Text span inline inherit fw="normal" c="var(--mantine-color-text)">
						{handle.data ?? did}
					</Text>
				</Button>
				<Menu>
					<Menu.Target>
						<ActionIcon
							size="input-md"
							color="gray"
							variant="subtle"
						>
							<IconDots size={16} />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item
							color="red"
							leftSection={<IconTrash size={16} />}
							onClick={() => setShowConfirmation(true)}
						>
							Remove
						</Menu.Item>
						<Menu.Item
							component="a"
							href={`https://bsky.app/profile/${did}`}
							target="_blank"
							leftSection={<IconExternalLink size={16} />}
						>
							View on bsky.app
						</Menu.Item>
						<Menu.Item
							component="a"
							href={`https://pds.ls/at://${did}`}
							target="_blank"
							leftSection={<IconExternalLink size={16} />}
						>
							View on pds.ls
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>
			<Collapse in={showConfirmation}>
				<Paper p="xs" withBorder>
					<Stack gap={4} align="center">
						<Text fz="sm">Are you sure you want to remove this relationship?</Text>
						<Group justify="center">
							<Button
								color="red"
								size="compact-sm"
								onClick={() => deleteMutation.mutate()}
								loading={deleteMutation.isPending || deleted}
							>
								Yes, remove
							</Button>
							<Button
								size="compact-sm"
								color="green"
								onClick={() => setShowConfirmation(false)}
							>
								No, cancel
							</Button>
						</Group>
					</Stack>
				</Paper>
			</Collapse>
		</Paper>
	);
};
