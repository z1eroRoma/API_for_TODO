import { z } from "zod";

export const createObjectiveSchema = z.object({
    title: z.string().max(127),
    description: z.string().optional(),
    notifyAt: z.string().uuid(),
    isCompleted: z.boolean().default(false)
});

export type createObjectiveSchema = z.infer<typeof createObjectiveSchema>;

