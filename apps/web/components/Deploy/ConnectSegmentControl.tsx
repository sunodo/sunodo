import { SegmentedControl } from "@mantine/core";
import { FC } from "react";
import { useAccount, useSwitchChain } from "wagmi";

export const ConnectSegmentControl: FC = () => {
    const { chain } = useAccount();
    const { chains, switchChain } = useSwitchChain();

    const options = chains.map((chain) => ({
        label: chain.name,
        value: chain.id.toString(),
    }));

    return (
        <SegmentedControl
            value={chain?.id.toString()}
            onChange={(value) => {
                switchChain({ chainId: parseInt(value) });
            }}
            data={options}
        />
    );
};
