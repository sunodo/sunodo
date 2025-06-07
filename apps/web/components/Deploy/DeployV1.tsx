import { Card, Group, List, Stack, Text, Title } from "@mantine/core";
import type { FC } from "react";

import { IconServer } from "@tabler/icons-react";
import DeploySelfHosted from "./SelfHosted/DeploySelfHosted";

type DeployV1Props = {
    cid?: string;
    provider?: string;
    templateHash?: string;
};

const DeployV1: FC<DeployV1Props> = (props) => {
    return (
        <Stack>
            <Card shadow="lg" radius="lg">
                <Stack>
                    <Group>
                        <IconServer />
                        <Title order={4}>Self-hosted</Title>
                    </Group>
                    <Text>
                        Cartesi Rollups V1 only supports self-hosted nodes,
                        where the node runner is also the Authority validator of
                        the application. You will need the following
                        infrastructure to run an application node:
                    </Text>
                    <List>
                        <List.Item>
                            a cloud server for the node software
                        </List.Item>
                        <List.Item>a postgres database</List.Item>
                        <List.Item>a web3 node provider</List.Item>
                        <List.Item>a funded wallet</List.Item>
                    </List>
                </Stack>
            </Card>
            <DeploySelfHosted templateHash={props.templateHash} />
        </Stack>
    );
};

export default DeployV1;
