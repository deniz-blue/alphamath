import { ActionIcon, Anchor, Avatar, Button, Center, Collapse, Divider, Group, Input, Loader, Menu, Paper, Select, SelectProps, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { BlueDenizPolyRelationship, HostPluralSystemMember, HostPluralSystemProfile } from "../../lexicons";
import { isHandle, type AtprotoDid, type CanonicalResourceUri, type Handle, type RecordKey } from "@atcute/lexicons/syntax";
import { IconAt, IconCheck, IconDots, IconExternalLink, IconPlus, IconTrash } from "@tabler/icons-react";
import { parseCanonicalResourceUriValid } from "../../lib/atproto/util";
import { isAtprotoDid } from "@atcute/identity";
import { ReactNode, useCallback, useState } from "react";
import { useATProtoAuthStore } from "../../lib/atproto/useATProtoStore";
import * as TID from "@atcute/tid";
import { ResolvedActor } from "@atcute/identity-resolver";
import { notifications } from "@mantine/notifications";
import { AppBskyActorProfile } from "@atcute/bluesky";
import { isBlob } from "@atcute/lexicons/interfaces";

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
			<Divider label="Add Relationship" />

			<AddRelationship did={did} />

			<Divider label="My Relationships" />

			<Collapse in={!relationships.data && relationships.isLoading}>
				<Center w="100%" h="100%">
					<Loader />
				</Center>
			</Collapse>

			<Stack gap={0}>
				{Object.entries(relationships.data ?? {}).map(([rkey, relationship]) => (
					<Relationship key={rkey} rkey={rkey} relationship={relationship} />
				))}

				{relationships.data && Object.keys(relationships.data).length === 0 && (
					<Text c="dimmed" ta="center">
						No relationships found.
					</Text>
				)}
			</Stack>

			<Divider label="People who have relationships with this actor" />

			<Text c="dimmed" ta="center">
				TODO...
			</Text>
		</Stack>
	)
};

export const AddRelationship = ({
	did,
}: {
	did: AtprotoDid;
}) => {
	const [toInput, setToInput] = useState("");
	const [fromMemberRkey, setFromMemberRkey] = useState<string | null>(null);
	const [toMemberRkey, setToMemberRkey] = useState<string | null>(null);

	const toIdentity = useQuery<ResolvedActor>({
		enabled: isHandle(toInput) || isAtprotoDid(toInput),
		queryKey: ["identity", toInput as AtprotoDid | Handle],
	});

	const qHasMembers = useQuery({
		queryKey: ["at", did, "host.plural.system.member", "*"],
		select: (members: Record<string, HostPluralSystemMember.Main>) => Object.keys(members).length > 0,
	});

	const mutation = useMutation({
		mutationFn: async ({
			fromMemberRecordKey,
			toDid,
			toMemberRecordKey,
		}: {
			fromMemberRecordKey: string | null,
			toDid: AtprotoDid,
			toMemberRecordKey: string | null,
		}) => {
			const { rpc, agent } = useATProtoAuthStore.getState();

			if (!rpc || !agent) throw new Error("Not authenticated");

			await rpc.post("com.atproto.repo.putRecord", {
				input: {
					repo: agent.sub,
					collection: "blue.deniz.poly.relationship",
					rkey: TID.now(),
					record: {
						$type: "blue.deniz.poly.relationship",
						via: fromMemberRecordKey ? {
							$type: "blue.deniz.poly.relationship#recordLink",
							uri: `at://${did}/host.plural.system.member/${fromMemberRecordKey}`,
						} : undefined,
						subject: toMemberRecordKey ? {
							$type: "blue.deniz.poly.relationship#recordLink",
							uri: `at://${toDid}/host.plural.system.member/${toMemberRecordKey}`,
						} : {
							$type: "blue.deniz.poly.relationship#didLink",
							did: toDid,
						},
						createdAt: new Date().toISOString(),
					} as BlueDenizPolyRelationship.Main,
				},
			})
		},
		onSuccess: () => {
			setToInput("");
			setFromMemberRkey(null);
			setToMemberRkey(null);
		},
		onError: (error) => {
			console.error("Failed to add relationship", error);
			notifications.show({
				title: "Failed to add relationship",
				message: "An error occurred while adding the relationship. Please try again.",
				color: "red",
			});
		},
	});

	const onAddRelationship = useCallback(() => {
		if (!toIdentity.data?.did) return;
		mutation.mutate({
			toDid: toIdentity.data.did as AtprotoDid,
			fromMemberRecordKey: fromMemberRkey,
			toMemberRecordKey: toMemberRkey,
		});
	}, [fromMemberRkey, toMemberRkey, mutation, toIdentity]);

	return (
		<Stack
			align="center"
			w="100%"
		>
			<SimpleGrid
				cols={{ base: 1, sm: qHasMembers.data ? 2 : 1 }}
				w="100%"
			>
				{qHasMembers.data && (
					<MemberPicker
						did={did}
						value={fromMemberRkey}
						onChange={setFromMemberRkey}
						label="From"
						description="Member of the relationship, if any"
						bottomLabel={(
							<Text span inherit>
								Members are from <Anchor href="https://plural.host" target="_blank" inherit>plural.host</Anchor>
							</Text>
						)}
					/>
				)}
				<Stack gap={4}>
					<TextInput
						label="To"
						description="User handle or DID"
						placeholder="alice.bsky.social or did:plc:..."
						value={toInput}
						onChange={(event) => setToInput(event.currentTarget.value)}
						onKeyUp={e => e.key == "Enter" && onAddRelationship()}
						leftSection={<IconAt size={18} />}
						rightSection={toIdentity.isLoading ? <Loader size={16} /> : null}
						error={toInput && toIdentity.isError ? "Invalid handle or DID" : undefined}
					/>
					<Collapse in={toIdentity.isError}>
						<Text c="red" fz="sm">
							Invalid handle or DID
						</Text>
					</Collapse>
					{toIdentity.data && (
						<MemberPicker
							did={toIdentity.data!.did as AtprotoDid}
							value={toMemberRkey}
							onChange={setToMemberRkey}
						/>
					)}
				</Stack>
			</SimpleGrid>

			<Button
				onClick={onAddRelationship}
				loading={mutation.isPending}
				disabled={!toIdentity.data}
				justify="center"
				leftSection={<IconPlus size={16} />}
			>
				Add Relationship
			</Button>
		</Stack>
	)
};

export const MemberPicker = ({
	did,
	value,
	onChange,
	bottomLabel,
	description,
	label,
}: {
	did: AtprotoDid;
	value: string | null;
	onChange: (value: string | null) => void;
	label?: ReactNode;
	description?: ReactNode;
	bottomLabel?: ReactNode;
}) => {
	const systemProfileQuery = useQuery<HostPluralSystemProfile.Main>({
		queryKey: ["at", did, "host.plural.system.profile", "self"],
	});

	const systemMembersQuery = useQuery<Record<string, HostPluralSystemMember.Main>>({
		queryKey: ["at", did, "host.plural.system.member", "*"],
	});

	const systemMembers = systemMembersQuery.data ?? {};

	const renderFromOption: SelectProps["renderOption"] = ({ option, checked }) => (
		<Group flex="1" gap="xs">
			{option.label}
			{checked && <IconCheck style={{ marginInlineStart: 'auto' }} />}
		</Group>
	);

	let systemLabel = systemProfileQuery.data?.displayName ? `System (${systemProfileQuery.data.displayName})` : (
		systemProfileQuery.data ? "System" : "User"
	);

	return (
		<Stack gap={4}>
			<Select
				label={label}
				description={description}
				value={value ?? ""}
				onChange={v => onChange(v || null)}
				data={[
					{ value: "", label: systemLabel },
					...(Object.entries(systemMembers).map(([rkey, member]) => ({
						value: rkey,
						label: member.displayName ?? rkey,
					}))),
				]}
				renderOption={renderFromOption}
			/>
			<Input.Description>
				{bottomLabel}
			</Input.Description>
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
	let memberRkey: string | null = null;

	if (relationship.subject.$type === "blue.deniz.poly.relationship#didLink") did = relationship.subject.did as AtprotoDid;
	else if (relationship.subject.$type === "blue.deniz.poly.relationship#recordLink") {
		const uri = relationship.subject.uri as CanonicalResourceUri;
		const parsed = parseCanonicalResourceUriValid(uri);
		if (!parsed) throw new Error("Invalid URI in relationship subject");
		did = parsed.repo as AtprotoDid;
		memberRkey = parsed.rkey;
	} else {
		throw new Error("Unknown relationship type");
	};

	const qBlueSkyProfile = useQuery<AppBskyActorProfile.Main>({
		queryKey: ["at", did, "app.bsky.actor.profile", "self"],
	});

	const qSystemMember = useQuery<HostPluralSystemMember.Main>({
		queryKey: ["at", did, "host.plural.system.member", memberRkey!],
		enabled: !!memberRkey,
	});

	const qSystemProfile = useQuery<HostPluralSystemProfile.Main>({
		queryKey: ["at", did, "host.plural.system.profile", "self"],
		enabled: !!memberRkey,
	});

	const qIdentity = useQuery<ResolvedActor>({
		queryKey: ["identity", did],
	});

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

	const avatarCid = isBlob(qSystemMember.data?.avatar) ? qSystemMember.data.avatar.ref.$link : undefined;
	const avatarUrl = avatarCid ? (
		`${qIdentity.data?.pds.replace(/\/$/, "")}/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${avatarCid}`
	) : `https://blobs.blue/${did}/avatar-thumb`;

	const title = memberRkey
		? (qSystemMember.data?.displayName ?? qSystemMember.data?.name ?? memberRkey)
		: (qBlueSkyProfile.data?.displayName ?? did);

	const systemTitle = memberRkey
		? (qSystemProfile.data?.displayName ?? "System")
		: "";

	const handle = qIdentity.data?.handle
		? `@${qIdentity.data.handle}`
		: did;

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
					<Stack
						c="var(--mantine-color-text)"
						fw="normal"
						ta="start"
						gap={4}
					>
						<Text span inline inherit>
							{title}
						</Text>
						<Text span inline c="dimmed" fz="xs">
							{systemTitle ? `${systemTitle} - ` : ""}{handle}
						</Text>
					</Stack>
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
