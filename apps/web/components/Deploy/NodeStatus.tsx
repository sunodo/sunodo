import { Group, Loader, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { FC } from "react";
import { Address } from "viem";

type NodeStatusProps = {
    application: Address;
    graphqlUrl: string;
    waiting: boolean;
    timeout: number; // point in time waiting will be considered failed
};

const NodeStatus: FC<NodeStatusProps> = (props) => {
    const { application, graphqlUrl, waiting, timeout } = props;
    return (
        <Stack gap={0}>
            <Title>Node status</Title>
            {waiting && (
                <Group gap={0}>
                    <Text>Waiting for node startup...</Text>
                    <Loader size="sm" />
                </Group>
            )}
            {waiting && <Text>{graphqlUrl}</Text>}
            {!waiting && (
                <Link href={graphqlUrl}>
                    <Text>{graphqlUrl}</Text>
                </Link>
            )}
        </Stack>
    );
};

export default NodeStatus;
