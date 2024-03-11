import {
    Collapse,
    Grid,
    Group,
    NumberInput,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import * as isIPFS from "is-ipfs";
import { FC } from "react";
import { getAddress, isAddress, isHash, zeroAddress } from "viem";
import { useAccount, useBalance } from "wagmi";

import { useForm } from "@mantine/form";
import { useCartesiMachine } from "../../src/hooks/cartesiMachineHash";
import { useDeployApplication } from "../../src/hooks/deploy";
import { useValidatorNodeProvider } from "../../src/hooks/provider";
import { useTokenApproval } from "../../src/hooks/token";
import { Application } from "./Application";
import { Approval } from "./Approval";
import { DeployTransaction } from "./DeployTransaction";
import MachineCard from "./MachineCard";
import MachineInstructions from "./MachineInstructions";
import ProviderCard from "./ProviderCard";

type DeployProps = {
    cid: string;
    provider: string;
};

const Deploy: FC<DeployProps> = (props) => {
    const { address, chain } = useAccount();

    const form = useForm({
        initialValues: {
            location: props.cid,
            providerAddress: props.provider,
            days: 1,
        },
        validate: {
            location: (value) => value && !isIPFS.cid(value) && "Invalid CID",
            providerAddress: (value) =>
                value && !isAddress(value) && "Invalid address",
            days: (value) => value < 0 && "Days must be a positive number",
        },
        transformValues: ({ providerAddress, location, days }) => ({
            providerAddress: isAddress(providerAddress)
                ? getAddress(providerAddress)
                : zeroAddress,
            location,
            //location: isIPFS.cid(values.location) ? values.location : undefined,
            initialRunway: BigInt(days) * 24n * 60n * 60n,
        }),
    });

    const { days } = form.values;
    const { location, providerAddress, initialRunway } =
        form.getTransformedValues();

    // load machine data from IPFS
    const machine = useCartesiMachine(location);

    // read provider object from chain
    const provider = useValidatorNodeProvider(providerAddress, initialRunway);

    // token allowance approval hook
    const { allowance, balance, execute, simulate, receipt } = useTokenApproval(
        {
            address: provider?.token.address,
            owner: address,
            spender: isAddress(providerAddress)
                ? getAddress(providerAddress)
                : undefined,
            amount: provider?.price,
        },
    );

    // application deployment hook
    const {
        applicationAddress,
        simulate: simulateDeploy,
        execute: executeDeploy,
    } = useDeployApplication({
        allowance,
        amount: provider?.price,
        balance: balance?.value,
        initialRunway: initialRunway,
        location: location,
        machineHash: machine?.hash,
        owner: address,
        providerAddress: provider?.address,
    });

    // get native currency from active chain
    const nativeCurrency = chain?.nativeCurrency;

    const { data: ethBalance } = useBalance({ address });

    const approvalNeeded =
        allowance !== undefined &&
        balance !== undefined &&
        provider?.price !== undefined &&
        ethBalance !== undefined &&
        nativeCurrency !== undefined;

    const canDeploy =
        machine.hash !== undefined &&
        isHash(machine.hash) &&
        provider !== undefined &&
        address !== undefined;

    return (
        <Stack>
            <Title order={3}>Deploy</Title>
            <MachineInstructions />
            <TextInput
                {...form.getInputProps("location")}
                label="Cartesi Machine CID"
                description="IPFS CID of the Cartesi machine snapshot"
                required
                withAsterisk
            />
            <Collapse in={!!machine.hash}>
                <Grid>
                    <MachineCard machine={machine} />
                </Grid>
            </Collapse>

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
                {...form.getInputProps("providerAddress")}
                label="Provider"
                withAsterisk
                description="Address of a validator node provider smart contract"
            />
            <Collapse in={!!provider}>
                <Grid>
                    <ProviderCard provider={provider} />
                </Grid>
            </Collapse>

            <NumberInput
                {...form.getInputProps("days")}
                label="Pre-payment period"
                description="Number of days to pre-pay for node execution"
                suffix={days > 1 ? " days" : " day"}
                withAsterisk
                allowNegative={false}
            />

            {approvalNeeded && (
                <Approval
                    allowance={allowance}
                    amount={provider?.price}
                    approving={execute.isPending || receipt.isRefetching}
                    balance={balance.value}
                    ethBalance={ethBalance?.value}
                    nativeCurrency={nativeCurrency}
                    spender={provider?.address}
                    token={provider?.token}
                    error={execute.error?.message}
                    onApprove={() =>
                        simulate.data &&
                        execute.writeContract(simulate.data.request)
                    }
                />
            )}

            {canDeploy && (
                <DeployTransaction
                    disabled={!simulateDeploy.data?.request}
                    error={executeDeploy.error?.message}
                    loading={executeDeploy.isPending}
                    onDeploy={() =>
                        simulateDeploy.data &&
                        executeDeploy.writeContract(simulateDeploy.data.request)
                    }
                />
            )}
            {applicationAddress && provider && (
                <Application
                    applicationAddress={applicationAddress}
                    provider={provider}
                />
            )}
        </Stack>
    );
};

export default Deploy;
