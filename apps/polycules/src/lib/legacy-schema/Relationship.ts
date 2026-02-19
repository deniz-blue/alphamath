import { z } from "zod";
import { LegacyGraphNodeRefSchema } from "./GraphNodeRef";

export type LegacyRelationship = z.infer<typeof LegacyRelationshipSchema>;
export const LegacyRelationshipSchema = z.object({
    id: z.string(),
    from: LegacyGraphNodeRefSchema,
    to: LegacyGraphNodeRefSchema,

    label: z.string().nullish(),
    // might expand!
});
