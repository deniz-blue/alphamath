import type { Records } from "@atcute/lexicons/ambient";
import { createJetstream } from "./lib/atproto/jetstream";
import { useATProtoAuthStore } from "./lib/atproto/useATProtoStore";
import { queryClient } from "./query-client";
import type { AtprotoDid } from "@atcute/lexicons/syntax";
import { useGraphStore } from "./lib/store";

useATProtoAuthStore.getState().initialize();

const { subscription } = createJetstream({
	localStorageKey: "poly.deniz.blue:jetstream-cursor",
	wantedDids: [],
	wantedCollections: [
		"app.bsky.actor.profile",
		"blue.deniz.poly.relationship",
		"host.plural.system.profile",
		"host.plural.system.member",
	] as (keyof Records)[],
	onCommit: async (event) => {
		console.log("Jetstream event", event);
		const { did, commit: { collection, rkey } } = event;
		await queryClient.invalidateQueries({
			queryKey: ["at", did as AtprotoDid, collection as keyof Records, rkey],
		});
		await queryClient.invalidateQueries({
			queryKey: ["at", did as AtprotoDid, collection as keyof Records, "*"],
		});

		if (collection === "blue.deniz.poly.relationship") {
			if (event.commit.operation === "delete") useGraphStore.getState().processRelationshipDelete(did as AtprotoDid);
			else useGraphStore.getState().processRelationshipRecord(did as AtprotoDid, event.commit.record as any);
		};
	},
});

queryClient.getQueryCache().subscribe(event => {
	if (event.type !== "added" && event.type !== "removed") return;
	if (!event.query.queryKey || event.query.queryKey[0] !== "at") return;

	let wantedDids = queryClient
		.getQueryCache()
		.getAll()
		.filter(query => query.queryKey?.[0] === "at")
		.map(query => query.queryKey?.[1] as AtprotoDid);

	wantedDids = Array.from(new Set(wantedDids));

	subscription.updateOptions({
		wantedDids,
	});

	console.log("Updated wanted DIDs for Jetstream subscription", wantedDids);
})
