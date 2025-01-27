import { Insertable, Kysely, Updateable } from "kysely";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { DB, Objectives } from "../../common/types/kysely/db.type";

type InsertableObjective = Insertable<Objectives>;
type UpdateablyObjective = Updateable<Objectives>;

export async function insert(con: Kysely<DB>, data: InsertableObjective) {
    return await con.insertInto("objectives").returningAll().values(data).executeTakeFirstOrThrow();
}

export async function update(con: Kysely<DB>, id: string, data: UpdateablyObjective) {
    return await con.updateTable("objectives").set(data).where("id", "=", id).returningAll().executeTakeFirst();
}

export async function getById(con: Kysely<DB>, id: string) {
    const objective = await con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
    if (!objective) {
        throw new Error(
            JSON.stringify({
                message: `Objective with ID ${id} not found`,
                status: HttpStatusCode.NOT_FOUND
            })
        );
    }
    return objective;
}

export async function getAll(con: Kysely<DB>, filters: any) {
    let query = con.selectFrom("objectives").selectAll();

    if (filters.search) {
        query = query.where("title", "ilike", `%${filters.search}%`);
    }
    if (filters.isCompleted !== undefined) {
        query = query.where("isCompleted", "=", filters.isCompleted);
    }
    if (filters.sortBy) {
        query = query.orderBy(filters.sortBy, "asc");
    }
    if (filters.limit) {
        query = query.limit(filters.limit);
    }
    if (filters.offset) {
        query = query.offset(filters.offset);
    }
    const objectives = await query.execute();
    if (!objectives || objectives.length === 0) {
        throw new Error(
            JSON.stringify({
                message: "No objectives found for the provided filters",
                status: HttpStatusCode.NOT_FOUND
            })
        );
    }
    return objectives;
}
