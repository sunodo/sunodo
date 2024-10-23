import {
    Alert,
    Button,
    Group,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    Timeline,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IconExclamationCircle, IconInfoCircle } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { getAddress, isAddress, isHash, zeroAddress, zeroHash } from "viem";
import { generatePrivateKey } from "viem/accounts";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";

import {
    useReadSelfHostedApplicationFactoryCalculateAddresses,
    useSimulateSelfHostedApplicationFactoryDeployContracts,
    useWriteSelfHostedApplicationFactoryDeployContracts,
} from "../../../src/contracts";
import MachineInstructions from "../MachineInstructions";
import NodeConfig from "./NodeConfig";
import WalletInstructions from "./WalletInstructions";

type DeploySelfHostedProps = {
    authorityOwner?: string;
    templateHash?: string;
};

const DeploySelfHosted: FC<DeploySelfHostedProps> = (props) => {
    const { address, chainId } = useAccount();

    const form = useForm({
        initialValues: {
            authorityOwner: props.authorityOwner,
            templateHash: props.templateHash,
            epochLength: "720",
            salt: generatePrivateKey(),
        },
        validate: {
            templateHash: (value) =>
                value ? (isHash(value) ? null : "Invalid hash") : "Required",
            authorityOwner: (value) =>
                value
                    ? isAddress(value)
                        ? null
                        : "Invalid address"
                    : "Required",
            epochLength: (value) =>
                isNaN(parseInt(value)) ? "Invalid epoch length" : null,
        },
        validateInputOnChange: true,
        transformValues: ({
            authorityOwner,
            epochLength,
            templateHash,
            salt,
        }) => ({
            authorityOwner:
                authorityOwner && isAddress(authorityOwner)
                    ? getAddress(authorityOwner)
                    : zeroAddress,
            epochLength: isNaN(parseInt(epochLength))
                ? 0n
                : BigInt(epochLength),
            templateHash:
                templateHash && isHash(templateHash) ? templateHash : zeroHash,
            salt: isHash(salt) ? salt : zeroHash,
        }),
    });
    const [deployed, setDeployed] = useState(false);
    const { authorityOwner, epochLength, templateHash, salt } =
        form.getTransformedValues();

    // assume application owner is connected account (user can transfer ownership afterwards)
    const applicationOwner = address;

    // flag to enable/disable deployment based on all required fields being filled
    const enabled =
        authorityOwner !== zeroAddress &&
        !!applicationOwner &&
        templateHash !== zeroHash &&
        !deployed;

    // calculate addresses using determinisitic deployment
    const { data } = useReadSelfHostedApplicationFactoryCalculateAddresses({
        args: [
            authorityOwner,
            epochLength,
            applicationOwner!,
            templateHash,
            salt,
        ],
        query: { enabled },
    });
    const [applicationAddress, authorityAddress] = data || [];

    // simulate deploy transaction
    const simulate = useSimulateSelfHostedApplicationFactoryDeployContracts({
        args: [
            authorityOwner,
            epochLength,
            applicationOwner!,
            templateHash,
            salt,
        ],
        query: { enabled },
    });

    // executor
    const execute = useWriteSelfHostedApplicationFactoryDeployContracts();
    const receipt = useWaitForTransactionReceipt({ hash: execute.data });

    useEffect(() => {
        setDeployed(receipt.isSuccess);
    }, [receipt.isSuccess]);

    return (
        <Timeline>
            <Timeline.Item title="Cartesi Machine Hash" pl={"lg"} pb={"lg"}>
                <Stack gap="xl" pt="xl">
                    <Stack gap={0}>
                        <Group gap={2} pb={"xs"}>
                            <Title order={5}>
                                Hash of the genesis Cartesi machine
                            </Title>
                            <Text c="red">*</Text>
                        </Group>

                        <TextInput
                            {...form.getInputProps("templateHash")}
                            required
                            disabled={deployed}
                            size="md"
                        />
                    </Stack>
                    {!form.values.templateHash && <MachineInstructions />}
                </Stack>
            </Timeline.Item>
            <Timeline.Item title="Base Layer" pb="lg">
                <Stack gap="xs" pt="xl">
                    <Group gap={2}>
                        <Title order={5}>Epoch Length (in blocks)</Title>
                        <Text c="red">*</Text>
                    </Group>
                    <TextInput
                        {...form.getInputProps("epochLength")}
                        required
                        disabled={deployed}
                        size="md"
                    />
                </Stack>
                <Stack gap="xs" pt="xl">
                    <Group gap={2}>
                        <Title order={5}>
                            Select the base layer and deployer account of the
                            application chain
                        </Title>
                        <Text c="red">*</Text>
                    </Group>
                    <ConnectButton />
                </Stack>
            </Timeline.Item>
            <Timeline.Item title="Node setup" pb="lg">
                <Stack gap="xs" pt="xl">
                    <Group gap={2}>
                        <Title order={5}>Node wallet public address</Title>
                        <Text c="red">*</Text>
                    </Group>
                    <TextInput
                        {...form.getInputProps("authorityOwner")}
                        required
                        disabled={deployed}
                        size="md"
                    />
                    {authorityOwner === zeroAddress && <WalletInstructions />}
                </Stack>
            </Timeline.Item>
            <Timeline.Item title="Deploy" pb="lg">
                <Stack gap="md" pt="xl">
                    {simulate.isError && (
                        <ScrollArea>
                            <Alert
                                title={simulate.error?.name}
                                mt={10}
                                variant="light"
                                color="red"
                                icon={<IconExclamationCircle />}
                                ff="mono"
                            >
                                {simulate.error?.message}
                            </Alert>
                        </ScrollArea>
                    )}
                    {execute.isError && (
                        <ScrollArea>
                            <Alert
                                title={execute.error?.name}
                                mt={10}
                                variant="light"
                                color="red"
                                icon={<IconExclamationCircle />}
                                ff="mono"
                            >
                                {execute.error?.message}
                            </Alert>
                        </ScrollArea>
                    )}
                    <Group>
                        <Button
                            disabled={!simulate.data?.request || deployed}
                            loading={
                                simulate.isLoading ||
                                execute.isPending ||
                                (execute.isSuccess && receipt.isLoading)
                            }
                            onClick={() =>
                                execute.writeContract(simulate.data!.request)
                            }
                        >
                            Deploy
                        </Button>
                    </Group>
                    {deployed && (
                        <Stack>
                            <Alert
                                variant="light"
                                color="green"
                                title="Deploy Successful"
                                icon={<IconInfoCircle />}
                            >
                                Application deployed to {applicationAddress}.
                                Copy the configuration below to start the node
                                of your application by following the
                                instructions at the Sunodo documentation.
                            </Alert>
                            <NodeConfig
                                templateHash={templateHash}
                                applicationAddress={applicationAddress}
                                authorityAddress={authorityAddress}
                                chainId={chainId}
                            />
                        </Stack>
                    )}
                </Stack>
            </Timeline.Item>
        </Timeline>
    );
};

export default DeploySelfHosted;
