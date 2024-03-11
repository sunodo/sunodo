import type { Meta, StoryObj } from "@storybook/react";
import { zeroAddress } from "viem";
import { Approval } from "../../components/Deploy/Approval";
import { Token } from "../hooks/token";

const meta: Meta<typeof Approval> = {
    component: Approval,
    tags: ["autodocs"],
} satisfies Meta<typeof Approval>;

export default meta;
type Story = StoryObj<typeof Approval>;

const token: Token = {
    address: "0xf795b3D15D47ac1c61BEf4Cc6469EBb2454C6a9b",
    name: "Sunodo Token",
    decimals: 18,
    symbol: "SUN",
};

const nativeCurrency: Omit<Token, "address"> = {
    name: "Ethereum",
    decimals: 18,
    symbol: "ETH",
};

export const InsufficientBalance: Story = {
    render: (props) => (
        <Approval
            {...props}
            allowance={0n}
            amount={24500000000000000000n}
            balance={0n}
            ethBalance={100000000000000000n}
            nativeCurrency={nativeCurrency}
            spender={zeroAddress}
            token={token}
        />
    ),
};

export const InsufficientEthBalance: Story = {
    render: (props) => (
        <Approval
            {...props}
            allowance={0n}
            amount={24500000000000000000n}
            balance={44500000000000000000n}
            ethBalance={0n}
            nativeCurrency={nativeCurrency}
            spender={zeroAddress}
            token={token}
        />
    ),
};

export const NeedApprove: Story = {
    render: (props) => (
        <Approval
            {...props}
            allowance={100000000000000000n}
            amount={24500000000000000000n}
            balance={44500000000000000000n}
            ethBalance={100000000000000000n}
            nativeCurrency={nativeCurrency}
            spender={zeroAddress}
            token={token}
        />
    ),
};

export const Approving: Story = {
    render: (props) => (
        <Approval
            {...props}
            allowance={100000000000000000n}
            approving={true}
            amount={24500000000000000000n}
            balance={44500000000000000000n}
            ethBalance={100000000000000000n}
            nativeCurrency={nativeCurrency}
            spender={zeroAddress}
            token={token}
        />
    ),
};

export const Error: Story = {
    render: (props) => (
        <Approval
            {...props}
            allowance={100000000000000000n}
            error="Something went wrong. May be a very long error description"
            amount={24500000000000000000n}
            balance={44500000000000000000n}
            ethBalance={100000000000000000n}
            nativeCurrency={nativeCurrency}
            spender={zeroAddress}
            token={token}
        />
    ),
};

export const SufficientAllowance: Story = {
    render: (props) => (
        <Approval
            {...props}
            allowance={24500000000000000000n}
            amount={24500000000000000000n}
            balance={44500000000000000000n}
            ethBalance={100000000000000000n}
            nativeCurrency={nativeCurrency}
            spender={zeroAddress}
            token={token}
        />
    ),
};
