import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import Stripe from "stripe";
import { StripeBillingManager } from "./billing";
dotenv.config();
import buildServer from "./server";

// connect to process.env.DATABASE_URL by default
const prisma = new PrismaClient();

// use key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2022-11-15",
});
const billing = new StripeBillingManager(stripe);

const server = buildServer({
    logger: true,
    prisma,
    billing,
});

const main = async () => {
    try {
        const path = await server.listen({
            host: "0.0.0.0",
            port: parseInt(process.env.PORT ?? "3001"),
        });
        console.log(`Server ready at ${path}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

main();
