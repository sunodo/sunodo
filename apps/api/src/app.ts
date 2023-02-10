import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();
import buildServer from "./server";

// connect to process.env.DATABASE_URL by default
const prisma = new PrismaClient();

const server = buildServer({
    logger: true,
    prisma,
});

const main = async () => {
    try {
        const path = await server.listen({
            host: "0.0.0.0",
            port: 3001,
        });
        console.log(`Server ready at ${path}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

main();
