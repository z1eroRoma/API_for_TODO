import { FastifyReply, FastifyRequest } from "fastify";
import { Kysely } from "kysely";
import { HttpStatusCode } from "../enum/http-status-code";
import { DB } from "../types/kysely/db.type";

interface AccessParams {
    id: string;
}

export const createCheckAccess = (db: Kysely<DB>) => {
    return async (req: FastifyRequest<{ Params: AccessParams }>, rep: FastifyReply) => {
        const userId = req.user?.id;
        if (!userId) {
            return rep.status(HttpStatusCode.UNAUTHORIZED).send({ message: "Unauthorized" });
        }
        const objective = await db
            .selectFrom("objectives")
            .leftJoin("user_objective_shares", "user_objective_shares.objectheld", "objectives.id")
            .select(["objectives.id", "objectives.creatorId", "user_objective_shares.userful"])
            .where("objectives.id", "=", req.params.id)
            .where((eb) => eb.or([eb("objectives.creatorId", "=", userId), eb("user_objective_shares.userful", "=", userId)]))
            .executeTakeFirst();
        if (!objective) {
            return rep.status(HttpStatusCode.NOT_FOUND).send({ message: "Objective not found or access denied" });
        }
    };
};
