import { document, object, record, ref, required, string, union } from '@atcute/lexicon-doc/builder';

export default document({
	id: "blue.deniz.poly.relationship",
	defs: {
		main: record({
			key: "tid",
			description: "A relationship between two subjects",
			record: object({
				properties: {
					via: ref({ ref: "#recordLink" }),
					subject: required(union({
						refs: [
							ref({ ref: "#didLink" }),
							ref({ ref: "#recordLink" }),
						],
					})),
					createdAt: required(string({ format: 'datetime' })),
				},
			}),
		}),

		didLink: object({
			description: "A link to someone using their DID",
			properties: {
				did: required(string({ format: "did" })),
			},
		}),

		recordLink: object({
			description: "Link to someone using a record, can be a `host.plural.system.member` record for example",
			properties: {
				uri: required(string({ format: "at-uri" })),
			},
		}),
	},
});
