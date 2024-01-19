import {
    Box,
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

import { Card } from "../Card/Card";
import { Section } from "../Section/Section";

export function Gaming() {
    return (
        <Section>
            <Container>
                <Stack
                    gap="lg"
                    mb={{
                        base: "xl",
                        lg: "3xl",
                    }}
                >
                    <Title order={2} ta="center" maw={"25ch"} mx={"auto"}>
                        Expand your design space across different verticals
                    </Title>
                </Stack>
                <Card withBorder>
                    <Box>
                        <Grid
                            gutter={{
                                base: "lg",
                                sm: "128",
                            }}
                        >
                            <GridCol span={{ base: 12, sm: 6 }}>
                                <Title order={3} mb="lg">
                                    Gaming
                                </Title>
                                <Text>
                                    Take advantage of mainstream libraries, like
                                    physics engines, and develop complex fully
                                    on-chain games. Re-use code for quicker and
                                    more secure deployments.
                                </Text>
                            </GridCol>
                            <GridCol span={{ base: 12, sm: 6 }}>
                                <Stack gap="xl">
                                    <Group
                                        align="flex-start"
                                        gap="lg"
                                        wrap="nowrap"
                                    >
                                        <Image
                                            component={NextImage}
                                            src="/world-arcade.png"
                                            alt=""
                                            width="96"
                                            height="96"
                                        />
                                        <Stack gap="xs">
                                            <Title order={4} fz="h5">
                                                World Arcade
                                            </Title>
                                            <Text>
                                                Decentralized multiplayer video
                                                game competition platform for
                                                fully verifiable on-chain games.
                                            </Text>
                                        </Stack>
                                    </Group>
                                    <Group
                                        align="flex-start"
                                        gap="lg"
                                        wrap="nowrap"
                                    >
                                        <Image
                                            component={NextImage}
                                            src="/dazzle.png"
                                            alt=""
                                            width="96"
                                            height="96"
                                        />
                                        <Stack gap="xs">
                                            <Title order={4} fz="h5">
                                                Dazzle
                                            </Title>
                                            <Text>
                                                Complex logic for the next
                                                generation of strategic games. A
                                                strategic, competitive online
                                                game that blends the aesthetics
                                                of puzzle games with RPG
                                                elements.
                                            </Text>
                                        </Stack>
                                    </Group>
                                    <Group
                                        align="flex-start"
                                        gap="lg"
                                        wrap="nowrap"
                                    >
                                        <Image
                                            component={NextImage}
                                            src="/ultrachess.png"
                                            alt=""
                                            width="96"
                                            height="96"
                                        />
                                        <Stack gap="xs">
                                            <Title order={4} fz="h5">
                                                UltraChess
                                            </Title>
                                            <Text>
                                                A mix of fully onchain AI +
                                                gameplay. A fully on-chain chess
                                                game which allows users to
                                                deploy their own chess bots to
                                                compete in AI chess battles.
                                            </Text>
                                        </Stack>
                                    </Group>
                                </Stack>
                            </GridCol>
                        </Grid>
                    </Box>
                    <Card.Separator />
                    <Box>
                        <Grid
                            gutter={{
                                base: "lg",
                                sm: "128",
                            }}
                        >
                            <GridCol span={{ base: 12, sm: 6 }}>
                                <Title order={3} mb="lg">
                                    IoT & Verifiable computation
                                </Title>
                                <Text>
                                    Sunodo offers a complete and verifiable
                                    computer over an ETH infrastructure, which
                                    greatly expands its applications to the IoT.
                                    The ability to verify calculations and data
                                    processing creates opportunities for more
                                    secure and transparent business models in
                                    various industries.
                                </Text>
                            </GridCol>
                            <GridCol span={{ base: 12, sm: 6 }}>
                                <Stack gap="xl">
                                    <Group
                                        align="flex-start"
                                        gap="lg"
                                        wrap="nowrap"
                                    >
                                        <Image
                                            component={NextImage}
                                            src="/lilium.png"
                                            alt=""
                                            width="96"
                                            height="96"
                                        />
                                        <Stack gap="xs">
                                            <Title order={4} fz="h5">
                                                Lilium
                                            </Title>
                                            <Text>
                                                Lilium DApp is a pioneering
                                                project dedicated to
                                                environmental conservation
                                                through the generation and
                                                trading of verified carbon
                                                credits.
                                            </Text>
                                        </Stack>
                                    </Group>
                                </Stack>
                            </GridCol>
                        </Grid>
                    </Box>
                </Card>
            </Container>
        </Section>
    );
}
