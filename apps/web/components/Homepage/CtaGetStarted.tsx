import { Button, Container, Stack, Title } from "@mantine/core";
import Link from "next/link";

import { Card } from "../Card/Card";
import { Section } from "../Section/Section";

export function CtaGetStarted() {
    return (
        <Section>
            <Container>
                <Card bg="brand.0">
                    <Stack
                        gap="xl"
                        align="center"
                        px={{
                            base: 0,
                            lg: "3xl",
                        }}
                    >
                        <Stack gap="sm" align="center">
                            <Title order={2} fz="h3" ta="center">
                                Use Sunodo and expand your design space.
                            </Title>
                        </Stack>
                        <Button
                            component={Link}
                            href="/deploy"
                            color="dark"
                            size="lg"
                        >
                            Get started
                        </Button>
                    </Stack>
                </Card>
            </Container>
        </Section>
    );
}
