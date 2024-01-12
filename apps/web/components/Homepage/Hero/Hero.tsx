"use client";

import {
    Button,
    Container,
    Group,
    Image,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { useMouse } from "@mantine/hooks";
import { IconChevronRight } from "@tabler/icons-react";
import NextImage from "next/image";
import Link from "next/link";

import { BelowHeaderWrapper } from "../../BelowHeaderWrapper/BelowHeaderWrapper";
import classes from "./Hero.module.css";

export function Hero() {
    const { ref, x, y } = useMouse();

    return (
        <BelowHeaderWrapper>
            <section className={classes.wrapper} ref={ref}>
                {/* TODO: make it better and in another component - the bg - image and cursor */}
                <Image
                    component={NextImage}
                    src="/homepage-hero-bg.png"
                    alt=""
                    width="1466"
                    height="754"
                    className={classes.bg}
                    priority
                />
                <div className={classes.cursor} style={{ left: x, top: y }} />
                <Container pos="relative">
                    <Stack gap="lg" align="center">
                        <Title order={1} ta="center" c="white">
                            Deploy{" "}
                            <Text span c="brand.6" fz="inherit" fw="inherit">
                                verifiable Linux VMs
                            </Text>{" "}
                            with a click of a button
                        </Title>
                        <Text
                            ta="center"
                            c="gray.1"
                            fz={{
                                base: "md",
                                lg: "xl",
                            }}
                        >
                            Build and test fully managed Cartesi Rollups on a
                            modular stack.
                        </Text>
                        <Group gap="sm" justify="center" mt="xl">
                            <Button
                                component={Link}
                                href="/deploy"
                                variant="secondary"
                                size="lg"
                            >
                                Get started
                            </Button>
                            <Button
                                component={Link}
                                href="https://docs.sunodo.io/"
                                target="_blank"
                                variant="subtle"
                                color="gray.0"
                                size="lg"
                                rightSection={<IconChevronRight size="18" />}
                            >
                                Explore the docs
                            </Button>
                        </Group>
                    </Stack>
                </Container>
            </section>
        </BelowHeaderWrapper>
    );
}
