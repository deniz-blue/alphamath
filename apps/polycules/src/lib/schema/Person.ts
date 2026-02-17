import { z } from "zod";

export type Person = z.infer<typeof PersonSchema>;
export const PersonSchema = z.object({
    id: z.string(),
    systemId: z.string().optional(),

    name: z.string().default(""),
    avatarUrl: z.string().nullish(),
    color: z.string().nullish(),

    meta: z.record(z.string(), z.string()).optional(),
});
