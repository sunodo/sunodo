import type { Meta, StoryObj } from "@storybook/react";
import { zeroHash } from "viem";
import NodeConfigV2 from "../../../components/Deploy/SelfHosted/NodeConfigV2";

const meta: Meta<typeof NodeConfigV2> = {
    component: NodeConfigV2,
    title: "Design System/Deploy/SelfHosted/NodeConfigV2",
} satisfies Meta<typeof NodeConfigV2>;

export default meta;
type Story = StoryObj<typeof NodeConfigV2>;

export const Default: Story = {
    args: {
        applicationAddress: "0x1234567890123456789012345678901234567890",
        chainId: 11155111,
        templateHash: zeroHash,
    },
};
