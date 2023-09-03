import {
    ActionIcon,
    CopyButton,
    Group,
    rem,
    Text,
    Tooltip,
} from "@mantine/core";
import { FC } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { Address } from "viem";
import { TbCheck, TbCopy } from "react-icons/tb";

export type AddressProps = {
    value: Address;
    icon?: boolean;
    iconSize?: number;
};

const Address: FC<AddressProps> = ({ value, icon, iconSize }) => {
    return (
        <Group gap={10}>
            {icon && (
                <Jazzicon
                    diameter={iconSize ?? 20}
                    seed={jsNumberForAddress(value)}
                />
            )}
            <Text>{value}</Text>
            <CopyButton value={value} timeout={2000}>
                {({ copied, copy }) => (
                    <Tooltip
                        label={copied ? "Copied" : "Copy"}
                        withArrow
                        position="right"
                    >
                        <ActionIcon
                            color={copied ? "teal" : "gray"}
                            variant="subtle"
                            onClick={copy}
                        >
                            {copied ? (
                                <TbCheck style={{ width: rem(16) }} />
                            ) : (
                                <TbCopy style={{ width: rem(16) }} />
                            )}
                        </ActionIcon>
                    </Tooltip>
                )}
            </CopyButton>
        </Group>
    );
};

export default Address;
