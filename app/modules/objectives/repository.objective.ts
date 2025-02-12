import { Insertable, Kysely, Updateable } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { FilterObjectiveSchema } from "./schemas/filter-objective.schema";

type InsertableObjective = Insertable<Objectives>;
type UpdateablyObjective = Updateable<Objectives>;
type InsertableObjectiveShare = Insertable<DB["user_objective_shares"]>;

export async function insert(con: Kysely<DB>, data: InsertableObjective) {
    return await con.insertInto("objectives").returningAll().values(data).executeTakeFirstOrThrow();
}

export async function update(con: Kysely<DB>, id: string, data: UpdateablyObjective) {
    return await con.updateTable("objectives").set(data).where("id", "=", id).returningAll().executeTakeFirst();
}

export async function getById(con: Kysely<DB>, id: string) {
    const objective = await con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
    return objective;
}

export async function getAll(con: Kysely<DB>, filters: FilterObjectiveSchema) {
    let query = con.selectFrom("objectives").selectAll();

    if (filters.search) {
        query = query.where("title", "ilike", `%${filters.search}%`);
    }
    if (filters.isCompleted !== undefined) {
        query = query.where("isCompleted", "=", filters.isCompleted);
    }
    if (filters.sortBy) {
        query = query.orderBy(filters.sortBy, filters.sortDirection || "asc");
    }
    if (filters.limit) {
        query = query.limit(filters.limit);
    }
    if (filters.offset) {
        query = query.offset(filters.offset);
    }
    return query.execute();
}

export async function hasAccess(db: Kysely<DB>, userId: string, objectiveId: string) {
    const access = await db
        .selectFrom("objectives")
        .leftJoin("user_objective_shares", "user_objective_shares.objectiveId", "objectives.id")
        .select(["objectives.creatorId", "user_objective_shares.userId"])
        .where("objectives.id", "=", objectiveId)
        .where((eb) => eb.or([eb("objectives.creatorId", "=", userId), eb("user_objective_shares.userId", "=", userId)]))
        .executeTakeFirst();
    return !!access;
}

export async function grantAccess(db: Kysely<DB>, data: InsertableObjectiveShare) {
    return await db.insertInto("user_objective_shares").values(data).returningAll().executeTakeFirst();
}

export async function revokeAccess(db: Kysely<DB>, objectiveId: string, userId: string) {
    await db.deleteFrom("user_objective_shares").where("objectiveId", "=", objectiveId).where("userId", "=", userId).execute();
}

export async function listGrants(db: Kysely<DB>, objectiveId: string) {
    return db
        .selectFrom("user_objective_shares")
        .innerJoin("users", "users.id", "user_objective_shares.userId")
        .select(["users.id", "users.login", "users.email", "users.name"])
        .where("user_objective_shares.objectiveId", "=", objectiveId)
        .execute();
}
