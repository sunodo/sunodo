import {
    Button,
    Center,
    Container,
    Grid,
    GridCol,
    Group,
    Image,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import NextImage from "next/image";
import Link from "next/link";

import { Card } from "../Card/Card";
import { Section } from "../Section/Section";

export function Welcome() {
    return (
        <Section id="meet-sunodo">
            <Container>
                <Stack
                    gap="lg"
                    mb={{
                        base: "xl",
                        lg: "3xl",
                    }}
                >
                    <Title order={2} ta="center">
                        Meet Sunodo!
                    </Title>
                    <Text
                        ta="center"
                        fz={{
                            base: "md",
                            lg: "xl",
                        }}
                    >
                        Abstracting away complexities for developers.
                        <br />
                        Deploy fully managed verifiable servers as effortlessly
                        as Docker containers.
                    </Text>
                </Stack>

                <Grid
                    gutter={{
                        base: "sm",
                        sm: "48",
                    }}
                    mb="3xl"
                >
                    <GridCol span={{ base: 12, sm: 4 }}>
                        <Stack align="center" justify="center">
                            <Image
                                component={NextImage}
                                src="/risc-v-linux.svg"
                                alt=""
                                width="258"
                                height="258"
                                maw={"258px"}
                            />
                            <Title order={5} fz="h5" ta="center" fw="normal">
                                Powered by a RISC-V Cartesi VM capable of
                                booting Linux
                            </Title>
                        </Stack>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 4 }}>
                        <Stack align="center" justify="center">
                            <Image
                                component={NextImage}
                                src="/click.svg"
                                alt=""
                                width="258"
                                height="258"
                                maw={"258px"}
                            />
                            <Title order={5} fz="h5" ta="center" fw="normal">
                                3-click deployment and node hiring
                            </Title>
                        </Stack>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 4 }}>
                        <Stack align="center" justify="center">
                            <Image
                                component={NextImage}
                                src="/templates.svg"
                                alt=""
                                width="258"
                                height="258"
                                maw={"258px"}
                            />
                            <Title order={5} fz="h5" ta="center" fw="normal">
                                Templates and pre-sets for optimal configuration
                            </Title>
                        </Stack>
                    </GridCol>
                </Grid>

                <Grid
                    gutter={{
                        base: "md",
                        sm: "48",
                    }}
                >
                    <GridCol span={{ base: 12, sm: 6, md: 4 }}>
                        <Group wrap="nowrap" align="flex-start" gap="lg">
                            <Card
                                filled
                                p="md"
                                radius="lg"
                                style={{
                                    flexShrink: 0,
                                }}
                            >
                                <Image
                                    component={NextImage}
                                    src="/puzzle.svg"
                                    alt=""
                                    width="32"
                                    height="32"
                                />
                            </Card>
                            <Stack gap={"xs"}>
                                <Title order={4} fz="h5">
                                    1. Choose preferred template
                                </Title>
                                <Text>
                                    Use any language, libraries and tooling
                                    compatible with Linux. Select amongst the
                                    many templates developed (C++, Rust, Python,
                                    Go etc).
                                </Text>
                            </Stack>
                        </Group>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 4 }}>
                        <Group wrap="nowrap" align="flex-start" gap="lg">
                            <Card
                                filled
                                p="md"
                                radius="lg"
                                style={{
                                    flexShrink: 0,
                                }}
                            >
                                <Image
                                    component={NextImage}
                                    src="/code.svg"
                                    alt=""
                                    width="32"
                                    height="32"
                                />
                            </Card>
                            <Stack gap={"xs"}>
                                <Title order={4} fz="h5">
                                    2. Code your application
                                </Title>
                                <Text>
                                    Exercise your creativity while leveraging
                                    existing, battle-tested codebases, libraries
                                    and tools to develop your decentralized
                                    application.
                                </Text>
                            </Stack>
                        </Group>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 4 }}>
                        <Group wrap="nowrap" align="flex-start" gap="lg">
                            <Card
                                filled
                                p="md"
                                radius="lg"
                                style={{
                                    flexShrink: 0,
                                }}
                            >
                                <Image
                                    component={NextImage}
                                    src="/run-test.svg"
                                    alt=""
                                    width="32"
                                    height="32"
                                />
                            </Card>
                            <Stack gap={"xs"}>
                                <Title order={4} fz="h5">
                                    3. Test your application
                                </Title>
                                <Text>
                                    Test, build and run your application locally
                                    before deployment. Run a node with the
                                    application deployed in a single command
                                    using Sunodo.
                                </Text>
                            </Stack>
                        </Group>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 4 }}>
                        <Group wrap="nowrap" align="flex-start" gap="lg">
                            <Card
                                filled
                                p="md"
                                radius="lg"
                                style={{
                                    flexShrink: 0,
                                }}
                            >
                                <Image
                                    component={NextImage}
                                    src="/upload.svg"
                                    alt=""
                                    width="32"
                                    height="32"
                                />
                            </Card>
                            <Stack gap={"xs"}>
                                <Title order={4} fz="h5">
                                    4. Make your application available for
                                    deployment
                                </Title>
                                <Text>
                                    Upload your Cartesi Virtual Machine to IPFS.
                                </Text>
                            </Stack>
                        </Group>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 4 }}>
                        <Group wrap="nowrap" align="flex-start" gap="lg">
                            <Card
                                filled
                                p="md"
                                radius="lg"
                                style={{
                                    flexShrink: 0,
                                }}
                            >
                                <Image
                                    component={NextImage}
                                    src="/blockchain.svg"
                                    alt=""
                                    width="32"
                                    height="32"
                                />
                            </Card>
                            <Stack gap={"xs"}>
                                <Title order={4} fz="h5">
                                    5. Select a network to deploy on
                                </Title>
                                <Text>
                                    For DApp deployment and validation, select a
                                    network from available options, including
                                    mainnet and testnet.
                                </Text>
                            </Stack>
                        </Group>
                    </GridCol>
                    <GridCol span={{ base: 12, sm: 6, md: 4 }}>
                        <Group wrap="nowrap" align="flex-start" gap="lg">
                            <Card
                                filled
                                p="md"
                                radius="lg"
                                style={{
                                    flexShrink: 0,
                                }}
                            >
                                <Image
                                    component={NextImage}
                                    src="/launch.svg"
                                    alt=""
                                    width="32"
                                    height="32"
                                />
                            </Card>
                            <Stack gap={"xs"}>
                                <Title order={4} fz="h5">
                                    6. Pay and launch your application
                                </Title>
                                <Text>
                                    Pay for deployment and pre-fund your
                                    application. Anyone can keep funding.
                                </Text>
                            </Stack>
                        </Group>
                    </GridCol>
                </Grid>
                <Center>
                    <Button
                        variant="filled"
                        color="gray"
                        size="lg"
                        mt="2xl"
                        mb="xl"
                        component={Link}
                        href="/deploy"
                    >
                        Get Started
                    </Button>
                </Center>
            </Container>
        </Section>
    );
}
