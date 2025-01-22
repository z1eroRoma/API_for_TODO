import { Kysely } from "kysely";
import { DB } from "../../common/types/kysely/db.type";

type InsertableObjective = {
    title: string;
    description?: string;
    notifyAt: string;
    isCompleted: boolean;
};

export async function insert(con: Kysely<DB>, data: InsertableObjective) {
    return await con.insertInto("objectives").returningAll().values(data).executeTakeFirstOrThrow();
}

export async function update(con: Kysely<DB>, id: string, data: Partial<InsertableObjective>) {
    return await con.updateTable("objectives").set(data).where("id", "=", id).returningAll().executeTakeFirstOrThrow();
}

export async function getById(con: Kysely<DB>, id: string) {
    return await con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export async function getAll(con: Kysely<DB>, filters: any) {
    let query = con.selectFrom("objectives").selectAll();

    if (filters.search) {
        query = query.where("title", "like", `%${filters.search}%`);
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

    return await query.execute();
}
