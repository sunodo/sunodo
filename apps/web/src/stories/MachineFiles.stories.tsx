import type { Meta, StoryObj } from "@storybook/react";
import MachineFiles from "../../components/Deploy/MachineFiles";

const meta: Meta<typeof MachineFiles> = {
    component: MachineFiles,
    tags: ["autodocs"],
} satisfies Meta<typeof MachineFiles>;

export default meta;
type Story = StoryObj<typeof MachineFiles>;

export const Default: Story = {
    args: {
        entries: [
            {
                cid: "QmXv6N1QQRMfVJKiahcUpde5tUvP6wLNsS9gAhWoE79Kfc",
                path: "0000000000001000-f000.bin",
                size: 61454,
            },
            {
                cid: "Qmdh2LTAw5mXrxJGXT4VdEJ41nM5ALBDH6xRYtkUjBaEt4",
                path: "0000000000020000-6000.bin",
                size: 24590,
            },
            {
                cid: "QmU68T3Vv6StTYeUnbLK4iX8EgiLy7Jg4zmEKbPkRtG4pg",
                path: "0000000060000000-200000.bin",
                size: 2097657,
            },
            {
                cid: "QmU68T3Vv6StTYeUnbLK4iX8EgiLy7Jg4zmEKbPkRtG4pg",
                path: "0000000060200000-200000.bin",
                size: 2097657,
            },
            {
                cid: "QmTFL1ubwvu8pUaSRGfN4MFWG35ywsRuYWwPSkMofCfwwP",
                path: "0000000060400000-1000.bin",
                size: 4107,
            },
            {
                cid: "QmU68T3Vv6StTYeUnbLK4iX8EgiLy7Jg4zmEKbPkRtG4pg",
                path: "0000000060600000-200000.bin",
                size: 2097657,
            },
            {
                cid: "QmU68T3Vv6StTYeUnbLK4iX8EgiLy7Jg4zmEKbPkRtG4pg",
                path: "0000000060800000-200000.bin",
                size: 2097657,
            },
            {
                cid: "QmXRcsUaTVnQHChkrwasLBf8GrTHrs657H1XPqJAQeSxSs",
                path: "0000000080000000-8000000.bin",
                size: 134249661,
            },
            {
                cid: "QmSLt9Yvzm7Fi4CVVfExcbznU69HVszJ7gwXkgWCUuAvrp",
                path: "0080000000000000-1047b000.bin",
                size: 273198542,
            },
            {
                cid: "Qmcoxj6wFjzt2unGyBtTzskckRQxaRbmda74yvxiBUfKk3",
                path: "config.protobuf",
                size: 699,
            },
            {
                cid: "QmUxuVsaZdzv8WeKjYu3sv6btw6CzsgVbypPkBt7wwbWfh",
                path: "hash",
                size: 40,
            },
        ],
    },
};

export const Empty: Story = {
    args: {
        entries: [],
    },
};
