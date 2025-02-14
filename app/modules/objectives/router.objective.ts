import type { FastifyInstance } from "fastify";
import { checkCreatorAccess, checkSharedAccess } from "../../common/middleware/guard";
import * as objectiveController from "./controller.objective";
import { createObjectiveSchema } from "./schemas/create-objective.schema";
import { filterObjectiveFSchema } from "./schemas/filter-objective.schema";
import { shareObjectiveSchema } from "./schemas/share-objective.schema";
import { updateObjectiveSchema } from "./schemas/update-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: { body: createObjectiveSchema } }, objectiveController.createObjective);
    app.patch("/:id", { preHandler: app.auth([checkCreatorAccess]), schema: { body: updateObjectiveSchema } }, objectiveController.updateObjective);
    app.get("/", { schema: filterObjectiveFSchema }, objectiveController.getObjectives);
    app.get("/:id", { preHandler: [app.auth([checkCreatorAccess, checkSharedAccess])] }, objectiveController.getObjectiveById);
    app.patch("/:id/share", { preHandler: app.auth([checkCreatorAccess]), schema: { body: shareObjectiveSchema } }, objectiveController.shareObjective);
    app.delete("/:id/revoke", { preHandler: app.auth([checkCreatorAccess]) }, objectiveController.revokeObjective);
    app.get("/:id/list-grants", { preHandler: app.auth([checkCreatorAccess]) }, objectiveController.getObjectiveGrants);
};
