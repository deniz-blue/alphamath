import { z } from "zod";
import { GraphNodeRefSchema } from "./GraphNodeRef";

export type Relationship = z.infer<typeof RelationshipSchema>;
export const RelationshipSchema = z.object({
    id: z.string(),
    from: GraphNodeRefSchema,
    to: GraphNodeRefSchema,

    label: z.string().nullish(),
    // might expand!
});
