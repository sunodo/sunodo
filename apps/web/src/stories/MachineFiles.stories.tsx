import type { Meta, StoryObj } from "@storybook/react";
import { CID } from "multiformats/cid";

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
                cid: CID.parse(
                    "QmXv6N1QQRMfVJKiahcUpde5tUvP6wLNsS9gAhWoE79Kfc",
                ),
                depth: 1,
                name: "0000000000001000-f000.bin",
                path: "bafybeigvhumdetx6ek7egrt6ycqjlf47ecoegwpiwcrye3yg4hlt5c5gga/0000000000001000-f000.bin",
                size: 61454n,
                type: "file",
            },
            {
                cid: CID.parse(
                    "Qmdh2LTAw5mXrxJGXT4VdEJ41nM5ALBDH6xRYtkUjBaEt4",
                ),
                depth: 1,
                name: "0000000000020000-6000.bin",
                path: "bafybeigvhumdetx6ek7egrt6ycqjlf47ecoegwpiwcrye3yg4hlt5c5gga/0000000000020000-6000.bin",
                size: 24590n,
                type: "file",
            },
            {
                cid: CID.parse(
                    "QmU68T3Vv6StTYeUnbLK4iX8EgiLy7Jg4zmEKbPkRtG4pg",
                ),
                depth: 1,
                name: "0000000060000000-200000.bin",
                path: "bafybeigvhumdetx6ek7egrt6ycqjlf47ecoegwpiwcrye3yg4hlt5c5gga/0000000060000000-200000.bin",
                size: 2097657n,
                type: "file",
            },
            {
                cid: CID.parse(
                    "QmU68T3Vv6StTYeUnbLK4iX8EgiLy7Jg4zmEKbPkRtG4pg",
                ),
                depth: 1,
                name: "0000000060200000-200000.bin",
                path: "bafybeigvhumdetx6ek7egrt6ycqjlf47ecoegwpiwcrye3yg4hlt5c5gga/0000000060200000-200000.bin",
                size: 2097657n,
                type: "file",
            },
            {
                cid: CID.parse(
                    "QmTFL1ubwvu8pUaSRGfN4MFWG35ywsRuYWwPSkMofCfwwP",
                ),
                depth: 1,
                name: "0000000060400000-1000.bin",
                path: "bafybeigvhumdetx6ek7egrt6ycqjlf47ecoegwpiwcrye3yg4hlt5c5gga/0000000060400000-1000.bin",
                size: 4107n,
                type: "file",
            },
            {
                cid: CID.parse(
                    "QmU68T3Vv6StTYeUnbLK4iX8EgiLy7Jg4zmEKbPkRtG4pg",
                ),
                depth: 1,
                name: "0000000060600000-200000.bin",
                path: "bafybeigvhumdetx6ek7egrt6ycqjlf47ecoegwpiwcrye3yg4hlt5c5gga/0000000060600000-200000.bin",
                size: 2097657n,
                type: "file",
            },
            {
                cid: CID.parse(
                    "QmU68T3Vv6StTYeUnbLK4iX8EgiLy7Jg4zmEKbPkRtG4pg",
                ),
                depth: 1,
                name: "0000000060800000-200000.bin",
                path: "bafybeigvhumdetx6ek7egrt6ycqjlf47ecoegwpiwcrye3yg4hlt5c5gga/0000000060800000-200000.bin",
                size: 2097657n,
                type: "file",
            },
            {
                cid: CID.parse(
                    "QmXRcsUaTVnQHChkrwasLBf8GrTHrs657H1XPqJAQeSxSs",
                ),
                depth: 1,
                name: "0000000080000000-8000000.bin",
                path: "bafybeigvhumdetx6ek7egrt6ycqjlf47ecoegwpiwcrye3yg4hlt5c5gga/0000000080000000-8000000.bin",
                size: 134249661n,
                type: "file",
            },
            {
                cid: CID.parse(
                    "QmSLt9Yvzm7Fi4CVVfExcbznU69HVszJ7gwXkgWCUuAvrp",
                ),
                depth: 1,
                name: "0080000000000000-1047b000.bin",
                path: "bafybeigvhumdetx6ek7egrt6ycqjlf47ecoegwpiwcrye3yg4hlt5c5gga/0080000000000000-1047b000.bin",
                size: 273198542n,
                type: "file",
            },
            {
                cid: CID.parse(
                    "Qmcoxj6wFjzt2unGyBtTzskckRQxaRbmda74yvxiBUfKk3",
                ),
                depth: 1,
                name: "config.protobuf",
                path: "bafybeigvhumdetx6ek7egrt6ycqjlf47ecoegwpiwcrye3yg4hlt5c5gga/config.protobuf",
                size: 699n,
                type: "file",
            },
            {
                cid: CID.parse(
                    "QmUxuVsaZdzv8WeKjYu3sv6btw6CzsgVbypPkBt7wwbWfh",
                ),
                depth: 1,
                name: "hash",
                path: "bafybeigvhumdetx6ek7egrt6ycqjlf47ecoegwpiwcrye3yg4hlt5c5gga/QmUxuVsaZdzv8WeKjYu3sv6btw6CzsgVbypPkBt7wwbWfh/hash",
                size: 40n,
                type: "file",
            },
        ],
    },
};

export const Empty: Story = {
    args: {
        entries: [],
    },
};
