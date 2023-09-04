"use client";
import { FC } from "react";
import { useInputsQuery } from "../../graphql/index";
import { Table, Title } from "@mantine/core";
import InputTr from "../../components/explorer/inputTr";

const Explorer: FC = (props) => {
    const [{ data }] = useInputsQuery();
    return (
        <div>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>From</Table.Th>
                        <Table.Th></Table.Th>
                        <Table.Th>To</Table.Th>
                        <Table.Th>Method</Table.Th>
                        <Table.Th>Index</Table.Th>
                        <Table.Th>Age</Table.Th>
                        <Table.Th>Data</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data?.inputs.map((input) => (
                        <InputTr key={input.id} input={input} />
                    ))}
                </Table.Tbody>
            </Table>
        </div>
    );
};

export default Explorer;
