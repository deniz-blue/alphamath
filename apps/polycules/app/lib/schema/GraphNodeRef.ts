import { z } from "zod";
import type { Person } from "./Person";
import type { System } from "./System";

export type GraphNodeRef = z.infer<typeof GraphNodeRefSchema>;
export const GraphNodeRefSchema = z.object({
    type: z.enum(["system", "person"]),
    id: z.string(),
});

export type GraphNode =
    | { type: "person"; data: Person }
    | { type: "system"; data: System };
