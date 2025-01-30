import { FastifyReply, FastifyRequest } from "fastify";
import * as objectiveRepository from "../../modules/objectives/repository.objective";
import { sqlCon } from "../config/kysely-config";

export async function checkAccess(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const userId = req.user.id;
    const hasPermission = await objectiveRepository.hasAccess(sqlCon, <string>userId, req.params.id);
    if (!hasPermission) {
        return rep.code(403).send({ message: "Forbidden" });
    }
}

export async function checkOwnership(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const objective = await objectiveRepository.getById(sqlCon, req.params.id);
    if (!objective || objective.creatorId !== req.user.id) {
        return rep.code(403).send({ message: "Forbidden" });
    }
}
