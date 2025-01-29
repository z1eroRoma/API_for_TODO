import { FastifyReply, FastifyRequest } from "fastify";
import { Kysely } from "kysely";
import { HttpStatusCode } from "../enum/http-status-code";
import { DB } from "../types/kysely/db.type";

interface OwnershipParams {
    id: string;
}

export const createCheckOwnership = (db: Kysely<DB>) => {
    return async (req: FastifyRequest<{ Params: OwnershipParams }>, rep: FastifyReply) => {
        const userId = req.user?.id;
        if (!userId) {
            return rep.status(HttpStatusCode.UNAUTHORIZED).send({ message: "Unauthorized" });
        }
        const objective = await db.selectFrom("objectives").select(["id", "creatorId"]).where("id", "=", req.params.id).executeTakeFirst();
        if (!objective) {
            return rep.status(HttpStatusCode.NOT_FOUND).send({ message: "Objective not found" });
        }
        if (objective.creatorId !== userId) {
            return rep.status(HttpStatusCode.FORBIDDEN).send({ message: "Access denied" });
        }
    }


};
