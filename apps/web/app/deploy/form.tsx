import { createFormContext } from "@mantine/form";
import { Address, isAddress } from "viem";

export type Token = {
    address: Address;
    name: string;
    symbol: string;
    decimals: number;
};

type ConsensusType = "authority" | "multisig" | "quorum" | "unpermissioned";

type Consensus = {
    address: Address;
    type: ConsensusType;
};

export type ValidatorNodeProvider = {
    address: Address;
    consensus: Consensus;
    owner: Address;
    token: Token;
    payee: Address;
    price: bigint;
    paused: boolean;
};

interface DeployFormValues {
    owner?: Address;
    location: string;
    provider?: Address;
    days: number;
}

export const DeployTransformedValues = (values: DeployFormValues) => ({
    owner: values.owner && isAddress(values.owner) ? values.owner : "0x",
    location: values.location,
    provider:
        values.provider && isAddress(values.provider) ? values.provider : "0x",
    initialRunway: BigInt(values.days) * 24n * 60n * 60n, // convert to bigint seconds
});

export const [DeployFormProvider, useDeployFormContext, useDeployForm] =
    createFormContext<DeployFormValues, typeof DeployTransformedValues>();
