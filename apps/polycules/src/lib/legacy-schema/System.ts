import { z } from "zod";

export type LegacySystem = z.infer<typeof LegacySystemSchema>;
export const LegacySystemSchema = z.object({
    id: z.string(),
    memberIds: z.string().array(),

    name: z.string().default(""),
    avatarUrl: z.string().nullish(),
    color: z.string().nullish(),

    meta: z.record(z.string(), z.string()).optional(),
});
