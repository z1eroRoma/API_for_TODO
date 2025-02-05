import { Kysely } from "kysely";
import { DB } from "./kysely/db.type"; // Путь до `db.type.ts`

declare module "fastify" {
    interface FastifyInstance {
        db: Kysely<DB>;
        sqlCon: Kysely<DB>;
    }
}
