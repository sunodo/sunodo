import {
    ActionIcon,
    Anchor,
    CopyButton,
    Group,
    rem,
    Text,
    Tooltip,
} from "@mantine/core";
import { FC } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { Address, getAddress } from "viem";
import { TbCheck, TbCopy } from "react-icons/tb";
import Link from "next/link";

import {
    dAppAddressRelayAddress,
    erc20PortalAddress,
    erc1155BatchPortalAddress,
    erc1155SinglePortalAddress,
    erc721PortalAddress,
    etherPortalAddress,
} from "../contracts";

export type AddressProps = {
    value: Address;
    href?: string;
    icon?: boolean;
    iconSize?: number;
    shorten?: boolean;
};

const cartesi: Record<Address, string> = {
    [dAppAddressRelayAddress]: "DAppAddressRelay",
    [erc20PortalAddress]: "ERC20Portal",
    [erc1155BatchPortalAddress]: "ERC1155BatchPortal",
    [erc1155SinglePortalAddress]: "ERC1155SinglePortal",
    [erc721PortalAddress]: "ERC721Portal",
    [etherPortalAddress]: "EtherPortal",
};

const resolveName = (value: Address) => {
    return cartesi[value];
};

const Address: FC<AddressProps> = ({
    href,
    value,
    icon,
    iconSize,
    shorten,
}) => {
    value = getAddress(value);
    const name = resolveName(value);
    const text = shorten ? `${value.substring(0, 24)}...` : value;
    const label = name ? (
        <Tooltip label={value}>
            <Text>{name}</Text>
        </Tooltip>
    ) : (
        <Text>{text}</Text>
    );
    return (
        <Group gap={10}>
            {icon && (
                <Jazzicon
                    diameter={iconSize ?? 20}
                    seed={jsNumberForAddress(value)}
                />
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
