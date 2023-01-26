import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import {
    HttpApi,
    HttpMethod,
    HttpNoneAuthorizer,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import { Construct } from "constructs";

import {
    NodejsFunction,
    NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";

// we need to say arm64 for local testing in Apple Silicon
const architecture = Architecture.ARM_64;
const runtime = Runtime.NODEJS_18_X;

export interface DatabaseConnectionProps {
    host: string;
    port: string;
    engine: string;
    username: string;
    password: string;
}

interface Props {
    jwtIssuer: string;
    database: DatabaseConnectionProps;
}

export class Api extends Construct {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);
        const { database, jwtIssuer } = props;

        const authorizer = new HttpJwtAuthorizer("authorizer", jwtIssuer, {
            jwtAudience: ["https://api.sunodo.io", `${jwtIssuer}/userinfo`],
        });

        const httpApi = new HttpApi(this, "HttpApi", {
            defaultAuthorizer: authorizer,
            defaultAuthorizationScopes: ["openid profile email offline_access"],
        });

        // default configuration for functions
        const defaults: NodejsFunctionProps = {
            architecture,
            runtime,
        };

        const prismaProps: NodejsFunctionProps = {
            environment: {
                DATABASE_HOST: database.host,
                DATABASE_PORT: database.port,
                DATABASE_ENGINE: database.engine,
                DATABASE_USER: database.username,
                DATABASE_PASSWORD: database.password,
            },
            bundling: {
                nodeModules: ["@prisma/client", "prisma"],
                commandHooks: {
                    beforeInstall: (i, o) => [
                        // Copy prisma directory to Lambda code asset
                        // the directory must be located at the same directory as your Lambda code
                        `cp -R ${i}/apps/api/prisma ${o}/`,
                    ],
                    beforeBundling: (i, o) => [],
                    afterBundling: (i, o) => [
                        // `cd ${outputDir}`,
                        // `yarn prisma generate`,
                        // `rm -rf node_modules/@prisma/engines`,
                        // `rm -rf node_modules/@prisma/client/node_modules node_modules/.bin node_modules/prisma`,
                    ],
                },
            },
        };

        const me = new NodejsFunction(this, "me", {
            ...defaults,
            ...prismaProps,
        });
        const login = new NodejsFunction(this, "auth.login", {
            ...defaults,
            ...prismaProps,
        });

        httpApi.addRoutes({
            path: "/me",
            methods: [HttpMethod.GET],
            integration: new HttpLambdaIntegration("me", me),
        });

        httpApi.addRoutes({
            path: "/auth/login",
            methods: [HttpMethod.POST],
            integration: new HttpLambdaIntegration("login", login),
            authorizer: new HttpNoneAuthorizer(),
        });
    }
}
