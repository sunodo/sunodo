import type { TextProps } from "@mantine/core";
import {
    ActionIcon,
    Anchor,
    CopyButton,
    Group,
    Text,
    Tooltip,
    rem,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import Link from "next/link";
import type { FC } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import type { Address } from "viem";
import { getAddress } from "viem";

export type AddressProps = TextProps & {
    value: Address | undefined;
    href?: string;
    icon?: boolean;
    iconSize?: number;
    shorten?: boolean;
};

const AddressText: FC<AddressProps> = (props) => {
    const { href, icon, iconSize, shorten, ...rest } = props;
    const value = props.value ? getAddress(props.value) : undefined;
    const text = value
        ? shorten
            ? `${value.slice(0, 8)}...${value.slice(-6)}`
            : value
        : "0x";

    const label = shorten ? (
        <Tooltip label={value} withArrow>
            <Text {...rest}>{text}</Text>
        </Tooltip>
    ) : (
        <Text {...rest}>{text}</Text>
    );

    return (
        <Group gap={6} wrap="nowrap" align="center">
            {icon && value && (
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
            {value && (
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
            )}
        </Group>
    );
};

export default AddressText;
