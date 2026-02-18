import { z } from "zod";
import { PersonSchema } from "./Person";
import { SystemSchema } from "./System";
import { RelationshipSchema } from "./Relationship";
import { GroupRelationshipSchema } from "./GroupRelationship";

export type PolyculeManifest = z.infer<typeof PolyculeManifestSchema>;
export const PolyculeManifestSchema = z.object({
    v: z.literal(1),
    people: PersonSchema.array(),
    systems: SystemSchema.array(),
    relationships: RelationshipSchema.array(),
    groupRelationships: GroupRelationshipSchema.array(),
});
