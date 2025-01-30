import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import * as objectiveRepository from "./repository.objective";
import type { CreateObjectiveRequest } from "./schemas/create-objective.schema";
import type { GetObjectivesRequest } from "./schemas/filter-objective.schema";
import type { IUpdateObjective, ParamsSchema } from "./schemas/update-objective.schema";

import { HttpStatusCode } from "../../common/enum/http-status-code";

export async function createObjective(req: FastifyRequest<CreateObjectiveRequest>, rep: FastifyReply) {
    const objective = await objectiveRepository.insert(sqlCon, req.body);
    return rep.code(HttpStatusCode.CREATED).send(objective);
}

export async function updateObjective(req: FastifyRequest<IUpdateObjective>, rep: FastifyReply) {
    const updateObjective = await objectiveRepository.update(sqlCon, req.body.id, req.body);
    return rep.code(HttpStatusCode.OK).send(updateObjective);
}

export async function getObjectives(req: FastifyRequest<GetObjectivesRequest>, rep: FastifyReply) {
    const objectives = await objectiveRepository.getAll(sqlCon, req.query);
    return rep.code(HttpStatusCode.OK).send(objectives);
}

export async function getObjectiveById(req: FastifyRequest<{ Params: ParamsSchema }>, rep: FastifyReply) {
    const objective = await objectiveRepository.getById(sqlCon, req.params.id);
    if (!objective) {
        return rep.code(HttpStatusCode.NOT_FOUND).send(
            JSON.stringify({
                message: `Objective with ID ${req.params.id} not found`,
                status: HttpStatusCode.NOT_FOUND
            })
        );
    }
    return rep.code(HttpStatusCode.OK).send(objective);
}

export async function shareObjective(req: FastifyRequest<{ Params: { id: string }; Body: { userId: string } }>, rep: FastifyReply) {
    await objectiveRepository.grantAccess(sqlCon, req.params.id, req.body.userId);
    return rep.code(HttpStatusCode.OK).send({ message: "Access granted" });
}

export async function revokeObjective(req: FastifyRequest<{ Params: { id: string }; Body: { userId: string } }>, rep: FastifyReply) {
    await objectiveRepository.revokeAccess(sqlCon, req.params.id, req.body.userId);
    return rep.code(HttpStatusCode.OK).send({ message: "Access revoked" });
}
export async function getObjectiveGrants(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const grants = await objectiveRepository.listGrants(sqlCon, req.params.id);
    return rep.code(HttpStatusCode.OK).send(grants);
}
