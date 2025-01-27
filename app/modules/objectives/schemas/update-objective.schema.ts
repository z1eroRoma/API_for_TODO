import { FastifySchema } from "fastify";
import { z } from "zod";

export const updateObjectiveSchema = z.object({
    id: z.string().uuid(),
    title: z.string().optional(),
    description: z.string().optional(),
    notifyAt: z.string().uuid().optional(),
    isCompleted: z.boolean().optional()
});

export const paramsSchema = z.object({
    id: z.string().uuid()
});

export type UpdateObjectiveSchema = z.infer<typeof updateObjectiveSchema>;
export type ParamsSchema = z.infer<typeof paramsSchema>;

export const updateObjectiveFSchema: FastifySchema = { params: paramsSchema, body: updateObjectiveSchema };

export interface IUpdateObjective {
    Body: UpdateObjectiveSchema;
    Params: ParamsSchema;
}
