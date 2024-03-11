"use client";

import { Collapse, Grid, Stack, Switch, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import bytes from "bytes";
import { FC } from "react";
import { CartesiMachineData } from "../../src/hooks/cartesiMachineHash";
import MachineFiles from "./MachineFiles";

export type MachineCardProps = {
    machine: CartesiMachineData;
};

const MachineCard: FC<MachineCardProps> = ({ machine }) => {
    const { loading, entries } = machine;

    // calculate total size from entries
    const size = entries.reduce((acc, entry) => acc + entry.size, 0);

    // details toggle (entries table)
    const [details, { toggle }] = useDisclosure(false);

    return (
        <>
            <Grid.Col span={9}>
                <Stack gap={0}>
                    <Text size="sm">Cartesi Machine Hash</Text>
                    <Text size="lg" fw={600}>
                        {machine.hash ?? "<unknown>"}
                    </Text>
                </Stack>
            </Grid.Col>
            <Grid.Col span={2}>
                <Stack gap={0}>
                    <Text size="sm">Size</Text>
                    <Text size="lg" fw={600}>
                        {bytes(size)}
                    </Text>
                </Stack>
            </Grid.Col>
            <Grid.Col span={1}>
                <Stack gap={6}>
                    <Text size="sm">Details</Text>
                    <Switch
                        checked={details}
                        onChange={toggle}
                        disabled={loading}
                    />
                </Stack>
            </Grid.Col>
            <Grid.Col span={12}>
                <Collapse in={details}>
                    <MachineFiles entries={entries} />
                </Collapse>
            </Grid.Col>
        </>
    );
};

export default MachineCard;
