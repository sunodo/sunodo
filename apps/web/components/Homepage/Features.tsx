import {
    Container,
    Title,
    Text,
    Grid,
    GridCol,
    Box,
    Stack,
    Group,
    Space,
} from "@mantine/core";

import { IconSquareRoundedX } from "@tabler/icons-react";
import { Section } from "@/components/Section/Section";
import { Card } from "../Card/Card";

export function Features() {
    return (
        <Section>
            <Container>
                <Card bg="primary.0">
                    <Stack gap="lg">
                        <Title order={2} fz="h3" ta="center">
                            Today, traditional developers need to make a huge
                            leap to enter web3 and are limited in what they can
                            build.
                        </Title>
                        <Space
                            h={{
                                base: "lg",
                                lg: "xl",
                            }}
                        />
                        <Grid
                            gutter={{
                                base: "lg",
                                sm: "128",
                            }}
                        >
                            <GridCol span={{ base: 12, sm: 6 }}>
                                <Title order={3} fw="normal">
                                    Limited design space
                                </Title>
                            </GridCol>
                            <GridCol span={{ base: 12, sm: 6 }}>
                                <Stack gap="xs">
                                    <Group
                                        align="flex-start"
                                        gap="sm"
                                        wrap="nowrap"
                                    >
                                        <Box c="#008DA5">
                                            <IconSquareRoundedX
                                                size="24"
                                                strokeWidth={1.5}
                                            />
                                        </Box>
                                        <Text>
                                            Limited expression using Solidity.
                                        </Text>
                                    </Group>
                                    <Group
                                        align="flex-start"
                                        gap="sm"
                                        wrap="nowrap"
                                    >
                                        <Box c="#008DA5">
                                            <IconSquareRoundedX
                                                size="24"
                                                strokeWidth={1.5}
                                            />
                                        </Box>
                                        <Text>
                                            No existing tooling and libraries.
                                        </Text>
                                    </Group>
                                    <Group
                                        align="flex-start"
                                        gap="sm"
                                        wrap="nowrap"
                                    >
                                        <Box c="#008DA5">
                                            <IconSquareRoundedX
                                                size="24"
                                                strokeWidth={1.5}
                                            />
                                        </Box>
                                        <Text>
                                            Can’t run traditional apps in a
                                            verifiable way.
                                        </Text>
                                    </Group>
                                </Stack>
                            </GridCol>
                        </Grid>
                        <Space h={{ base: "md", lg: "xl" }} />
                        <Grid
                            gutter={{
                                base: "lg",
                                sm: "128",
                            }}
                        >
                            <GridCol span={{ base: 12, sm: 6 }}>
                                <Title order={3} fw="normal">
                                    DevOps is challenging
                                </Title>
                            </GridCol>
                            <GridCol span={{ base: 12, sm: 6 }}>
                                <Stack gap="xs">
                                    <Group
                                        align="flex-start"
                                        gap="sm"
                                        wrap="nowrap"
                                    >
                                        <Box c="#008DA5">
                                            <IconSquareRoundedX
                                                size="24"
                                                strokeWidth={1.5}
                                            />
                                        </Box>
                                        <Text>
                                            Setting up and deploying nodes is
                                            hard.
                                        </Text>
                                    </Group>
                                    <Group
                                        align="flex-start"
                                        gap="sm"
                                        wrap="nowrap"
                                    >
                                        <Box c="#008DA5">
                                            <IconSquareRoundedX
                                                size="24"
                                                strokeWidth={1.5}
                                            />
                                        </Box>
                                        <Text>
                                            Running and maintaining nodes is
                                            cumbersome.
                                        </Text>
                                    </Group>
                                    <Group
                                        align="flex-start"
                                        gap="sm"
                                        wrap="nowrap"
                                    >
                                        <Box c="#008DA5">
                                            <IconSquareRoundedX
                                                size="24"
                                                strokeWidth={1.5}
                                            />
                                        </Box>
                                        <Text>
                                            Finding the right protocol stack for
                                            every use case is difficult and a
                                            challenge to implement.
                                        </Text>
                                    </Group>
                                </Stack>
                            </GridCol>
                        </Grid>
                    </Stack>
                </Card>
            </Container>
        </Section>
    );
}
