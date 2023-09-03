import { Group, Paper, Stack, Text, TextInput } from "@mantine/core";
import { FC } from "react";
import prettyMilliseconds from "pretty-ms";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import { InputItemFragment } from "../../graphql";

export type InputCardProps = {
    input: InputItemFragment;
};

const InputCard: FC<InputCardProps> = ({ input }) => {
    const age = prettyMilliseconds(Date.now() - input.timestamp * 1000, {
        unitCount: 2,
        verbose: true,
    });
    return (
        <Paper>
            <Group>
                <Jazzicon
                    diameter={50}
                    seed={jsNumberForAddress(input.application.id)}
                />
                <Stack gap={0}>
                    <Group>
                        <Text fw={700}>From</Text>
                        <Text>{input.msgSender}</Text>
                    </Group>
                    <Group>
                        <Text fw={700}>To</Text>
                        <Text>{input.application.id}</Text>
                    </Group>
                    <Group>
                        <Text fw={700}>Index</Text>
                        <Text>{input.index}</Text>
                    </Group>
                    <Group>
                        <Text fw={700}>Age</Text>
                        <Text>{age} ago</Text>
                    </Group>
                </Stack>
            </Group>
        </Paper>
    );
};

export default InputCard;
