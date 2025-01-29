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

export async function shareObjective(req: FastifyRequest<{ Params: {id: string }; Body: { userId: string} }>, rep: FastifyReply) {
    const { id } = req.params;
    const { userId } = req.body;
    const objective = await objectiveRepository.getById(sqlCon, id);
    if (!objective) {
        return rep.code(HttpStatusCode.NOT_FOUND).send({ message: "Objective not found" });
    }
    if (objective.creatorId !== req.user?.id) {
        return rep.code(HttpStatusCode.FORBIDDEN).send({ message: "Access denied" });
    }
    await objectiveRepository.shareObjective(sqlCon, id, userId);
    return rep.code(HttpStatusCode.OK).send({ message: "Access granted" });
}

export async function revokeObjectiveAccess(req: FastifyRequest<{ Params: { id: string }; Body: { userId: string } }>, rep: FastifyReply) {
    const { id } = req.params;
    const { userId } = req.body;

    // Проверяем, существует ли задача и является ли пользователь её владельцем
    const objective = await objectiveRepository.getById(sqlCon, id);
    if (!objective) {
        return rep.code(HttpStatusCode.NOT_FOUND).send({ message: "Objective not found" });
    }
    if (objective.creatorId !== req.user?.id) {
        return rep.code(HttpStatusCode.FORBIDDEN).send({ message: "Access denied" });
    }

    // Удаляем доступ
    await objectiveRepository.revokeAccess(sqlCon, id, userId);
    return rep.code(HttpStatusCode.OK).send({ message: "Access revoked" });
}

export async function listObjectiveGrants(req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) {
    const { id } = req.params;

    // Проверяем, существует ли задача и есть ли у пользователя доступ к ней
    const hasAccess = await objectiveRepository.hasAccess(sqlCon, id, req.user?.id);
    if (!hasAccess) {
        return rep.code(HttpStatusCode.FORBIDDEN).send({ message: "Access denied" });
    }

    // Получаем список пользователей с доступом
    const grants = await objectiveRepository.listGrants(sqlCon, id);
    return rep.code(HttpStatusCode.OK).send(grants);
}