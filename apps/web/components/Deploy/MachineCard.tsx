"use client";

import {
    ActionIcon,
    Collapse,
    Grid,
    Group,
    Stack,
    Text,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown } from "@tabler/icons-react";
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
        <Stack gap={"lg"}>
            <Grid>
                <Grid.Col span={{ base: 6, sm: 9 }} w={0}>
                    <Stack gap={0}>
                        <Text size="xs">Cartesi Machine Hash</Text>
                        <Tooltip withArrow label={machine.hash ?? "<unknown>"}>
                            <Text truncate fw={600}>
                                {machine.hash ?? "<unknown>"}
                            </Text>
                        </Tooltip>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 4, sm: 2 }}>
                    <Stack gap={0}>
                        <Text size="xs">Size</Text>
                        <Text fw={600}>{bytes(size)}</Text>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 2, sm: 1 }}>
                    <Group justify="flex-end">
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
        </Stack>
    );
};

export default MachineCard;
