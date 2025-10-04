import { z } from "zod";
import { GraphNodeRefSchema } from "./GraphNodeRef";

export type GroupRelationship = z.infer<typeof GroupRelationshipSchema>;
export const GroupRelationshipSchema = z.object({
    id: z.string(),
    memberIds: GraphNodeRefSchema.array(),
    
    // todo!
});
