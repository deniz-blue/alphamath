import { isDid, isHandle, type Did } from "@atcute/lexicons/syntax";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { useGraphStore, type NodeId } from "../../../lib/store";
import { useEffect } from "react";
import { handleResolver } from "../../../lib/atproto/atproto-services";
import { extractDidMethod, getAtprotoHandle, isAtprotoDid, isPlcDid, isWebDid, type DidDocument } from "@atcute/identity";
import { GraphNode } from "../../../components/svg/GraphNode";
import { parseCanonicalResourceUriValid } from "../../../lib/atproto/util";
import { useQuery } from "@tanstack/react-query";
import type { AppBskyActorProfile } from "@atcute/bluesky";
import { GraphLink } from "../../../components/svg/GraphLink";
import { Menu, Stack } from "@mantine/core";

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
			return { subject: subject as Did<"plc" | "web"> };
		},
	},
})

function RouteComponent() {
	const { subject } = Route.useParams();

	const edges = useGraphStore(state => state.edges);
	const nodes = useGraphStore(state => state.nodes);

	useEffect(() => {
		useGraphStore.getState().addToGraph(subject as Did<"plc" | "web">);
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
	const did = isAtprotoDid(nodeId) ? nodeId : (parseCanonicalResourceUriValid(nodeId)?.repo as Did<"plc" | "web">);

	const profile = useQuery<AppBskyActorProfile.Main>({
		queryKey: ["at", did, "app.bsky.actor.profile", "self"],
	});

	const handle = useQuery({
		queryKey: ["didDocument", did],
		select: (doc: DidDocument) => getAtprotoHandle(doc),
	});

	return (
		<GraphNode
			nodeId={nodeId}
			avatarUrl={`https://blobs.blue/${did}/avatar`}
			primaryName={profile.data?.displayName ?? ""}
			secondaryName={handle.data ?? did ?? ""}
			dropdown={<AtNodeDropdown nodeId={nodeId} did={did} />}
		/>
	)
};

const AtNodeDropdown = ({
	nodeId,
	did,
}: {
	nodeId: NodeId;
	did: Did;
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
