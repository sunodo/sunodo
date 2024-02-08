import {
    ActionIcon,
    Anchor,
    CopyButton,
    Group,
    rem,
    Text,
    TextProps,
    Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import Link from "next/link";
import { FC } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { Address, getAddress } from "viem";

export type AddressProps = TextProps & {
    value: Address;
    href?: string;
    icon?: boolean;
    iconSize?: number;
    shorten?: boolean;
};

const AddressText: FC<AddressProps> = (props) => {
    const { href, icon, iconSize, shorten, ...rest } = props;
    const value = getAddress(props.value);
    const text = shorten ? `${value.slice(0, 8)}...${value.slice(-6)}` : value;

    const label = shorten ? (
        <Tooltip label={value} withArrow>
            <Text {...rest}>{text}</Text>
        </Tooltip>
    ) : (
        <Text {...rest}>{text}</Text>
    );

    return (
        <Group gap={6} wrap="nowrap" align="center">
            {icon && (
                <Group flex={0}>
                    <Jazzicon
                        diameter={iconSize ?? 20}
                        seed={jsNumberForAddress(value)}
                    />
                </Group>
            )}

            {href ? (
                <Anchor href={href} component={Link}>
                    {label}
                </Anchor>
            ) : (
                label
            )}
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
                                <IconCheck style={{ width: rem(16) }} />
                            ) : (
                                <IconCopy style={{ width: rem(16) }} />
                            )}
                        </ActionIcon>
                    </Tooltip>
                )}
            </CopyButton>
        </Group>
    );
};

export default AddressText;
