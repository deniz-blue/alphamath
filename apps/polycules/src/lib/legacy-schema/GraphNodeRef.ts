import { z } from "zod";
import type { LegacyPerson } from "./Person";
import type { LegacySystem } from "./System";

export type LegacyGraphNodeRef = z.infer<typeof LegacyGraphNodeRefSchema>;
export const LegacyGraphNodeRefSchema = z.object({
    type: z.enum(["system", "person"]),
    id: z.string(),
});

export type LegacyGraphNode =
    | { type: "person"; data: LegacyPerson }
    | { type: "system"; data: LegacySystem };
