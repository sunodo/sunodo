import { useEffect, useState } from "react";
import { Address } from "viem";
import { usePublicClient, useReadContracts } from "wagmi";
import { ValidatorNodeProvider } from "../../app/deploy/form";
import { validatorNodeProviderAbi } from "../contracts";
import { useToken } from "./token";

export const useValidatorNodeProvider = (
    address?: Address,
    time?: bigint,
): ValidatorNodeProvider | undefined => {
    const contract = { abi: validatorNodeProviderAbi, address } as const;

    const { data } = useReadContracts({
        contracts: [
            { ...contract, functionName: "consensus" },
            { ...contract, functionName: "owner" },
            { ...contract, functionName: "paused" },
            { ...contract, functionName: "payee" },
            { ...contract, functionName: "token" },
            { ...contract, functionName: "cost", args: [time ?? 0n] },
        ],
    });
    const [consensusAddress, owner, paused, payee, tokenAddress, price] =
        data || [];

    const token = useToken(tokenAddress?.result);

    const publicClient = usePublicClient();
    const [ensName, setEnsName] = useState<string | null>(null);
    const [baseUrl, setBaseUrl] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        if (
            address &&
            publicClient &&
            publicClient.chain.contracts?.ensUniversalResolver
        ) {
            publicClient.getEnsName({ address }).then((name) => {
                if (name) {
                    setEnsName(name);

                    publicClient
                        .getEnsText({ name, key: "io.sunodo.baseUrl" })
                        .then(setBaseUrl);
                    publicClient
                        .getEnsText({ name, key: "email" })
                        .then(setEmail);
                    publicClient.getEnsText({ name, key: "url" }).then(setUrl);
                }
            });
        }
    }, [address]);

    if (
        address &&
        consensusAddress?.result &&
        owner?.result &&
        paused?.result !== undefined &&
        payee?.result &&
        token &&
        price?.result !== undefined
    ) {
        return {
            address,
            baseUrl,
            email,
            ensName,
            consensus: {
                address: consensusAddress.result,
                type: "authority",
            },
            owner: owner.result,
            paused: paused.result,
            payee: payee.result,
            price: price.result,
            token,
            url,
        };
    } else {
        return undefined;
    }
};
