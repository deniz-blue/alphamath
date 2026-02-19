import { useATProtoAuthStore } from "../../lib/atproto/useATProtoStore";
import { ActionIcon, Avatar, Button, Group, Loader, Menu, Paper, Text } from "@mantine/core";
import { IconDots, IconExternalLink, IconX } from "@tabler/icons-react";
import { useState } from "react";
import type { AtprotoDid } from "@atcute/lexicons/syntax";
import { useQuery } from "@tanstack/react-query";
import { getAtprotoHandle, type DidDocument } from "@atcute/identity";

export const ATProtoAccountItem = ({
	did,
	onClick,
}: {
	did: AtprotoDid;
	onClick?: () => void;
}) => {
	const [loading, setLoading] = useState(false);

	const handle = useQuery({
		queryKey: ["didDocument", did],
		select: (doc: DidDocument) => getAtprotoHandle(doc),
	})
	const avatarUrl = `https://blobs.blue/${did}/avatar-thumb`;

	return (
		<Paper w="100%">
			<Group gap={4} wrap="nowrap" align="center">
				<Button
					variant="subtle"
					color="gray"
					size="compact-md"
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
					rightSection={loading ? <Loader size={16} /> : undefined}
					onClick={() => {
						setLoading(true);
						useATProtoAuthStore.getState().signIn(did)
							.then(onClick)
							.finally(() => setLoading(false));
					}}
				>
					<Text span inline inherit fw="normal" c="var(--mantine-color-text)">
						{handle.data ?? did}
					</Text>
				</Button>
				<Menu>
					<Menu.Target>
						<ActionIcon
							size="input-xs"
							color="gray"
							variant="subtle"
						>
							<IconDots size={16} />
						</ActionIcon>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item
							component="a"
							href={`https://pds.ls/at://${did}`}
							target="_blank"
							leftSection={<IconExternalLink size={16} />}
						>
							View on pds.ls
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
							color="red"
							onClick={() => useATProtoAuthStore.getState().signOut(did)}
							leftSection={<IconX size={16} />}
						>
							Sign Out
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>
		</Paper>
	);
}
