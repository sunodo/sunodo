import {
    Container,
    Title,
    Text,
    Paper,
    Box,
    Stack,
    Flex,
    Space,
    Group,
    Grid,
    GridCol,
} from "@mantine/core";
import { Section } from "@/components/Section/Section";
import { Card } from "../../Card/Card";
import classes from "./Discover.module.css";
import NextImage from "next/image";
import { Image } from "@mantine/core";
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
                    <Title order={2} ta="center">
                        Go beyond simple smart contracts and build complex
                        systems
                    </Title>
                </Stack>
                <Card isDark>
                    <Box>
                        <Title order={3} mb="lg" c="white" ta="center">
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
                            <Title order={4} c="primary">
                                1000x more computation
                            </Title>
                            <Text>
                                Build more complex DApps using app-specific
                                rollups without facing block space constraints.
                            </Text>
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
                                <Box>
                                    <Title order={4} c="primary">
                                        Develop with the tools that you love
                                    </Title>
                                    <Text>
                                        Expand your design space by leveraging
                                        all the tools, libraries, and
                                        programming languages compatible with
                                        Linux out of the box.
                                    </Text>
                                </Box>
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
                                    <Box
                                        className={classes.withBorderInCard}
                                        pr={{
                                            base: "lg",
                                            lg: "xl",
                                        }}
                                    >
                                        <Title order={4} c="primary">
                                            Flexible deployment
                                        </Title>
                                        <Text>
                                            Deploy on the best stack that fits
                                            your use-case requirements,
                                            abstracting away complexities from
                                            developers.
                                        </Text>
                                    </Box>
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
                                            src={`/layers.svg`}
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
