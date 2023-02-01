import { Construct } from "constructs";
import { Stack, StackProps, Token } from "aws-cdk-lib";
import { BastionHostLinux, Port, Vpc } from "aws-cdk-lib/aws-ec2";
import {
    AuroraPostgresEngineVersion,
    Credentials,
    DatabaseClusterEngine,
    ServerlessCluster,
} from "aws-cdk-lib/aws-rds";
import { Api } from "./api";
import { AuthProps } from "./auth";

interface Props extends StackProps {
    auth: AuthProps;
}

export class App extends Stack {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);
        const { auth } = props;

        const vpc = new Vpc(this, "vpc", {
            natGateways: 1,
        });

        // bastion host
        const bastionHost = new BastionHostLinux(this, "bastionHost", {
            vpc,
        });

        const databaseCredentials = Credentials.fromGeneratedSecret("admin");

        // serverless postgres database
        const database = new ServerlessCluster(this, "databaseCluster", {
            vpc,
            engine: DatabaseClusterEngine.auroraPostgres({
                version: AuroraPostgresEngineVersion.VER_14_5,
            }),
            credentials: databaseCredentials,
        });

        // allow connection to database from bastion host
        database.connections.allowFrom(
            bastionHost.connections,
            Port.tcp(database.clusterEndpoint.port)
        );

        // REST API
        new Api(this, "api", {
            auth,
            database: {
                host: database.clusterEndpoint.hostname,
                port: Token.asString(database.clusterEndpoint.port),
                credentials: databaseCredentials.secret!,
            },
        });
    }
}
