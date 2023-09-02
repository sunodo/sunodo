"use client";
import { FC } from "react";
import { useInputsQuery } from "../../graphql";

const Explorer: FC = (props) => {
    const [{ data }] = useInputsQuery();
    return (
        <div>
            <h1>Explorer</h1>
            <ul>
                {data?.inputs.map((input) => (
                    <li key={input.id}>{input.application.id}</li>
                ))}
            </ul>
        </div>
    );
};

export default Explorer;
