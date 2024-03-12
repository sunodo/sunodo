import { useEffect, useState } from "react";
import { Address, Hex } from "viem";
import {
    UseSimulateContractReturnType,
    usePublicClient,
    useWaitForTransactionReceipt,
} from "wagmi";
import {
    cartesiDAppFactoryAbi,
    cartesiDAppFactoryAddress,
    useSimulateValidatorNodeProviderDeploy,
    useWriteValidatorNodeProviderDeploy,
    validatorNodeProviderAbi,
} from "../contracts";

type UseDeployApplicationReturnType = {
    applicationAddress?: Address;
    simulate: UseSimulateContractReturnType<
        typeof validatorNodeProviderAbi,
        "deploy"
    >;
    execute: ReturnType<typeof useWriteValidatorNodeProviderDeploy>;
    wait: ReturnType<typeof useWaitForTransactionReceipt>;
};

export const useDeployApplication = (options: {
    allowance?: bigint;
    amount?: bigint;
    balance?: bigint;
    initialRunway?: bigint;
    location?: string;
    machineHash?: Hex;
    owner?: Address;
    providerAddress?: Address;
}): UseDeployApplicationReturnType => {
    const {
        allowance,
        amount,
        balance,
        initialRunway,
        location,
        machineHash,
        owner,
        providerAddress,
    } = options;

    // application address
    const [applicationAddress, setApplicationAddress] = useState<
        Address | undefined
    >(undefined);

    const enabled =
        owner !== undefined &&
        machineHash !== undefined &&
        location !== undefined &&
        initialRunway !== undefined &&
        allowance !== undefined &&
        amount !== undefined &&
        balance !== undefined &&
        allowance >= amount &&
        balance >= amount;
    const simulate = useSimulateValidatorNodeProviderDeploy({
        address: providerAddress,
        args: [owner!, machineHash!, location!, initialRunway!],
        query: { enabled },
    });

    const execute = useWriteValidatorNodeProviderDeploy();
    const wait = useWaitForTransactionReceipt({ hash: execute.data });

    // read application address from executed transaction by going through the
    // transaction receipt logs
    const publicClient = usePublicClient();
    useEffect(() => {
        if (wait.data?.blockHash && publicClient) {
            publicClient
                .getContractEvents({
                    abi: cartesiDAppFactoryAbi,
                    address: cartesiDAppFactoryAddress,
                    eventName: "ApplicationCreated",
                    blockHash: wait.data?.blockHash,
                })
                .then(([event]) => {
                    setApplicationAddress(event?.args.application);
                });
        }
    }, [wait.data?.blockHash]);

    return { applicationAddress, simulate, execute, wait };
};
