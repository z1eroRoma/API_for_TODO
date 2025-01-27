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
    const { search, sortBy, isCompleted, limit, offset } = req.query as any;
    const objectives = await objectiveRepository.getAll(sqlCon, { search, sortBy, isCompleted, limit, offset });
    return rep.code(HttpStatusCode.OK).send(objectives);
}

export async function getObjectiveById(req: FastifyRequest<{ Params: ParamsSchema }>, rep: FastifyReply) {
    const objective = await objectiveRepository.getById(sqlCon, req.params.id);
    return rep.code(HttpStatusCode.OK).send(objective);
}
