import "@typelex/emitter";

namespace blue.deniz.poly.relationship {
	@rec("tid")
	model Main {
		/** Relationship to this person */
		@required subject: DidLink | RecordLink;

		/** Used for specifying that a specific system member is the owner of the relationship */
		via?: RecordLink;

		@required createdAt: datetime;
	}

	/** Link to someone using their DID */
	model DidLink {
		@required did: did;
	}

	/** Link to someone using a record, can be a `host.plural.system.member` record for example */
	model RecordLink {
		@required uri: atUri;
	}
}
