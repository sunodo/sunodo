import {
    Collapse,
    Group,
    NumberInput,
    Stack,
    Text,
    TextInput,
    Timeline,
    Title,
} from "@mantine/core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import * as isIPFS from "is-ipfs";
import { FC, useMemo } from "react";
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

    const active = useMemo(() => {
        if (!machine.hash) return 0;
        if (!provider) return 1;
        if (canDeploy) return 2;
        return 0;
    }, [machine.hash, provider, canDeploy]);

    return (
        <Stack maw={960} mx={"auto"} gap={"xl"} pb="xl">
            <Title order={3}>Deploy</Title>

            <MachineInstructions />

            <Timeline active={active} bulletSize={18} lineWidth={2}>
                <Timeline.Item title="Cartesi Machine CID" pl={"lg"} pb={"lg"}>
                    <Stack gap={"xl"} pt={"xl"}>
                        <Stack gap={0}>
                            <Group gap={2} pb={"xs"}>
                                <Title order={5}>
                                    IPFS CID of the Cartesi machine snapshot
                                </Title>
                                <Text c="red">*</Text>
                            </Group>

                            <TextInput
                                {...form.getInputProps("location")}
                                required
                                size="md"
                            />
                        </Stack>

                        <Collapse in={!!machine.hash}>
                            <MachineCard machine={machine} />
                        </Collapse>
                    </Stack>
                </Timeline.Item>

                <Timeline.Item
                    title="Base Layer & Node provider"
                    pl={"lg"}
                    pb={"lg"}
                >
                    <Stack gap={"xl"} pt={"xl"}>
                        <Stack gap={0}>
                            <Group gap={2} pb={"xs"}>
                                <Title order={5}>
                                    Select the base layer and deployer account
                                    of the application chain
                                </Title>
                                <Text c="red">*</Text>
                            </Group>

                            <ConnectButton />
                        </Stack>

                        <Stack gap={0}>
                            <Title order={5}>
                                <Group gap={2}>
                                    <Title order={5}>Provider</Title>
                                    <Text c="red">*</Text>
                                </Group>
                            </Title>
                            <Text size="sm" mb={5}>
                                Address of a validator node provider smart
                                contract
                            </Text>
                            <TextInput
                                size="md"
                                {...form.getInputProps("providerAddress")}
                            />
                        </Stack>

                        <Collapse in={!!provider}>
                            <ProviderCard provider={provider} />
                        </Collapse>

                        <Stack gap={0}>
                            <Group gap={2}>
                                <Title order={5}>Pre-payment period</Title>
                                <Text c="red">*</Text>
                            </Group>
                            <Text size="sm" mb={5}>
                                Number of days to pre-pay for node execution
                            </Text>
                            <NumberInput
                                {...form.getInputProps("days")}
                                suffix={days > 1 ? " days" : " day"}
                                allowNegative={false}
                                size="md"
                                w={"160"}
                            />
                        </Stack>
                        {approvalNeeded && (
                            <Approval
                                allowance={allowance}
                                amount={provider?.price}
                                approving={
                                    execute.isPending || receipt.isRefetching
                                }
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
                    </Stack>
                </Timeline.Item>

                <Timeline.Item title="Deploy" pl={"lg"} pb={"lg"}>
                    <Stack gap={"xl"} pt={"xl"}>
                        {canDeploy && (
                            <DeployTransaction
                                disabled={!simulateDeploy.data?.request}
                                error={executeDeploy.error?.message}
                                loading={executeDeploy.isPending}
                                onDeploy={() =>
                                    simulateDeploy.data &&
                                    executeDeploy.writeContract(
                                        simulateDeploy.data.request,
                                    )
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
                </Timeline.Item>
            </Timeline>
        </Stack>
    );
};

export default Deploy;
