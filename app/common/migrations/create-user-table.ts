import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("users")
        .ifNotExists()
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("login", "varchar(127)", (col) => col.notNull())
        .addColumn("name", "varchar(127)")
        .addColumn("email", "varchar(127)", (col) => col.unique().notNull())
        .addColumn("password", "text")
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("users").execute();
}
