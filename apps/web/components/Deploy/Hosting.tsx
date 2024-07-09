import {
    Avatar,
    Badge,
    Card,
    Group,
    List,
    Radio,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { IconCloudComputing, IconServer } from "@tabler/icons-react";
import type { FC } from "react";

export type HostingMethod = "self-hosted" | "third-party";
type HostingProps = {
    method?: HostingMethod;
    onChange?: (method: HostingMethod) => void;
};

const Hosting: FC<HostingProps> = (props) => {
    return (
        <Radio.Group
            onChange={(value) => props.onChange?.(value as HostingMethod)}
            value={props.method}
        >
            <SimpleGrid cols={2}>
                <Card shadow="lg" radius="lg">
                    <Stack>
                        <Radio
                            label={
                                <Group>
                                    <IconServer />
                                    <Title order={4}>Self-hosted</Title>
                                </Group>
                            }
                            value="self-hosted"
                        />
                        <Text>
                            Select this option to run the node for your own
                            application. You will need the following
                            infrastructure:
                        </Text>
                        <List>
                            <List.Item>
                                a cloud server for the application node
                            </List.Item>
                            <List.Item>a postgres database</List.Item>
                            <List.Item>a web3 node provider</List.Item>
                            <List.Item>a funded wallet</List.Item>
                        </List>
                    </Stack>
                </Card>
                <Card shadow="lg" radius="lg">
                    <Stack>
                        <Radio
                            disabled
                            label={
                                <Group>
                                    <IconCloudComputing />
                                    <Title order={4}>
                                        Third-party provider
                                    </Title>
                                    <Badge>Coming Soon!</Badge>
                                </Group>
                            }
                            value="third-party"
                        />
                        <Text>
                            Select this option to use a third-party service
                            provider to run a node for your application. You
                            will need to:
                        </Text>
                        <Group justify="space-between">
                            <List icon={<Avatar src="ctsi.svg" size="md" />}>
                                <List.Item>
                                    use CTSI on deployment and recurringly to
                                    keep the application running
                                </List.Item>
                            </List>
                        </Group>
                    </Stack>
                </Card>
            </SimpleGrid>
        </Radio.Group>
    );
};

export default Hosting;
