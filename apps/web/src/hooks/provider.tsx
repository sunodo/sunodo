import { Address, isAddress } from "viem";
import { useToken } from "wagmi";
import { ValidatorNodeProvider } from "../../app/deploy/form";
import {
    useValidatorNodeProviderConsensus,
    useValidatorNodeProviderCost,
    useValidatorNodeProviderOwner,
    useValidatorNodeProviderPaused,
    useValidatorNodeProviderPayee,
    useValidatorNodeProviderToken,
} from "../contracts";

export const useValidatorNodeProvider = (
    address?: Address,
    time?: bigint,
): ValidatorNodeProvider | undefined => {
    const { data: consensusAddress } = useValidatorNodeProviderConsensus({
        address,
        enabled: address && isAddress(address),
    });
    const { data: owner } = useValidatorNodeProviderOwner({
        address,
        enabled: address && isAddress(address),
    });
    const { data: paused } = useValidatorNodeProviderPaused({
        address,
        enabled: address && isAddress(address),
    });
    const { data: payee } = useValidatorNodeProviderPayee({
        address,
        enabled: address && isAddress(address),
    });
    const { data: tokenAddress } = useValidatorNodeProviderToken({
        address,
        enabled: address && isAddress(address),
    });
    const { data: price } = useValidatorNodeProviderCost({
        address,
        args: [time ?? 0n],
        enabled: address && isAddress(address),
    });
    const { data: token } = useToken({ address: tokenAddress });

    if (
        address &&
        consensusAddress &&
        owner &&
        paused !== undefined &&
        payee &&
        token &&
        price !== undefined
    ) {
        return {
            address,
            consensus: {
                address: consensusAddress,
                type: "authority",
            },
            owner,
            paused,
            payee,
            price,
            token,
        };
    } else {
        return undefined;
    }
};
