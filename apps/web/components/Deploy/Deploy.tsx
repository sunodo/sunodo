import {
    Button,
    Grid,
    Group,
    NumberInput,
    Paper,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import * as isIPFS from "is-ipfs";
import { FC, useState } from "react";
import { getAddress, isAddress } from "viem";
import { useAccount, useWaitForTransaction } from "wagmi";

import {
    useErc20Allowance,
    useErc20Approve,
    usePrepareErc20Approve,
    usePrepareValidatorNodeProviderDeploy,
    useValidatorNodeProviderDeploy,
} from "../../src/contracts";
import { useCartesiMachine } from "../../src/hooks/cartesiMachineHash";
import { useValidatorNodeProvider } from "../../src/hooks/provider";
import { TransactionProgress } from "../TransactionProgress";
import MachineCard from "./MachineCard";
import MachineInstructions from "./MachineInstructions";
import ProviderCard from "./ProviderCard";

type DeployProps = {
    cid: string;
};

const Deploy: FC<DeployProps> = (props) => {
    const { address } = useAccount();

    const [location, setLocation] = useState(props.cid);
    const locationError = location && !isIPFS.cid(location) && "Invalid CID";

    // load machine data from IPFS
    const machine = useCartesiMachine(location);

    // pre-payment
    const [days, setDays] = useState(1);
    const initialRunway = BigInt(days) * 24n * 60n * 60n;

    // provider address
    const [providerAddress, setProviderAddress] = useState<string>("");
    const provider = useValidatorNodeProvider(
        providerAddress && isAddress(providerAddress)
            ? providerAddress
            : undefined,
        initialRunway,
    );

    // payment approval transaction
    const { data: allowance } = useErc20Allowance({
        address: provider?.token.address,
        args: [
            address!,
            isAddress(providerAddress) ? getAddress(providerAddress) : "0x",
        ],
        enabled: !!address && isAddress(providerAddress) && !!provider,
    });
    const prepareApprove = usePrepareErc20Approve({
        address: provider?.token.address,
        args: [
            isAddress(providerAddress) ? getAddress(providerAddress) : "0x",
            provider?.price!,
        ],
        enabled:
            isAddress(providerAddress) &&
            provider?.price != undefined &&
            allowance != undefined &&
            allowance < provider.price,
    });
    const executeApprove = useErc20Approve(prepareApprove.config);
    const waitApprove = useWaitForTransaction(executeApprove.data);

    // TODO: field for owner?
    const owner = address;

    // deploy transaction
    const prepare = usePrepareValidatorNodeProviderDeploy({
        address: isAddress(providerAddress)
            ? getAddress(providerAddress)
            : "0x",
        args: [owner || "0x", machine.hash!, location, initialRunway],
        enabled:
            isAddress(providerAddress) &&
            owner &&
            isAddress(owner) &&
            machine.hash &&
            !!location &&
            allowance != undefined &&
            provider &&
            provider.price != undefined &&
            allowance >= provider.price,
    });
    const execute = useValidatorNodeProviderDeploy(prepare.config);
    const wait = useWaitForTransaction(execute.data);

    return (
        <Stack>
            <Title order={3}>Deploy</Title>
            <MachineInstructions />
            <TextInput
                label="Cartesi Machine CID"
                value={location}
                onChange={(event) => setLocation(event.currentTarget.value)}
                error={locationError}
                description="IPFS CID of the Cartesi machine snapshot"
                required
                withAsterisk
            />

            <Stack gap={0}>
                <Group gap={2}>
                    <Text size="sm">Base Layer</Text>
                    <Text c="red">*</Text>
                </Group>
                <Text size="xs" mb={5}>
                    Select the base layer and deployer account of the
                    application chain
                </Text>
                <ConnectButton />
            </Stack>
            <TextInput
                label="Provider"
                withAsterisk
                description="Address of a validator node provider smart contract"
                value={providerAddress}
                onChange={(event) =>
                    setProviderAddress(event.currentTarget.value)
                }
            />
            <NumberInput
                label="Pre-payment period"
                description="Number of days to pre-pay for node execution"
                suffix={days > 1 ? " days" : " day"}
                withAsterisk
                allowNegative={false}
                value={days}
                onChange={(value) =>
                    setDays(typeof value == "string" ? parseInt(value) : value)
                }
            />

            <Paper shadow="md" p={20}>
                <Grid align="stretch">
                    <MachineCard machine={machine} />
                    <ProviderCard provider={provider} />
                </Grid>
            </Paper>

            <TransactionProgress
                prepare={prepareApprove}
                execute={executeApprove}
                wait={waitApprove}
            />
            <TransactionProgress
                prepare={prepare}
                execute={execute}
                wait={wait}
            />
            <Group>
                <Button onClick={executeApprove.write}>Approve payment</Button>
                {execute.write && (
                    <Button onClick={execute.write}>Deploy</Button>
                )}
            </Group>
        </Stack>
    );
};

export default Deploy;
