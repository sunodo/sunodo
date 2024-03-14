import type { Meta, StoryObj } from "@storybook/react";
import HostingComponent from "../../../components/Deploy/Hosting";

const meta: Meta<typeof HostingComponent> = {
    component: HostingComponent,
    title: "Design System/Deploy/Hosting",
} satisfies Meta<typeof HostingComponent>;

export default meta;
type Story = StoryObj<typeof HostingComponent>;

export const Hosting: Story = {
    args: {
        method: undefined,
        onChange: () => {},
    },
};
