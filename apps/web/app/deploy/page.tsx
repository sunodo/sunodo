import { Box, Button, Container, Stack, Text, Title } from "@mantine/core";
import { Metadata } from "next";
import Link from "next/link";

import { Card } from "../../components/Card/Card";
import { Section } from "../../components/Section/Section";
import classes from "./page.module.css";

export const metadata: Metadata = {
    title: "Sunodo - Deploy",
    description:
        "Build and test fully managed Cartesi Rollups on a modular stack.",
};

export default function LaunchpadPage() {
    return (
        <Section>
            <Container>
                <Stack align="center">
                    <Title order={1} fz="h2" ta="center" mb={"xl"}>
                        Deploy
                    </Title>
                    <Card bg="brand.0">
                        <Stack align="center">
                            <Box>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="52"
                                    height="52"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="0.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="4 17 10 11 4 5"></polyline>
                                    <line
                                        x1="12"
                                        y1="19"
                                        x2="20"
                                        y2="19"
                                        className={classes.anim}
                                    ></line>
                                </svg>
                            </Box>
                            <Text fz="lg" ta="center" maw={"600"}>
                                If you are interested in trying Sunodo Deploy,
                                please send us an email and we will get back to
                                you asap.
                            </Text>
                            <Button
                                color="dark"
                                size="lg"
                                mt="lg"
                                component={Link}
                                href="mailto:contact@sunodo.io?subject=Sunodo demo"
                            >
                                Book a demo
                            </Button>
                        </Stack>
                    </Card>
                </Stack>
            </Container>
        </Section>
    );
}
