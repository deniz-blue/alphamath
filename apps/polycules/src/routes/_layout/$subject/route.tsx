import { AtprotoDid, isDid, isHandle, type Did } from "@atcute/lexicons/syntax";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { useGraphStore, type NodeId } from "../../../lib/store";
import { useEffect } from "react";
import { handleResolver } from "../../../lib/atproto/atproto-services";
import { extractDidMethod, isAtprotoDid, isPlcDid, isWebDid } from "@atcute/identity";
import { GraphNode } from "../../../components/svg/GraphNode";
import { parseCanonicalResourceUriValid } from "../../../lib/atproto/util";
import { useQuery } from "@tanstack/react-query";
import type { AppBskyActorProfile } from "@atcute/bluesky";
import { GraphLink } from "../../../components/svg/GraphLink";
import { Menu, Stack } from "@mantine/core";
import { ResolvedActor } from "@atcute/identity-resolver";
import { HostPluralSystemMember, HostPluralSystemProfile } from "../../../lexicons";
import { isBlob } from "@atcute/lexicons/interfaces";

export const Route = createFileRoute("/_layout/$subject")({
	component: RouteComponent,
	beforeLoad: async ({ params }) => {
		if (isHandle(params.subject)) {
			const did = await handleResolver.resolve(params.subject);
			throw redirect({ to: ".", params: { subject: did } });
		}
	},
	params: {
		parse: ({ subject }) => {
			if (!isPlcDid(subject) && !isWebDid(subject)) throw new Error("Invalid DID");
			if (extractDidMethod(subject) !== "plc" && extractDidMethod(subject) !== "web")
				throw new Error("Unsupported DID method");
			return { subject: subject as AtprotoDid };
		},
	},
})

function RouteComponent() {
	const { subject } = Route.useParams();

	const edges = useGraphStore(state => state.edges);
	const nodes = useGraphStore(state => state.nodes);

	useEffect(() => {
		useGraphStore.getState().crawlDid(subject as AtprotoDid);
	}, [subject]);

	console.log({ edges, nodes });

	return (
		<g>
			{edges.map((edge, i) => (
				<GraphLink
					key={i}
					from={edge.from}
					to={edge.to}
				/>
			))}

			{nodes.map(nodeId => (
				<AtGraphNode key={nodeId} nodeId={nodeId} />
			))}

			<Outlet />
		</g>
	)
}

const AtGraphNode = ({ nodeId }: { nodeId: NodeId }) => {
	const type = isDid(nodeId) ? "did" : "uri";
	const did = isAtprotoDid(nodeId) ? nodeId : (parseCanonicalResourceUriValid(nodeId)?.repo as AtprotoDid);
	const rkey = isAtprotoDid(nodeId) ? null : parseCanonicalResourceUriValid(nodeId)?.rkey;

	const qBskyProfile = useQuery<AppBskyActorProfile.Main>({
		queryKey: ["at", did, "app.bsky.actor.profile", "self"],
	});

	const qSystemProfile = useQuery<HostPluralSystemProfile.Main>({
		queryKey: ["at", did, "host.plural.system.profile", "self"],
		enabled: !!rkey,
	});

	const qSystemMember = useQuery<HostPluralSystemMember.Main>({
		queryKey: ["at", did, "host.plural.system.member", rkey!],
		enabled: !!rkey,
	});

	const qIdentity = useQuery<ResolvedActor>({
		queryKey: ["identity", did],
	});

	const avatarCid = isBlob(qSystemMember.data?.avatar) ? qSystemMember.data.avatar.ref.$link : undefined;
	const avatarUrl = avatarCid ? (
		`${qIdentity.data?.pds.replace(/\/$/, "")}/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${avatarCid}`
	) : `https://blobs.blue/${did}/avatar-thumb`;

	return (
		<GraphNode
			nodeId={nodeId}
			avatarUrl={avatarUrl}
			primaryName={qSystemMember.data?.name ?? qBskyProfile.data?.displayName ?? ""}
			secondaryName={qSystemProfile.data?.displayName ?? qIdentity.data?.handle ?? did ?? ""}
			dropdown={<AtNodeDropdown nodeId={nodeId} did={did} />}
		/>
	)
};

const AtNodeDropdown = ({
	nodeId,
	did,
}: {
	nodeId: NodeId;
	did: AtprotoDid;
}) => {
	return (
		<Stack gap={0}>
			<Menu.Item
				component="a"
				href={`https://bsky.app/profile/${did}`}
				target="_blank"
				rel="noopener noreferrer"
			>
				View on bsky.app
			</Menu.Item>
			<Menu.Item
				component="a"
				href={`https://pds.ls/at://${did}`}
				target="_blank"
				rel="noopener noreferrer"
			>
				View on pds.ls
			</Menu.Item>
		</Stack>
	);
};
