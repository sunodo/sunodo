"use client";

import {
    ActionIcon,
    Badge,
    Collapse,
    CopyButton,
    Grid,
    Group,
    Stack,
    Text,
    rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FC } from "react";
import { formatUnits } from "viem";

import { Tooltip } from "@mantine/core";
import { IconCheck, IconChevronDown, IconCopy } from "@tabler/icons-react";
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
        <Stack gap="lg">
            <Grid>
                <Grid.Col span={{ base: 10, sm: 9 }}>
                    <Stack gap={0}>
                        <Text size="xs">Consensus</Text>
                        <Group gap="xs">
                            {provider?.consensus?.address ? (
                                <AddressText
                                    shorten
                                    icon
                                    fw={600}
                                    value={provider.consensus.address}
                                />
                            ) : (
                                <Text size="lg" fw={600}>
                                    {undefinedLabel}
                                </Text>
                            )}
                            {provider?.consensus && (
                                <Badge color="gray" size="sm">
                                    {provider?.consensus.type}
                                </Badge>
                            )}
                        </Group>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 2 }} order={{ base: 3, sm: 2 }}>
                    <Stack gap={0}>
                        <Text size="xs">Price</Text>
                        {provider?.price != undefined && token ? (
                            provider.price > 0n ? (
                                <Group gap={5} wrap="nowrap" align="baseline">
                                    <Text fw={600}>
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
                                <Text fw={600}>Free</Text>
                            )
                        ) : (
                            <Text fw={600}>{undefinedLabel}</Text>
                        )}
                    </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 2, sm: 1 }} order={{ base: 2, sm: 3 }}>
                    <Stack gap={0} align="flex-end">
                        <ActionIcon variant="transparent" onClick={toggle}>
                            <IconChevronDown
                                style={{
                                    rotate: details ? "180deg" : "0deg",
                                }}
                            />
                        </ActionIcon>
                    </Stack>
                </Grid.Col>
            </Grid>
            <Collapse in={details}>
                <Grid>
                    <Grid.Col span={{ base: 12, sm: 9 }}>
                        <Stack gap={0}>
                            <Text size="xs">Payee</Text>
                            {provider?.payee ? (
                                <AddressText
                                    shorten
                                    icon
                                    fw={600}
                                    value={provider?.payee}
                                />
                            ) : (
                                <Text fw={600}>{undefinedLabel}</Text>
                            )}
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 3 }}>
                        <Stack gap={0}>
                            <Text size="xs">Payment Token</Text>
                            {token ? (
                                <Group gap={"xs"} align="end" wrap="nowrap">
                                    <Group
                                        gap={"xs"}
                                        wrap="nowrap"
                                        align="baseline"
                                    >
                                        <Text fw={600}>{token.name}</Text>
                                        <Text fw={600} c="dimmed">
                                            {token.symbol}
                                        </Text>
                                    </Group>
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
                                                    color={
                                                        copied ? "teal" : "gray"
                                                    }
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
                                <Text fw={600}>{undefinedLabel}</Text>
                            )}
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Collapse>
        </Stack>
    );
};

export default ProviderCard;
