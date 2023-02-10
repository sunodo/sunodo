import { PrismaClient } from "@prisma/client";
import { File, Suite } from "vitest";
import buildServer from "../../src/server";
import { createDatabase } from "./database";

const buildServerHook = async (ctx: Suite | File) => {
    // create database for test
    const connectionString = await createDatabase(ctx);

    // instantiate prisma connecting to that database
    const prisma = new PrismaClient({
        datasources: { db: { url: connectionString } },
    });
    await prisma.$connect();

    // build the server
    const server = buildServer({
        prisma,
        logger: false,
    });

    // store in suite meta
    ctx.meta = {
        prisma,
        server,
    };

    // return clean up function, to disconnect from database
    return async () => await prisma.$disconnect();
};

export default buildServerHook;
