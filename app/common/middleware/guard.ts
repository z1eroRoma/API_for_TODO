import { FastifyRequest } from "fastify";
import { Kysely } from "kysely";
import { getById, hasAccess } from "../../modules/objectives/repository.objective";
import { AccessDeniedException } from "../exceptions/custom-exception";
import { DB } from "../types/kysely/db.type";

export async function checkCreatorAccess(req: FastifyRequest<{ Params: { id: string } }>) {
    const userId = req.user!.id;
    const objectiveId = req.params.id;
    const objective = await getById(req.server.sqlCon as Kysely<DB>, objectiveId);
    if (!objective) {
        throw new AccessDeniedException("Objective not found or access denied");
    }
    if (objective.creatorId !== userId) {
        throw new AccessDeniedException("You are not the creator of this objective");
    }
    return;
}

export async function checkSharedAccess(req: FastifyRequest<{ Params: { id: string } }>) {
    const userId = req.user?.id;
    if (!userId) {
        throw new AccessDeniedException("User is not authenticated");
    }
    const objectiveId = req.params.id;

    const hasAccessToObjective = await hasAccess(req.server.sqlCon as Kysely<DB>, userId, objectiveId);
    if (!hasAccessToObjective) {
        throw new AccessDeniedException("You do not have access to this objective");
    }
    return;
}
