"use client";
import {
    ActionIcon,
    Collapse,
    Group,
    JsonInput,
    Table,
    Tabs,
    Text,
    Textarea,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { FC } from "react";
import prettyMilliseconds from "pretty-ms";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { Hex, getAddress, hexToString } from "viem";
import {
    TbAlphabetLatin,
    TbArrowRight,
    TbX,
    TbFileText,
    TbJson,
} from "react-icons/tb";
import { useDisclosure } from "@mantine/hooks";
import { InputItemFragment } from "../../graphql";
import Address from "../address";

export type InputCardProps = {
    input: InputItemFragment;
};

const InputTr: FC<InputCardProps> = ({ input }) => {
    const [opened, { toggle }] = useDisclosure(false);
    const age = prettyMilliseconds(Date.now() - input.timestamp * 1000, {
        unitCount: 2,
        verbose: true,
    });
    return (
        <>
            <Table.Tr>
                <Table.Td>
                    <Address value={input.msgSender as Address} icon />
                </Table.Td>
                <Table.Td>
                    <TbArrowRight />
                </Table.Td>
                <Table.Td>
                    <Address value={input.application.id as Address} icon />
                </Table.Td>
                <Table.Td>
                    <Text>{input.index}</Text>
                </Table.Td>
                <Table.Td>
                    <Text>{age} ago</Text>
                </Table.Td>
                <Table.Td>
                    <ActionIcon variant="default" onClick={toggle}>
                        {opened ? <TbX /> : <TbFileText />}
                    </ActionIcon>
                </Table.Td>
            </Table.Tr>
            <Table.Tr></Table.Tr>
            <Table.Tr>
                <Table.Td colSpan={6} p={0}>
                    <Collapse in={opened}>
                        <Tabs defaultValue="raw">
                            <Tabs.List>
                                <Tabs.Tab
                                    value="raw"
                                    leftSection={<TbFileText />}
                                >
                                    Raw
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value="text"
                                    leftSection={<TbAlphabetLatin />}
                                >
                                    As Text
                                </Tabs.Tab>
                                <Tabs.Tab value="json" leftSection={<TbJson />}>
                                    As JSON
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="raw">
                                <Textarea rows={10}>{input.payload}</Textarea>
                            </Tabs.Panel>

                            <Tabs.Panel value="text">
                                <Textarea
                                    rows={10}
                                    value={hexToString(input.payload as Hex)}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel value="json">
                                <JsonInput
                                    rows={10}
                                    value={hexToString(input.payload as Hex)}
                                />
                            </Tabs.Panel>
                        </Tabs>
                    </Collapse>
                </Table.Td>
            </Table.Tr>
        </>
    );
};

export default InputTr;
