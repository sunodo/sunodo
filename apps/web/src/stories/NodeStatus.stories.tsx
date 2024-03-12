import type { Meta, StoryObj } from "@storybook/react";
import NodeStatus from "../../components/Deploy/NodeStatus";

const meta: Meta<typeof NodeStatus> = {
    component: NodeStatus,
    tags: ["autodocs"],
} satisfies Meta<typeof NodeStatus>;

export default meta;
type Story = StoryObj<typeof NodeStatus>;

export const Waiting: Story = {
    args: {
        application: "0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366",
        graphqlUrl:
            "https://sepolia.sunodo.io/0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366/graphql",
        waiting: true,
        timeout: Date.now() + 30000,
    },
};

export const Success: Story = {
    args: {
        application: "0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366",
        graphqlUrl:
            "https://sepolia.sunodo.io/0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366/graphql",
        waiting: false,
        timeout: Date.now() + 30000,
    },
};

export const Timeout: Story = {
    args: {
        application: "0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366",
        graphqlUrl:
            "https://sepolia.sunodo.io/0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366/graphql",
        waiting: false,
        timeout: Date.now() + 30000,
    },
};
