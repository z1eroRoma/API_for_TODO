import type { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { createObjectiveSchema } from "./schemas/create-objective.schema";
import { filterObjectiveFSchema } from "./schemas/filter-objective.schema";
import { updateObjectiveSchema } from "./schemas/update-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: { body: createObjectiveSchema } }, objectiveController.createObjective);
    app.patch("/:id", { schema: { body: updateObjectiveSchema } }, objectiveController.updateObjective);
    app.get("/", { schema: filterObjectiveFSchema }, objectiveController.getObjectives);
    app.get("/:id", {}, objectiveController.getObjectiveById);
};
