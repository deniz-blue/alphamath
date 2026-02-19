import { z } from "zod";
import { LegacyPersonSchema } from "./Person";
import { LegacySystemSchema } from "./System";
import { LegacyRelationshipSchema } from "./Relationship";

export type LegacyPolyculeManifest = z.infer<typeof LegacyPolyculeManifestSchema>;
export const LegacyPolyculeManifestSchema = z.object({
    v: z.literal(1),
    people: LegacyPersonSchema.array(),
    systems: LegacySystemSchema.array(),
    relationships: LegacyRelationshipSchema.array(),
});
