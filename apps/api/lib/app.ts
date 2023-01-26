import { Construct } from "constructs";
import { Stack, StackProps, Token } from "aws-cdk-lib";
import { BastionHostLinux, Port, Vpc } from "aws-cdk-lib/aws-ec2";
import {
    AuroraPostgresEngineVersion,
    DatabaseClusterEngine,
    ServerlessCluster,
} from "aws-cdk-lib/aws-rds";
import { Api } from "./api";

interface Props extends StackProps {
    jwtIssuer: string;
}

export class App extends Stack {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);
        const { jwtIssuer } = props;

        const vpc = new Vpc(this, "vpc", {
            natGateways: 1,
        });

        // bastion host
        const bastionHost = new BastionHostLinux(this, "bastionHost", {
            vpc,
        });

        // serverless postgres database
        const database = new ServerlessCluster(this, "databaseCluster", {
            engine: DatabaseClusterEngine.auroraPostgres({
                version: AuroraPostgresEngineVersion.VER_14_5,
            }),
            vpc,
        });

        // allow connection to database from bastion host
        database.connections.allowFrom(
            bastionHost.connections,
            Port.tcp(database.clusterEndpoint.port)
        );

        // REST API
        new Api(this, "api", {
            jwtIssuer,
            database: {
                host: database.clusterEndpoint.hostname,
                port: Token.asString(database.clusterEndpoint.port),
                engine: database.secret
                    ?.secretValueFromJson("engine")
                    .unsafeUnwrap()!,
                username: database.secret
                    ?.secretValueFromJson("username")
                    .unsafeUnwrap()!,
                password: database.secret
                    ?.secretValueFromJson("password")
                    .unsafeUnwrap()!,
            },
        });
    }
}
