import type { FastifySchema } from "fastify";
import { z } from "zod";

const filterObjectiveSchema = z.object({
    search: z.string().optional(),
    sortBy: z.enum(["title", "createdAt", "notifyAt"]).optional(),
    isCompleted: z.boolean().optional(),
    limit: z.number().int().positive().optional(),
    offset: z.number().int().nonnegative().optional(),
});

export type FilterObjectiveSchema = z.infer<typeof filterObjectiveSchema>;

export const filterObjectiveFSchema: FastifySchema = {
    querystring: filterObjectiveSchema
};
