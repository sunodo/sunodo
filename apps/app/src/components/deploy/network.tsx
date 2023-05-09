import { FC } from "react";
import { Address } from "abitype";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Alert, Button, Group, Stack, Text } from "@mantine/core";
import { useAccount, useBalance, useNetwork } from "wagmi";

type NetworkProps = {
    onBack?: () => void;
    onNext?: (chainId: number, address: Address) => void;
};

const Network: FC<NetworkProps> = (props) => {
    const { address, isConnected } = useAccount();
    const { data: balance } = useBalance({ address });
    const { chain } = useNetwork();
    const canProceed = isConnected && address && balance && balance.value > 0;

    return (
        <Stack>
            <Text>Select the network and account to use in the deployment</Text>
            <ConnectButton />
            {balance && balance.value === 0n && (
                <Alert color="red" title="Zero balance">
                    Selected account must have balance for transaction fees.
                </Alert>
            )}
            <Group>
                <Button onClick={props.onBack}>Back</Button>
                <Button
                    disabled={!canProceed}
                    onClick={() =>
                        props.onNext &&
                        chain &&
                        address &&
                        props.onNext(chain.id, address)
                    }
                >
                    Next
                </Button>
            </Group>
        </Stack>
    );
};

export default Network;
