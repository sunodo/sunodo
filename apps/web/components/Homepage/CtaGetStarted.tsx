import { Container, Title, Text, Button, Stack } from "@mantine/core";

import { Section } from "@/components/Section/Section";
import { Card } from "../Card/Card";
import Link from "next/link";

export function CtaGetStarted() {
    return (
        <Section>
            <Container>
                <Card bg="primary.0">
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
                            variant="filled"
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
