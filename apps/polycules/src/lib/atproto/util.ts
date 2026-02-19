import { parseCanonicalResourceUri, type CanonicalResourceUri, type Did } from "@atcute/lexicons";
import { didDocumentResolver } from "./atproto-services";
import { getPdsEndpoint } from "@atcute/identity";
import { Client, simpleFetchHandler, type ClientResponse } from "@atcute/client";

const didDocumentCache: Record<string, any> = {};
export const getRpcForDid = async (did: Did<"plc" | "web">) => {
	const didDocument = didDocumentCache[did] ?? await didDocumentResolver.resolve(did);
	didDocumentCache[did] = didDocument;
	const pds = getPdsEndpoint(didDocument) ?? "https://public.api.bsky.app";
	const rpc = new Client({
		handler: simpleFetchHandler({
			service: pds,
		}),
	});
	return rpc;
};

export const parseCanonicalResourceUriValid = (uri: CanonicalResourceUri) => {
	const parsed = parseCanonicalResourceUri(uri);
	if (!parsed.ok) throw new Error(`Invalid canonical resource URI: ${uri}`);
	return parsed.value;
};

export const assertResponse = <TDef, TInit>(response: ClientResponse<TDef, TInit>) => {
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}: ${JSON.stringify(response.data)}`);
	}

	return response.data;
};
