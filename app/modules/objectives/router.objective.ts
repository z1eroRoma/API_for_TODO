import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { createObjectiveSchema } from "./schemas/create-objective.schema";
import { filterObjectiveFSchema } from "./schemas/filter-objective.schema";
import { updateObjectiveSchema } from "./schemas/update-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/to-do", { schema: { body: createObjectiveSchema } }, objectiveController.createObjective);
    app.patch("/to-do", { schema: { body: updateObjectiveSchema } }, objectiveController.updateObjective);
    app.get("/to-do", { schema: filterObjectiveFSchema }, objectiveController.getObjectives);
    app.get("/to-do/:id", {}, objectiveController.getObjectiveById);
};
