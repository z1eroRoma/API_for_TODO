import { z } from "zod";

export const createObjectiveSchema = z.object({
    title: z.string().max(127),
    description: z.string(),
    creatorId: z.string().uuid(),
    notifyAt: z.string().datetime(),
    isCompleted: z.boolean().default(false),
    updatedAt: z.date()
});

export type CreateObjectiveSchema = z.infer<typeof createObjectiveSchema>;

export interface CreateObjectiveRequest {
    Body: CreateObjectiveSchema;
}
