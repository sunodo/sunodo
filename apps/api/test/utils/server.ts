import { PrismaClient } from "@prisma/client";
import { File, Suite, beforeEach } from "vitest";
import { Stripe } from "stripe";
import buildServer from "../../src/server";
import { createDatabase } from "./database";
import { FastifyContext } from "../types";
import { TestStripeBillingManager } from "../billing";

const buildServerHook = async (ctx: Suite | File) => {
    // create database for test
    const connectionString = await createDatabase(ctx);

    // instantiate prisma connecting to that database
    const prisma = new PrismaClient({
        datasources: { db: { url: connectionString } },
    });
    await prisma.$connect();

    // build an additional stripe client (server will create its own)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2022-11-15",
    });

    // instantiate a test billing manager
    const billing = new TestStripeBillingManager(stripe);

    // build the server
    const server = buildServer({
        prisma,
        billing,
        logger: false,
    });

    // store in suite meta
    ctx.meta = {
        prisma,
        server,
        stripe,
        billing,
    };

    beforeEach<FastifyContext>(async (ctx) => {
        // copy suite context to test context
        ctx.prisma = prisma;
        ctx.server = server;
        ctx.stripe = stripe;
        ctx.billing = billing;
    });

    // return clean up function, to disconnect from database
    return async () => {
        // delete all billing data created for this suite
        await billing.teardown();

        // disconnect from database
        await prisma.$disconnect();
    };
};

export default buildServerHook;
