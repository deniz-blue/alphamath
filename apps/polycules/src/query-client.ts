import { parseResourceUri, type RecordKey } from "@atcute/lexicons";
import type { Records } from "@atcute/lexicons/ambient";
import { QueryClient } from "@tanstack/react-query";
import { assertResponse, getRpcForDid } from "./lib/atproto/util";
import type { AtprotoDid, Nsid } from "@atcute/lexicons/syntax";
import { didDocumentResolver } from "./lib/atproto/atproto-services";

type AtRecordQueryKey = ["at", AtprotoDid, keyof Records, RecordKey | "*"];
type DidDocumentQueryKey = ["didDocument", AtprotoDid];
type QueryKey = AtRecordQueryKey | DidDocumentQueryKey;

declare module "@tanstack/react-query" {
	interface Register {
		queryKey: QueryKey;
	}
}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60_000,
			queryFn: async ({ queryKey }) => {
				if (queryKey[0] === "at") {
					const [_at, repo, collection, rkey] = queryKey;
					if (rkey === "*") return await fetchAllRecords(repo, collection);
					else return await fetchRecord(repo, collection, rkey);
				} else if (queryKey[0] === "didDocument") return await didDocumentResolver.resolve(queryKey[1] as AtprotoDid);
				else throw new Error("Invalid query key");
			},
		},
	},
});

const fetchRecord = async (repo: AtprotoDid, collection: Nsid, rkey: string) => {
	const rpc = await getRpcForDid(repo);
	return assertResponse(await rpc.get("com.atproto.repo.getRecord", {
		params: {
			repo,
			collection,
			rkey,
		},
	})).value;
};

const fetchAllRecords = async (repo: AtprotoDid, collection: Nsid) => {
	const rpc = await getRpcForDid(repo);
	let records: Record<string, unknown> = {};
	let cursor: string | undefined = undefined;

	do {
		const res = assertResponse(await rpc.get("com.atproto.repo.listRecords", {
			params: {
				repo,
				collection,
				cursor,
			},
		}));

		for (const r of res.records) {
			const parsed = parseResourceUri(r.uri);
			if (!parsed.ok || !parsed.value.rkey) continue;
			records[parsed.value.rkey] = r.value;
		};

		(cursor as any) = res.cursor;
	} while (cursor);

	return records;
};
