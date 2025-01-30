import type { FastifyInstance } from "fastify";
import { checkAccess } from "../../common/middleware/check-ownership";
import * as objectiveController from "./controller.objective";
import { createObjectiveSchema } from "./schemas/create-objective.schema";
import { filterObjectiveFSchema } from "./schemas/filter-objective.schema";
import { updateObjectiveSchema } from "./schemas/update-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: { body: createObjectiveSchema } }, objectiveController.createObjective);
    app.patch("/:id", { schema: { body: updateObjectiveSchema } }, objectiveController.updateObjective);
    app.get("/", { schema: filterObjectiveFSchema }, objectiveController.getObjectives);
    app.get("/:id", {}, objectiveController.getObjectiveById);
    app.patch("/:id/share", { preHandler: [checkAccess], schema: { body: updateObjectiveSchema } }, objectiveController.updateObjective);
    app.delete("/:id/revoke", { preHandler: [checkAccess] }, objectiveController.revokeObjective);
    app.get("/:id/list-grants", { preHandler: [checkAccess] }, objectiveController.getObjectiveGrants);
};
