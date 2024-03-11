"use client";

import {
    ActionIcon,
    Badge,
    Collapse,
    CopyButton,
    Grid,
    Group,
    Stack,
    Switch,
    Text,
    rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC } from "react";
import { formatUnits } from "viem";

import { Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { ValidatorNodeProvider } from "../../app/deploy/form";
import AddressText from "../AddressText";

export type ProviderCardProps = {
    provider?: ValidatorNodeProvider;
};

const ProviderCard: FC<ProviderCardProps> = ({ provider }) => {
    const token = provider?.token;

    // details toggle
    const [details, { toggle }] = useDisclosure(false);

    const undefinedLabel = "<undefined>";

    return (
        <>
            <Grid.Col span={9}>
                <Stack gap={0}>
                    <Text size="sm">Consensus</Text>
                    <Group>
                        {provider?.consensus?.address ? (
                            <AddressText
                                icon
                                size="lg"
                                fw={600}
                                value={provider.consensus.address}
                            />
                        ) : (
                            <Text size="lg" fw={600}>
                                {undefinedLabel}
                            </Text>
                        )}
                        {provider?.consensus && (
                            <Badge color="grey">
                                {provider?.consensus.type}
                            </Badge>
                        )}
                    </Group>
                </Stack>
            </Grid.Col>
            <Grid.Col span={2}>
                <Stack gap={0}>
                    <Text size="sm">Price</Text>
                    {provider?.price != undefined && token ? (
                        provider.price > 0n ? (
                            <Group gap={5} align="baseline">
                                <Text size="lg" fw={600}>
                                    {formatUnits(
                                        provider.price,
                                        token.decimals,
                                    )}
                                </Text>
                                <Text size="md" c="dimmed" fw={600}>
                                    {token.symbol}
                                </Text>
                            </Group>
                        ) : (
                            <Text size="lg" fw={600}>
                                Free
                            </Text>
                        )
                    ) : (
                        <Text size="lg" fw={600}>
                            {undefinedLabel}
                        </Text>
                    )}
                </Stack>
            </Grid.Col>
            <Grid.Col span={1}>
                <Stack gap={6} justify="space-between">
                    <Text size="sm">Details</Text>
                    <Switch checked={details} onChange={toggle} />
                </Stack>
            </Grid.Col>
            <Grid.Col span={9}>
                <Collapse in={details}>
                    <Stack gap={0}>
                        <Text size="sm">Payee</Text>
                        {provider?.payee ? (
                            <AddressText
                                size="lg"
                                icon
                                fw={600}
                                value={provider?.payee}
                            />
                        ) : (
                            <Text size="lg" fw={600}>
                                {undefinedLabel}
                            </Text>
                        )}
                    </Stack>
                </Collapse>
            </Grid.Col>
            <Grid.Col span={3}>
                <Collapse in={details}>
                    <Stack gap={0}>
                        <Text size="sm">Payment Token</Text>
                        {token ? (
                            <Group align="end">
                                <Text size="lg" fw={600}>
                                    {token.name}
                                </Text>
                                <Text size="lg" fw={600} c="dimmed">
                                    {token.symbol}
                                </Text>
                                <CopyButton
                                    value={token.address}
                                    timeout={2000}
                                >
                                    {({ copied, copy }) => (
                                        <Tooltip
                                            label={
                                                copied
                                                    ? "Copied"
                                                    : token.address
                                            }
                                            withArrow
                                            position="right"
                                        >
                                            <ActionIcon
                                                color={copied ? "teal" : "gray"}
                                                variant="subtle"
                                                onClick={copy}
                                            >
                                                {copied ? (
                                                    <IconCheck
                                                        style={{
                                                            width: rem(16),
                                                        }}
                                                    />
                                                ) : (
                                                    <IconCopy
                                                        style={{
                                                            width: rem(16),
                                                        }}
                                                    />
                                                )}
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            </Group>
                        ) : (
                            <Text size="lg" fw={600}>
                                {undefinedLabel}
                            </Text>
                        )}
                    </Stack>
                </Collapse>
            </Grid.Col>
        </>
    );
};

export default ProviderCard;
