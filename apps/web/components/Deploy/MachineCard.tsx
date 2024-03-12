"use client";

import {
    ActionIcon,
    Alert,
    Box,
    Collapse,
    Grid,
    Group,
    LoadingOverlay,
    Stack,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
import bytes from "bytes";
import { FC } from "react";
import { CartesiMachineData } from "../../src/hooks/machine";
import MachineFiles from "./MachineFiles";

export type MachineCardProps = {
    machine: CartesiMachineData;
};

const MachineCard: FC<MachineCardProps> = ({ machine }) => {
    const { entries, error, hash, loading } = machine;

    // calculate total size from entries
    const size = entries.reduce((acc, entry) => acc + entry.size, 0n);

    // details toggle (entries table)
    const [details, { toggle }] = useDisclosure(false);

    return (
        <Stack gap={"lg"}>
            {error && (
                <Alert color="red" title="Invalid Cartesi machine">
                    {error}
                </Alert>
            )}
            <Box pos="relative">
                <LoadingOverlay
                    visible={loading}
                    loaderProps={{ type: "dots" }}
                />
                <Grid>
                    <Grid.Col span={{ base: 6, sm: 9 }} w={0}>
                        <Stack gap={0}>
                            <Text size="xs">Cartesi Machine Hash</Text>
                            <Text
                                truncate
                                fw={600}
                                c={hash ? undefined : "red"}
                            >
                                {hash ?? "No hash found"}
                            </Text>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{ base: 4, sm: 2 }}>
                        <Stack gap={0}>
                            <Text size="xs">Size</Text>
                            <Text fw={600}>{bytes(Number(size))}</Text>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={{ base: 2, sm: 1 }}>
                        <Group justify="flex-end" h="100%">
                            <ActionIcon
                                variant="transparent"
                                onClick={toggle}
                                disabled={loading}
                            >
                                <IconChevronDown
                                    style={{
                                        rotate: details ? "180deg" : "0deg",
                                    }}
                                />
                            </ActionIcon>
                        </Group>
                    </Grid.Col>
                </Grid>

                <Stack gap={0} miw={0} flex={"1 0 0"}>
                    <Collapse in={details}>
                        <MachineFiles entries={entries} />
                    </Collapse>
                </Stack>
            </Box>
        </Stack>
    );
};

export default MachineCard;
