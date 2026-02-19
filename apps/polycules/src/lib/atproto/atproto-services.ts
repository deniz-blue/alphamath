import type { } from "@atcute/atproto";
import type { } from "@atcute/bluesky";
import { CompositeDidDocumentResolver, LocalActorResolver, PlcDidDocumentResolver, WebDidDocumentResolver, XrpcHandleResolver, CompositeHandleResolver, DohJsonHandleResolver } from "@atcute/identity-resolver";
import { parseResourceUri, type ResourceUri } from "@atcute/lexicons";
import { isHandle, type CanonicalResourceUri } from "@atcute/lexicons/syntax";
import { configureOAuth } from "@atcute/oauth-browser-client";

export const handleResolver = new CompositeHandleResolver({
	methods: {
		dns: new DohJsonHandleResolver({
			dohUrl: "https://cloudflare-dns.com/dns-query",
		}),
		http: new XrpcHandleResolver({
			serviceUrl: "https://public.api.bsky.app",
		}),
	},
});

export const didDocumentResolver = new CompositeDidDocumentResolver({
	methods: {
		plc: new PlcDidDocumentResolver(),
		web: new WebDidDocumentResolver(),
	},
});

export const identityResolver = new LocalActorResolver({
	handleResolver,
	didDocumentResolver,
});

export const resolveUriAsCanonical = async (uri: ResourceUri): Promise<CanonicalResourceUri> => {
	const parsed = parseResourceUri(uri);
	if (!parsed.ok || !parsed.value.collection || !parsed.value.rkey) throw new Error(`Invalid resource URI: ${uri}`);

	if (isHandle(parsed.value.repo)) {
		const did = await handleResolver.resolve(parsed.value.repo);
		return `at://${did}/${parsed.value.collection}/${parsed.value.rkey}`;
	} else {
		return `at://${parsed.value.repo}/${parsed.value.collection}/${parsed.value.rkey}`;
	}
};

if (typeof window !== "undefined") {
	configureOAuth({
		metadata: {
			client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
			redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
		},
		identityResolver,
	});
}
