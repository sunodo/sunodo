import { handlerPath } from "@libs/handler-resolver";
import schema from "./schema";

const config = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "post",
                path: "apps",
                request: {
                    schemas: {
                        "application/json": schema,
                    },
                },
                documentation: {
                    summary: "Create application",
                    description: "Creates a new Cartesi application",
                    methodResponses: [
                        {
                            statusCode: 201,
                            responseBody: {
                                description: "Application",
                            },
                        },
                        {
                            statusCode: 401,
                            responseBody: {
                                description: "Unauthorized",
                            },
                        },
                    ],
                },
            },
        },
    ],
};

export default config;
