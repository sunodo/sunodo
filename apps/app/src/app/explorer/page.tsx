"use client";
import { FC } from "react";
import { useInputsQuery } from "../../graphql/index";
import { Table } from "@mantine/core";
import InputTr from "../../components/explorer/inputTr";

const Explorer: FC = (props) => {
    const [{ data }] = useInputsQuery();
    return (
        <div>
            <Table>
                <Table.Thead>
                    <Table.Th>From</Table.Th>
                    <Table.Th></Table.Th>
                    <Table.Th>To</Table.Th>
                    <Table.Th>Index</Table.Th>
                    <Table.Th>Age</Table.Th>
                    <Table.Th>Data</Table.Th>
                </Table.Thead>
                {data?.inputs.map((input) => (
                    <InputTr key={input.id} input={input} />
                ))}
            </Table>
        </div>
    );
};

export default Explorer;
