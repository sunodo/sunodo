import { HttpMethod } from "aws-cdk-lib/aws-lambda";
import {
    APIGatewayProxyEventV2WithJWTAuthorizer,
    ClientContext,
    CognitoIdentity,
    Context,
} from "aws-lambda";

export type MockedEvent = {
    sub: string;
    method: HttpMethod;
    path: string;
    body: string;
};

export const createEvent = (
    e: MockedEvent
): APIGatewayProxyEventV2WithJWTAuthorizer => {
    return {
        headers: {},
        isBase64Encoded: true,
        rawPath: e.path,
        rawQueryString: "",
        requestContext: {
            accountId: "123456789012",
            apiId: "sunodo",
            authorizer: {
                integrationLatency: 60,
                jwt: {
                    claims: { sub: e.sub },
                    scopes: ["openid profile email offline_access"],
                },
                principalId: "",
            },
            domainName: "api.sunodo.io",
            domainPrefix: "api",
            http: {
                method: e.method,
                path: e.path,
                protocol: "HTTP/1.1",
                sourceIp: "205.255.255.176",
                userAgent: "",
            },
            requestId: "",
            routeKey: `${e.method} ${e.path}`,
            stage: "default",
            time: "01/Jan/2023:05:16:23 +0000",
            timeEpoch: 1583817383220,
        },
        routeKey: `${e.method} ${e.path}`,
        version: "2.0",
        body: e.body,
    };
};

class MockContext implements Context {
    callbackWaitsForEmptyEventLoop: boolean;
    functionName: string;
    functionVersion: string;
    invokedFunctionArn: string;
    memoryLimitInMB: string;
    awsRequestId: string;
    logGroupName: string;
    logStreamName: string;
    identity?: CognitoIdentity | undefined;
    clientContext?: ClientContext | undefined;

    constructor(functionName: string) {
        this.callbackWaitsForEmptyEventLoop = false;
        this.functionName = functionName;
        this.functionVersion = "1";
        this.invokedFunctionArn = "";
        this.memoryLimitInMB = "";
        this.awsRequestId = "";
        this.logGroupName = "";
        this.logStreamName = "";
    }

    getRemainingTimeInMillis(): number {
        throw new Error("Method not implemented: mocked");
    }

    done(error?: Error | undefined, result?: any): void {
        throw new Error("Method not implemented: mocked");
    }

    fail(error: string | Error): void {
        throw new Error("Method not implemented: mocked");
    }

    succeed(messageOrObject: any): void;
    succeed(message: string, object: any): void;
    succeed(message: unknown, object?: unknown): void {
        throw new Error("Method not implemented: mocked");
    }
}

export const createContext = (functionName: string): Context => {
    return new MockContext(functionName);
};
