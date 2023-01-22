import { handlerPath } from "@libs/handler-resolver";
import schema from "./schema";

const config = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "post",
                path: "auth/login",
                request: {
                    schemas: {
                        "application/json": schema,
                    },
                },
                documentation: {
                    summary: "Login or signup to sunodo",
                    description:
                        "Login or signup to sunodo through email or oauth authentication",
                    methodResponses: [
                        {
                            statusCode: 200,
                            responseBody: {
                                description: "Session",
                            },
                        },
                    ],
                },
            },
        },
    ],
};

export default config;
