import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { FC } from "react";

const WalletInstructions: FC = () => {
    return (
        <Alert variant="light" icon={<IconInfoCircle />}>
            The rollups node uses a wallet to submit transactions to the base
            layer chain. This wallet should ideally be used exclusively for that
            purpose. Input here the wallet address. NOT the private key or
            mnemonic.
        </Alert>
    );
};

export default WalletInstructions;
