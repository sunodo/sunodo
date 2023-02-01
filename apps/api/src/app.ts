import * as dotenv from "dotenv";
dotenv.config();
import buildServer from "./server";

const server = buildServer();

const main = async () => {
    try {
        const path = await server.listen({
            host: "0.0.0.0",
            port: 3000,
        });
        console.log(`Server ready at ${path}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

main();
