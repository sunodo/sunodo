import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import {
    HttpApi,
    HttpMethod,
    HttpNoneAuthorizer,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import {
    NodejsFunction,
    NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

import { AuthProps } from "./auth";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

// we need to say arm64 for local testing in Apple Silicon
const architecture = Architecture.ARM_64;
const runtime = Runtime.NODEJS_18_X;

export interface DatabaseConnectionProps {
    host: string;
    port: string;
    credentials: ISecret;
}

interface Props {
    auth: AuthProps;
    database: DatabaseConnectionProps;
}

export class Api extends Construct {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);
        const { auth, database } = props;

        const authorizer = new HttpJwtAuthorizer("authorizer", auth.issuer, {
            jwtAudience: ["https://api.sunodo.io", `${auth.issuer}/userinfo`],
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
                DATABASE_CREDENTIALS_ARN: database.credentials.secretArn,
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

        const login = new NodejsFunction(this, "auth.login", {
            ...defaults,
            ...prismaProps,
            environment: {
                AUTH_ISSUER: auth.issuer,
                AUTH_CLIENT_ID: auth.clientId,
                AUTH_CLIENT_SECRET: auth.clientSecret,
            },
        });
        const me = new NodejsFunction(this, "me", {
            ...defaults,
            ...prismaProps,
        });
        const createApp = new NodejsFunction(this, "apps.create", {
            ...defaults,
            ...prismaProps,
        });

        httpApi.addRoutes({
            path: "/auth/login",
            methods: [HttpMethod.POST],
            integration: new HttpLambdaIntegration("login", login),
            authorizer: new HttpNoneAuthorizer(),
        });

        httpApi.addRoutes({
            path: "/me",
            methods: [HttpMethod.GET],
            integration: new HttpLambdaIntegration("me", me),
        });

        httpApi.addRoutes({
            path: "/apps",
            methods: [HttpMethod.POST],
            integration: new HttpLambdaIntegration("createApp", createApp),
        });

        // allow lambdas to read database credentials
        database.credentials.grantRead(login);
        database.credentials.grantRead(me);
        database.credentials.grantRead(createApp);
    }
}
