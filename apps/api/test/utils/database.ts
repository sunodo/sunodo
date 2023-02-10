import { Client } from "pg";
import { File, Suite } from "vitest";

/**
 * Creates a database specific for a test suit
 * @param ctx Suite in context
 * @returns connectionString of the new database
 */
export const createDatabase = async (ctx: Suite | File): Promise<string> => {
    // connect to database, but using `postgres` as database
    // because we will create an additional datababase using `tests` as template
    // so we cannot connect with `tests`, otherwise we get an error
    const connectionString = process.env.DATABASE_URL!;
    const templateDatabase = "tests";
    const pg = new Client({
        connectionString: connectionString.replace(
            templateDatabase,
            "postgres"
        ),
    });
    try {
        await pg.connect();

        // database name is the suite name
        const databaseName = `suite_${ctx.name.replace(":", "_")}`;

        // create database only for this suite, use `tests` database as template
        await pg.query(`DROP DATABASE IF EXISTS ${databaseName};`);
        await pg.query(
            `CREATE DATABASE ${databaseName} WITH TEMPLATE ${templateDatabase};`
        );

        return connectionString.replace(templateDatabase, databaseName);
    } finally {
        await pg.end();
    }
};
