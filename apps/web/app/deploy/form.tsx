import { createFormContext } from "@mantine/form";
import { Address, isAddress } from "viem";
import { Token } from "../../src/hooks/token";

type ConsensusType = "authority" | "multisig" | "quorum" | "unpermissioned";

type Consensus = {
    address: Address;
    type: ConsensusType;
};

export type ValidatorNodeProvider = {
    address: Address;
    baseUrl: string | null;
    email: string | null;
    ensName: string | null;
    consensus: Consensus;
    owner: Address;
    token: Token;
    payee: Address;
    price: bigint;
    paused: boolean;
    url: string | null;
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
