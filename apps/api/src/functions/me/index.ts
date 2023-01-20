import { handlerPath } from "@libs/handler-resolver";

const config = {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "get",
                path: "me",
            },
        },
    ],
};

export default config;
