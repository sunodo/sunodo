import { Alert, Stack, Text } from "@mantine/core";
import { FC } from "react";
import { Address } from "viem";
import {
    arbitrum,
    arbitrumSepolia,
    mainnet,
    optimism,
    optimismSepolia,
    sepolia,
} from "viem/chains";

import Link from "next/link";
import { useAccount } from "wagmi";
import { ValidatorNodeProvider } from "../../app/deploy/form";

type ApplicationProps = {
    applicationAddress: Address;
    provider: ValidatorNodeProvider;
};

const chainNames: Record<number, string> = {
    [arbitrum.id]: "arbitrum",
    [arbitrumSepolia.id]: "arbitrum-sepolia",
    [mainnet.id]: "mainnet",
    [optimism.id]: "optimism",
    [optimismSepolia.id]: "optimism-sepolia",
    [sepolia.id]: "sepolia",
};

export const Application: FC<ApplicationProps> = (props) => {
    const { applicationAddress, provider } = props;
    const { chain } = useAccount();

    let node = (
        <Text>
            Contact the node provider to know the address of the application
            node.
        </Text>
    );

    if (provider.baseUrl && chain) {
        const chainName = chainNames[chain.id];

        // variables available to baseUrl:
        const baseUrl = provider.baseUrl
            .replaceAll("{{application_address}}", applicationAddress)
            .replaceAll("{{chain_name}}", chainName)
            .replaceAll("{{chain_id}}", chain.id.toString())
            .replaceAll("{{provider_address}}", provider.address);
        const graphqlUrl = `${baseUrl}/graphql`;
        const inspectUrl = `${baseUrl}/inspect`;

        node = (
            <Stack>
                <Text>
                    GraphQL: <Link href={graphqlUrl}>{graphqlUrl}</Link>
                </Text>
                <Text>
                    Inspect: <Link href={inspectUrl}>{inspectUrl}</Link>
                </Text>
            </Stack>
        );
    }

    return (
        <Alert
            variant="light"
            color="green"
            title={`Application deployed: ${applicationAddress}`}
        >
            {node}
        </Alert>
    );
};
