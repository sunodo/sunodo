import * as cdk from "aws-cdk-lib";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import {
    NodejsFunction,
    NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { HttpApi, HttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

import { Construct } from "constructs";

// we need to say arm64 for local testing in Apple Silicon
const architecture = Architecture.ARM_64;
const runtime = Runtime.NODEJS_18_X;

export class Api extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const httpApi = new HttpApi(this, "HttpApi");

        // default configuration for functions
        const defaults: NodejsFunctionProps = {
            architecture,
            runtime,
        };

        const me = new NodejsFunction(this, "me", defaults);

        httpApi.addRoutes({
            path: "/me",
            methods: [HttpMethod.GET],
            integration: new HttpLambdaIntegration("me", me),
        });
    }
}
