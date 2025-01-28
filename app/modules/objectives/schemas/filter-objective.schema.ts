import type { FastifySchema } from "fastify";
import { z } from "zod";

const filterObjectiveSchema = z.object({
    search: z.string().optional(),
    sortBy: z.enum(["title", "createdAt", "notifyAt"]).optional(),
    sortDirection: z.enum(["asc", "desc"]).optional(),
    isCompleted: z.boolean().nullable().transform((val) => val ?? undefined),
    limit: z.number().int().positive().transform(Number),
    offset: z.number().int().nonnegative().transform(Number)
});

export type FilterObjectiveSchema = z.infer<typeof filterObjectiveSchema>;

export const filterObjectiveFSchema: FastifySchema = {
    querystring: filterObjectiveSchema
};

export interface GetObjectivesRequest {
    Querystring: FilterObjectiveSchema;
}
