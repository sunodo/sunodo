import { handlerPath } from "@libs/handler-resolver";

const config = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "get",
                path: "me",
                documentation: {
                    summary: "Authenticated user",
                    description: "Returns the authenticated user information",
                    methodResponses: [
                        {
                            statusCode: 200,
                            responseBody: {
                                description: "Session",
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
