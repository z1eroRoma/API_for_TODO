import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { createObjectiveSchema } from "./schemas/create-objective.schema";
import { filterObjectiveFSchema } from "./schemas/filter-objective.schema";
import { updateObjectiveSchema } from "./schemas/update-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/to-do", { schema: { body: createObjectiveSchema } }, objectiveController.createObjective);
    app.patch("/to-do/:id", { schema: { body: updateObjectiveSchema } }, objectiveController.updateObjective);
    app.get("/to-do", { schema: filterObjectiveFSchema }, objectiveController.getObjectives);
    app.get("/to-do/:id", {}, objectiveController.getObjectiveById);
};

export async function toDoRouter(app: FastifyInstance) {
    app.get(
        "/",
        {
            schema: {
                summary: "Get all to-dos",
                tags: ["To Do"],
                querystring: {
                    type: "object",
                    properties: {
                        search: { type: "string" },
                        sort: { type: "string", enum: ["title", "createdAt", "notifyAt"] },
                        limit: { type: "integer" },
                        offset: { type: "integer" }
                    }
                },
                response: {
                    200: {
                        description: "List of to-dos",
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string", format: "uuid" },
                                title: { type: "string" },
                                isCompleted: { type: "boolean" }
                            }
                        }
                    }
                }
            }
        },
        async (_req, reply) => {
            reply.send([
                { id: "1", title: "First task", isCompleted: false },
                { id: "2", title: "Second task", isCompleted: true }
            ]);
        }
    );
}
