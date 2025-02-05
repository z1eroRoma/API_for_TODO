import { z } from "zod";

export const shareObjectiveSchema = z.object({
    userId: z.string().uuid(),
    title: z.string().optional(),
    description: z.string().optional(),
    notifyAt: z.string().uuid().optional(),
    isCompleted: z.boolean().optional()
});

export type ShareObjectiveSchema = z.infer<typeof shareObjectiveSchema>;

export interface ShareObjectiveRequest {
    Body: ShareObjectiveSchema;
}
