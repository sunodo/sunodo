import type { AWS } from "@serverless/typescript";

import me from "@functions/me";
import createApp from "@functions/apps/create";
import login from "@functions/auth/login";

const serverlessConfiguration: AWS = {
    service: "api",
    frameworkVersion: "3",
    plugins: [
        "serverless-esbuild",
        "serverless-offline",
        "serverless-openapi-documenter",
    ],
    useDotenv: true,
    provider: {
        name: "aws",
        runtime: "nodejs14.x",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
        },
    },
    // import the function via paths
    functions: { createApp, login, me },
    package: {
        individually: true,
        patterns: [
            ".env",
            "src/generated/client/schema.prisma",
            "!src/generated/client/libquery_engine-*",
            "src/generated/client/libquery_engine-rhel-*",
            "!node_modules/prisma/libquery_engine-*",
            "!node_modules/@prisma/engines/**",
        ],
    },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ["aws-sdk"],
            target: "node14",
            define: { "require.resolve": undefined },
            platform: "node",
            concurrency: 10,
        },
        documentation: {
            title: "Sunodo API",
            description: "Sunodo API for managing deployment of Cartesi DApps",
            version: "0.1.0",
            contact: {
                email: "admin@sunodo.io",
            },
            license: "MIT",
            models: [],
        },
    },
};

module.exports = serverlessConfiguration;
