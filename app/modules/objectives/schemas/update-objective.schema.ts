import { z } from "zod";

export const updateObjectiveSchema = z.object({
    id: z.string().uuid(),
    title: z.string().optional(),
    description: z.string().optional(),
    notifyAt: z.string().uuid().optional(),
    isCompleted: z.boolean().optional()
});

export type updateObjectiveSchema = z.infer<typeof updateObjectiveSchema>;