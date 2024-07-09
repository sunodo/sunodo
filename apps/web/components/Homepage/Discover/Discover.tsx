import {
    Box,
    Container,
    Flex,
    Grid,
    GridCol,
    Image,
    Paper,
    Space,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import NextImage from "next/image";

import { Card } from "../../Card/Card";
import { Section } from "../../Section/Section";
import classes from "./Discover.module.css";

export function Discover() {
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
                        Go beyond simple smart contracts and build complex
                        systems
                    </Title>
                </Stack>
                <Card isDark filled>
                    <Box>
                        <Title order={3} mb="lg" ta="center" c="white">
                            Powered by Linux, and the entire Ethereum ecosystem
                        </Title>
                        <Text ta="center">
                            Sunodo, equipped with the Cartesi VM offers a
                            convenient way for developers to unlock new use
                            cases and go beyond the simple financial layer on
                            blockchain
                        </Text>
                    </Box>
                    <Space h="2xl" />
                    <Stack gap="xl">
                        <Paper
                            className={classes.card}
                            p={{
                                base: "lg",
                                lg: "xl",
                            }}
                            radius="lg"
                        >
                            <Stack gap="xs">
                                <Title order={4} c="brand.6">
                                    1000x more computation
                                </Title>
                                <Text>
                                    Build more complex DApps using app-specific
                                    rollups without facing block space
                                    constraints.
                                </Text>
                            </Stack>
                        </Paper>
                        <Paper
                            className={classes.card}
                            p={{
                                base: "lg",
                                lg: "xl",
                            }}
                            radius="lg"
                        >
                            <Flex
                                direction={{
                                    base: "column",
                                    lg: "row",
                                }}
                                gap={"xl"}
                                align={"center"}
                            >
                                <Stack gap="xs">
                                    <Title order={4} c="brand.6">
                                        Develop with the tools that you love
                                    </Title>
                                    <Text>
                                        Expand your design space by leveraging
                                        all the tools, libraries, and
                                        programming languages compatible with
                                        Linux out of the box.
                                    </Text>
                                </Stack>
                                <Grid>
                                    {[
                                        "cpp",
                                        "python",
                                        "lua",
                                        "nodejs",
                                        "ts",
                                        "go",
                                    ].map((item) => (
                                        <GridCol
                                            span={{
                                                base: 4,
                                                sm: 2,
                                                lg: 4,
                                            }}
                                            key={item}
                                        >
                                            <Image
                                                component={NextImage}
                                                src={`/${item}.svg`}
                                                alt=""
                                                width="48"
                                                height="48"
                                                fit="contain"
                                            />
                                        </GridCol>
                                    ))}
                                </Grid>
                            </Flex>
                        </Paper>
                        <Paper
                            className={classes.card}
                            p={{
                                base: "lg",
                                lg: "xl",
                            }}
                            radius="lg"
                        >
                            <Grid gutter={"xl"}>
                                <GridCol
                                    span={{
                                        base: 12,
                                        sm: 6,
                                    }}
                                >
                                    <Stack
                                        gap="xs"
                                        className={classes.withBorderInCard}
                                        pr={{
                                            base: "lg",
                                            lg: "xl",
                                        }}
                                    >
                                        <Title order={4} c="brand.6">
                                            Flexible deployment
                                        </Title>
                                        <Text>
                                            Deploy on the best stack that fits
                                            your use-case requirements,
                                            abstracting away complexities from
                                            developers.
                                        </Text>
                                    </Stack>
                                </GridCol>
                                <GridCol
                                    span={{
                                        base: 12,
                                        sm: 6,
                                    }}
                                >
                                    <div>
                                        <Image
                                            component={NextImage}
                                            src="/layers.svg"
                                            alt=""
                                            width="411"
                                            height="435"
                                            fit="contain"
                                            h={"auto"}
                                        />
                                    </div>
                                </GridCol>
                            </Grid>
                        </Paper>
                    </Stack>
                </Card>
            </Container>
        </Section>
    );
}
