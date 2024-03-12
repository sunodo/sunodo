import { Center, Table, Text } from "@mantine/core";
import bytes from "bytes";
import { FC } from "react";

import { CartesiMachineEntry } from "../../src/hooks/machine";

type MachineFilesProps = {
    entries: CartesiMachineEntry[];
};

const MachineFiles: FC<MachineFilesProps> = ({ entries }) => {
    return (
        <Table.ScrollContainer minWidth={900} type="native">
            <Table ff="monospace" withRowBorders={false}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th></Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>CID</Table.Th>
                        <Table.Th align="right">Size</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {entries.map((entry, index) => (
                        <Table.Tr key={index}>
                            <Table.Td>{index}</Table.Td>
                            <Table.Td>{entry.name}</Table.Td>
                            <Table.Td>{entry.cid.toString()}</Table.Td>
                            <Table.Td align="right">
                                {bytes(Number(entry.size))}
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
        </Table.ScrollContainer>
    );
};

export default MachineFiles;
