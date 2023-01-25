import * as cdk from "aws-cdk-lib";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import {
    BundlingOptions,
    NodejsFunction,
    NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import {
    HttpApi,
    HttpMethod,
    HttpNoneAuthorizer,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpJwtAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";

import { Construct } from "constructs";

// we need to say arm64 for local testing in Apple Silicon
const architecture = Architecture.ARM_64;
const runtime = Runtime.NODEJS_18_X;

const jwtIssuer = "https://dev-0y8qxgon5zsrd7s1.us.auth0.com";

export class Api extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const authorizer = new HttpJwtAuthorizer("authorizer", jwtIssuer, {
            jwtAudience: ["https://api.sunodo.io", `${jwtIssuer}/userinfo`],
        });

        const httpApi = new HttpApi(this, "HttpApi", {
            defaultAuthorizer: authorizer,
            defaultAuthorizationScopes: ["openid profile email offline_access"],
        });

        const prismaBundling: BundlingOptions = {
            nodeModules: ["@prisma/client", "prisma"],
            commandHooks: {
                beforeBundling(inputDir: string, outputDir: string): string[] {
                    return [];
                },
                beforeInstall(inputDir: string, outputDir: string) {
                    return [`cp -R ${inputDir}/apps/api/prisma ${outputDir}/`];
                },
                afterBundling(inputDir: string, outputDir: string): string[] {
                    return [
                        `cd ${outputDir}`,
                        `yarn prisma generate`,
                        `rm -rf node_modules/@prisma/engines`,
                        `rm -rf node_modules/@prisma/client/node_modules node_modules/.bin node_modules/prisma`,
                    ];
                },
            },
        };

        // default configuration for functions
        const defaults: NodejsFunctionProps = {
            architecture,
            runtime,
        };

        const me = new NodejsFunction(this, "me", {
            ...defaults,
            bundling: prismaBundling,
        });
        const login = new NodejsFunction(this, "auth.login");

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
