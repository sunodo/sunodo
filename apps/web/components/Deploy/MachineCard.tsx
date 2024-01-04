"use client";

import {
    Center,
    Collapse,
    Grid,
    Stack,
    Switch,
    Table,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import bytes from "bytes";
import { FC } from "react";
import { CartesiMachineData } from "../../src/hooks/cartesiMachineHash";

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
                    <Text size="xl" fw={600}>
                        {machine.hash ?? "<unknown>"}
                    </Text>
                </Stack>
            </Grid.Col>
            <Grid.Col span={2}>
                <Stack gap={0}>
                    <Text size="sm">Size</Text>
                    <Text size="xl" fw={600}>
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
                    <Table ff="monospace" withRowBorders={false}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th></Table.Th>
                                <Table.Th>Path</Table.Th>
                                <Table.Th>CID</Table.Th>
                                <Table.Th align="right">Size</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {entries.map((entry, index) => (
                                <Table.Tr key={index}>
                                    <Table.Td>{index}</Table.Td>
                                    <Table.Td>{entry.path}</Table.Td>
                                    <Table.Td>{entry.cid}</Table.Td>
                                    <Table.Td align="right">
                                        {bytes(entry.size)}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                            {entries.length === 0 && (
                                <Table.Tr>
                                    <Table.Td colSpan={4}>
                                        <Center>
                                            <Text c="dimmed">No entries</Text>
                                        </Center>
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Collapse>
            </Grid.Col>
        </>
    );
};

export default MachineCard;
