import { Avatar, Group, SegmentedControl, Title } from "@mantine/core";
import type { FC } from "react";

interface RollupsVersionSelectorProps {
    value: "v1" | "v2" | undefined;
    onChange: (value: "v1" | "v2") => void;
}

const RollupsVersionSelector: FC<RollupsVersionSelectorProps> = (props) => {
    const versions = [
        {
            value: "v1",
            label: (
                <Group p={10}>
                    <Avatar src="ctsi.svg" size="md" />
                    <Title order={4}>Cartesi Rollups V1</Title>
                </Group>
            ),
        },
        {
            value: "v2",
            label: (
                <Group p={10}>
                    <Avatar src="ctsi.svg" size="md" />
                    <Title order={4}>Cartesi Rollups V2</Title>
                </Group>
            ),
        },
    ];
    return (
        <SegmentedControl
            data={versions}
            value={props.value}
            onChange={(value) => props.onChange(value as "v1" | "v2")}
        />
    );
};

export default RollupsVersionSelector;
