import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import * as objectiveRepository from "./repository.objective";
import type { createObjectiveSchema } from "./schemas/create-objective.schema";
import type { updateObjectiveSchema } from "./schemas/update-objective.schema";

import { HttpStatusCode } from "../../common/enum/http-status-code";

export async function createObjective(req: FastifyRequest<{ Body: createObjectiveSchema }>, rep: FastifyReply) {
    const objective = await objectiveRepository.insert(sqlCon, req.body);
    return rep.code(HttpStatusCode.CREATED).send(objective);
}

export async function updateObjective(req: FastifyRequest<{ Body: updateObjectiveSchema }>, rep: FastifyReply) {
    const updateObjective = await objectiveRepository.update(sqlCon, req.body.id, req.body);
    return rep.code(HttpStatusCode.OK).send(updateObjective);
}

export async function getObjectives(req: FastifyRequest, rep: FastifyReply) {
    const { search, sortBy, isCompleted, limit, offset } = req.query as any;
    const objectives = await objectiveRepository.getAll(sqlCon, { search, sortBy, isCompleted, limit, offset });
    return rep.code(HttpStatusCode.OK).send(objectives);
}

export async function getObjectiveById(req: FastifyRequest, rep: FastifyReply) {
    const { id } = req.params as any;
    const objective = await objectiveRepository.getById(sqlCon, id);
    return rep.code(HttpStatusCode.OK).send(objective);
}

//спросить у gpt что за ошибки показывает, и узнать где потерялся код для filter