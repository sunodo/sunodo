"use client";
import { FC } from "react";
import { useInputsQuery } from "../../graphql/index";
import InputCard from "../../components/explorer/input";
import { Stack } from "@mantine/core";

const Explorer: FC = (props) => {
    const [{ data }] = useInputsQuery();
    return (
        <div>
            <Stack>
                {data?.inputs.map((input) => (
                    <InputCard key={input.id} input={input} />
                ))}
            </Stack>
        </div>
    );
};

export default Explorer;
