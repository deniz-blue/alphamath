import { JetstreamSubscription, type CommitEvent } from "@atcute/jetstream";
import type { AtprotoDid } from "@atcute/lexicons/syntax";

export const createJetstream = ({
	onCommit,
	wantedCollections,
	wantedDids,
	localStorageKey,
	url = "wss://jetstream2.us-east.bsky.network",
}: {
	onCommit?: (event: CommitEvent) => void;
	wantedCollections?: string[];
	wantedDids?: AtprotoDid[];
	localStorageKey?: string;
	url?: string;
}) => {
	let unmounted = false;
	const subscription = new JetstreamSubscription({
		url,
		wantedCollections,
		wantedDids,
		cursor: localStorageKey ? (Number(localStorage.getItem(localStorageKey)) ?? undefined) : undefined,
		onConnectionOpen: () => console.log("Jetstream: Connection opened"),
		onConnectionClose: () => console.log("Jetstream: Connection closed"),
		onConnectionError: (error) => console.log("Jetstream: Connection error:", error),
	});

	console.log("Jetstream: Initialized");

	(async () => {
		for await (const event of subscription) {
			if (unmounted) break;
			if (event.kind == "commit") {
				console.log("Jetstream: Commit:", event);
				onCommit?.(event);
			}
		}
	})();

	const interval = setInterval(() => {
		if (!localStorageKey) return;
		localStorage.setItem(localStorageKey, String(subscription.cursor));
	}, 5_000);

	return {
		subscription,
		unsubscribe: () => {
			unmounted = true;
			clearInterval(interval);
			console.log("Jetstream: Unsubscribed");
		},
	};
};
