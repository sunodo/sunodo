import { useQueryClient } from "@tanstack/react-query";
import { GetBalanceReturnType } from "@wagmi/core";
import { useEffect } from "react";
import { Address, erc20Abi } from "viem";
import {
    UseSimulateContractReturnType,
    useBalance,
    useBlockNumber,
    useReadContracts,
    useWaitForTransactionReceipt,
} from "wagmi";
import {
    useReadErc20Allowance,
    useSimulateErc20Approve,
    useWriteErc20Approve,
} from "../contracts";

export type Token = {
    address: Address;
    name: string;
    symbol: string;
    decimals: number;
};

export const useToken = (address?: Address) => {
    const contract = {
        abi: erc20Abi,
        address,
    } as const;
    const read = useReadContracts({
        contracts: [
            { ...contract, functionName: "name" },
            { ...contract, functionName: "symbol" },
            { ...contract, functionName: "decimals" },
        ],
    });
    if (read.status === "success") {
        const [{ result: name }, { result: symbol }, { result: decimals }] =
            read.data;
        if (address && name && symbol && decimals !== undefined) {
            return { address, name, symbol, decimals };
        }
    }
    return undefined;
};

type UseTokenApprovalReturnType = {
    allowance?: bigint;
    balance?: GetBalanceReturnType;
    simulate: UseSimulateContractReturnType<typeof erc20Abi, "approve">;
    execute: ReturnType<typeof useWriteErc20Approve>;
    receipt: ReturnType<typeof useWaitForTransactionReceipt>;
    token?: Token;
};

export const useTokenApproval = (options: {
    address?: Address;
    owner?: Address;
    spender?: Address;
    amount?: bigint;
}): UseTokenApprovalReturnType => {
    const { address, owner, spender, amount } = options;
    const queryClient = useQueryClient();
    const token = useToken(address);

    const { data: blockNumber } = useBlockNumber({ watch: true });
    const { data: balance, queryKey: balanceQueryKey } = useBalance({
        address: owner,
        token: address,
    });

    const { data: allowance, queryKey: allowanceQueryKey } =
        useReadErc20Allowance({
            address,
            args: owner && spender && [owner, spender],
        });

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: balanceQueryKey });
        queryClient.invalidateQueries({ queryKey: allowanceQueryKey });
    }, [blockNumber, queryClient]);

    const simulate = useSimulateErc20Approve({
        address,
        args:
            !!spender &&
            allowance !== undefined &&
            amount !== undefined &&
            balance !== undefined &&
            balance.value >= amount &&
            allowance < amount
                ? [spender, amount]
                : undefined,
    });

    const execute = useWriteErc20Approve();
    const receipt = useWaitForTransactionReceipt({ hash: execute.data });

    return {
        allowance,
        balance,
        simulate,
        execute,
        receipt,
        token,
    };
};
