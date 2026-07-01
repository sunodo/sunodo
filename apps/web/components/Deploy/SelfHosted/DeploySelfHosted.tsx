import {
    ActionIcon,
    Alert,
    Button,
    CopyButton,
    Group,
    Loader,
    NumberInput,
    ScrollArea,
    SegmentedControl,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Timeline,
    Title,
    Tooltip,
} from "@mantine/core";
import { type GetInputPropsReturnType, useForm } from "@mantine/form";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
    IconCheck,
    IconCopy,
    IconExclamationCircle,
    IconInfoCircle,
} from "@tabler/icons-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
    encodeFunctionData,
    getAddress,
    isAddress,
    isHash,
    zeroAddress,
    zeroHash,
} from "viem";
import { generatePrivateKey } from "viem/accounts";
import {
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
    foundry,
    mainnet,
    optimism,
    optimismSepolia,
    sepolia,
} from "viem/chains";
import { useAccount, useBytecode, useWaitForTransactionReceipt } from "wagmi";

import {
    dataAvailabilityAbi,
    inputBoxAddress,
    useReadErc20Symbol,
    useReadSelfHostedApplicationFactoryCalculateAddresses,
    useReadUsdWithdrawalOutputBuilderFactoryCalculateUsdWithdrawalOutputBuilderAddress,
    useSimulateSelfHostedApplicationFactoryDeployContracts,
    useSimulateUsdWithdrawalOutputBuilderFactoryNewUsdWithdrawalOutputBuilder,
    usdWithdrawalOutputBuilderFactoryAddress,
    useWriteSelfHostedApplicationFactoryDeployContracts,
    useWriteUsdWithdrawalOutputBuilderFactoryNewUsdWithdrawalOutputBuilder,
} from "../../../src/contracts";
import MachineInstructions from "../MachineInstructions";
import WalletInstructions from "./WalletInstructions";

// Default epoch length (in base-layer blocks) per chain, used to prefill the form.
const epochLengths: Record<number, number> = {
    [arbitrum.id]: 43200 * 7, // XXX: arbitrum doesn't have a fixed block interval
    [arbitrumSepolia.id]: 43200, // XXX: arbitrum doesn't have a fixed block interval
    [base.id]: 43200 * 7, // 7 days on a 2s block time
    [baseSepolia.id]: 43200, // 1 day on a 2s block time
    [foundry.id]: 720, // 1 hour on a 5s block time
    [mainnet.id]: 7200 * 7, // 7 days on a 12s block time
    [optimism.id]: 43200 * 7, // 7 days on a 2s block time
    [optimismSepolia.id]: 43200, // 1 day on a 2s block time
    [sepolia.id]: 7200, // 1 day on a 12s block time
};

const defaultEpochLength = (chainId?: number) =>
    (chainId && epochLengths[chainId]) || 7200;

const DEFAULT_CLAIM_STAGING_PERIOD = 0;

// The application reads its inputs from the canonical InputBox. The factory expects
// this choice ABI-encoded as a call to DataAvailability.InputBox(address).
const dataAvailability = encodeFunctionData({
    abi: dataAvailabilityAbi,
    functionName: "InputBox",
    args: [inputBoxAddress],
});

// A fixed salt is fine here: USD withdrawal output builders are stateless, so a given
// token always maps to the same builder address. This lets anyone reuse a builder that
// was already deployed for that token instead of paying to deploy a duplicate.
const USD_BUILDER_SALT = zeroHash;

const hasCode = (code?: string) => !!code && code !== "0x";

type WithdrawalOutputBuilderProps = {
    disabled: boolean;
    // input props for the manual-address field (an already-deployed builder)
    inputProps: GetInputPropsReturnType;
    // reports the resolved builder address back to the parent form
    onChange: (value: string) => void;
};

// Lets the user either point at an existing withdrawal output builder or deploy one for
// an ERC-20 token through the UsdWithdrawalOutputBuilderFactory. Either way the resolved
// builder address is fed into the parent form's `withdrawalOutputBuilder` field.
const WithdrawalOutputBuilder: FC<WithdrawalOutputBuilderProps> = ({
    disabled,
    inputProps,
    onChange,
}) => {
    const [mode, setMode] = useState<"existing" | "usd">("existing");
    const [token, setToken] = useState("");

    const tokenAddress = isAddress(token) ? getAddress(token) : undefined;

    // is the factory deployed on the connected chain? (supported testnets only)
    const factoryCode = useBytecode({
        address: usdWithdrawalOutputBuilderFactoryAddress,
    });
    const factoryAvailable = hasCode(factoryCode.data);

    // token symbol, shown as a confirmation that the address is a real ERC-20
    const symbol = useReadErc20Symbol({
        address: tokenAddress,
        query: { enabled: mode === "usd" && !!tokenAddress },
    });

    // deterministic address of the builder for this token
    const computed =
        useReadUsdWithdrawalOutputBuilderFactoryCalculateUsdWithdrawalOutputBuilderAddress(
            {
                args: tokenAddress
                    ? [tokenAddress, USD_BUILDER_SALT]
                    : undefined,
                query: {
                    enabled:
                        mode === "usd" && !!tokenAddress && factoryAvailable,
                },
            },
        );
    const builderAddress = computed.data;

    // has the builder for this token already been deployed?
    const builderCode = useBytecode({
        address: builderAddress,
        query: { enabled: !!builderAddress },
    });
    const builderExists = hasCode(builderCode.data);

    // simulate + execute the factory deployment (only when not already deployed)
    const simulate =
        useSimulateUsdWithdrawalOutputBuilderFactoryNewUsdWithdrawalOutputBuilder(
            {
                args: tokenAddress
                    ? [tokenAddress, USD_BUILDER_SALT]
                    : undefined,
                query: {
                    enabled:
                        mode === "usd" &&
                        !!tokenAddress &&
                        factoryAvailable &&
                        !!builderAddress &&
                        !builderExists,
                },
            },
        );
    const execute =
        useWriteUsdWithdrawalOutputBuilderFactoryNewUsdWithdrawalOutputBuilder();
    const receipt = useWaitForTransactionReceipt({ hash: execute.data });

    // refresh the builder bytecode once the deployment is mined
    // biome-ignore lint/correctness/useExhaustiveDependencies: only react to mined tx
    useEffect(() => {
        if (receipt.isSuccess) {
            builderCode.refetch();
        }
    }, [receipt.isSuccess]);

    // feed the resolved builder address into the parent form. Only report it once the
    // contract actually exists so the application never references a missing builder.
    // biome-ignore lint/correctness/useExhaustiveDependencies: onChange identity is stable enough
    useEffect(() => {
        if (mode === "usd") {
            onChange(builderExists && builderAddress ? builderAddress : "");
        }
    }, [mode, builderExists, builderAddress]);

    const changeMode = (value: string) => {
        // each mode manages the field itself; reset the resolved value on switch
        setMode(value as "existing" | "usd");
        onChange("");
    };

    return (
        <Stack gap="xs">
            <div>
                <Text fw={500} size="sm">
                    Withdrawal output builder
                </Text>
                <Text size="xs" c="dimmed">
                    Contract that formats withdrawal vouchers. Provide an
                    existing implementation, or deploy one for an ERC-20 token
                    using the USD withdrawal output builder factory.
                </Text>
            </div>
            <SegmentedControl
                value={mode}
                onChange={changeMode}
                disabled={disabled}
                data={[
                    { label: "Existing address", value: "existing" },
                    { label: "Deploy for ERC-20 token", value: "usd" },
                ]}
            />
            {mode === "existing" ? (
                <TextInput
                    {...inputProps}
                    placeholder={zeroAddress}
                    disabled={disabled}
                    size="md"
                />
            ) : (
                <Stack gap="xs">
                    {!factoryAvailable && (
                        <Alert
                            variant="light"
                            color="yellow"
                            icon={<IconExclamationCircle />}
                        >
                            The USD withdrawal output builder factory is not
                            available on the connected network. It is deployed
                            on supported testnets only.
                        </Alert>
                    )}
                    <TextInput
                        label="ERC-20 token address"
                        description="The USD-like ERC-20 token the builder will handle"
                        placeholder={zeroAddress}
                        value={token}
                        onChange={(event) =>
                            setToken(event.currentTarget.value)
                        }
                        error={
                            token && !tokenAddress ? "Invalid address" : null
                        }
                        disabled={disabled || !factoryAvailable}
                        size="md"
                        rightSection={
                            symbol.isLoading ? <Loader size="xs" /> : null
                        }
                    />
                    {mode === "usd" && tokenAddress && symbol.data && (
                        <Text size="xs" c="dimmed">
                            Detected token: {symbol.data}
                        </Text>
                    )}
                    {tokenAddress && factoryAvailable && (
                        <>
                            <TextInput
                                label="Builder address"
                                description={
                                    builderExists
                                        ? "This builder is already deployed and will be used."
                                        : "Deploy the builder to use this address."
                                }
                                value={builderAddress ?? ""}
                                readOnly
                                size="md"
                                ff="mono"
                            />
                            {simulate.isError && (
                                <ScrollArea>
                                    <Alert
                                        title={simulate.error?.name}
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
                                        variant="light"
                                        color="red"
                                        icon={<IconExclamationCircle />}
                                        ff="mono"
                                    >
                                        {execute.error?.message}
                                    </Alert>
                                </ScrollArea>
                            )}
                            {builderExists ? (
                                <Alert
                                    variant="light"
                                    color="green"
                                    icon={<IconInfoCircle />}
                                >
                                    Builder ready. It will be used for this
                                    application's withdrawals.
                                </Alert>
                            ) : (
                                <Group>
                                    <Button
                                        variant="light"
                                        disabled={
                                            !simulate.data?.request || disabled
                                        }
                                        loading={
                                            simulate.isLoading ||
                                            execute.isPending ||
                                            (execute.isSuccess &&
                                                receipt.isLoading)
                                        }
                                        onClick={() => {
                                            if (simulate.data) {
                                                execute.writeContract(
                                                    simulate.data.request,
                                                );
                                            }
                                        }}
                                    >
                                        Deploy builder
                                    </Button>
                                </Group>
                            )}
                        </>
                    )}
                </Stack>
            )}
        </Stack>
    );
};

type DeploySelfHostedProps = {
    authorityOwner?: string;
    templateHash?: string;
};

const DeploySelfHosted: FC<DeploySelfHostedProps> = (props) => {
    const { address, chainId } = useAccount();

    const form = useForm({
        initialValues: {
            authorityOwner: props.authorityOwner || "",
            templateHash: props.templateHash || "",
            epochLength: defaultEpochLength(chainId),
            claimStagingPeriod: DEFAULT_CLAIM_STAGING_PERIOD,
            guardian: "",
            withdrawalOutputBuilder: "",
            log2LeavesPerAccount: 0,
            log2MaxNumOfAccounts: 0,
            accountsDriveStartIndex: 0,
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
            epochLength: (value) => (value > 0 ? null : "Required"),
            guardian: (value) =>
                !value || isAddress(value) ? null : "Invalid address",
            withdrawalOutputBuilder: (value) =>
                !value || isAddress(value) ? null : "Invalid address",
        },
        validateInputOnChange: true,
        transformValues: (values) => ({
            authorityOwner:
                values.authorityOwner && isAddress(values.authorityOwner)
                    ? getAddress(values.authorityOwner)
                    : zeroAddress,
            templateHash:
                values.templateHash && isHash(values.templateHash)
                    ? values.templateHash
                    : zeroHash,
            epochLength: BigInt(values.epochLength),
            claimStagingPeriod: BigInt(values.claimStagingPeriod),
            withdrawalConfig: {
                guardian:
                    values.guardian && isAddress(values.guardian)
                        ? getAddress(values.guardian)
                        : zeroAddress,
                log2LeavesPerAccount: values.log2LeavesPerAccount,
                log2MaxNumOfAccounts: values.log2MaxNumOfAccounts,
                accountsDriveStartIndex: BigInt(values.accountsDriveStartIndex),
                withdrawalOutputBuilder:
                    values.withdrawalOutputBuilder &&
                    isAddress(values.withdrawalOutputBuilder)
                        ? getAddress(values.withdrawalOutputBuilder)
                        : zeroAddress,
            },
            salt: isHash(values.salt) ? values.salt : zeroHash,
        }),
    });
    const [deployed, setDeployed] = useState(false);
    const {
        authorityOwner,
        templateHash,
        epochLength,
        claimStagingPeriod,
        withdrawalConfig,
        salt,
    } = form.getTransformedValues();

    // resync the epoch-length default whenever the connected chain changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: only resync on chain change
    useEffect(() => {
        form.setFieldValue("epochLength", defaultEpochLength(chainId));
    }, [chainId]);

    // assume application owner is connected account (user can transfer ownership afterwards)
    const applicationOwner = address;

    // flag to enable/disable deployment based on all required fields being filled
    const enabled =
        authorityOwner !== zeroAddress &&
        !!applicationOwner &&
        templateHash !== zeroHash &&
        epochLength > 0n &&
        !deployed;

    // deploy arguments shared by calculate/simulate/write
    const args = [
        authorityOwner,
        epochLength,
        claimStagingPeriod,
        applicationOwner ?? zeroAddress,
        templateHash,
        dataAvailability,
        withdrawalConfig,
        salt,
    ] as const;

    // calculate addresses using determinisitic deployment
    const { data } = useReadSelfHostedApplicationFactoryCalculateAddresses({
        args,
        query: { enabled },
    });
    const [applicationAddress] = data || [];

    // simulate deploy transaction
    const simulate = useSimulateSelfHostedApplicationFactoryDeployContracts({
        args,
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
            <Timeline.Item title="Consensus parameters" pb="lg">
                <Stack gap="md" pt="xl">
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <NumberInput
                            {...form.getInputProps("epochLength")}
                            label="Epoch length"
                            description="Number of base-layer blocks per epoch"
                            min={1}
                            allowDecimal={false}
                            disabled={deployed}
                            size="md"
                        />
                        <NumberInput
                            {...form.getInputProps("claimStagingPeriod")}
                            label="Claim staging period"
                            description="Number of base-layer blocks before a claim can be accepted"
                            min={0}
                            allowDecimal={false}
                            disabled={deployed}
                            size="md"
                        />
                    </SimpleGrid>
                </Stack>
            </Timeline.Item>
            <Timeline.Item title="Withdrawal configuration" pb="lg">
                <Stack gap="md" pt="xl">
                    <Text size="sm" c="dimmed">
                        Advanced settings for output validation and asset
                        withdrawals. Leave blank to disable.
                    </Text>
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <TextInput
                            {...form.getInputProps("guardian")}
                            label="Guardian"
                            placeholder={zeroAddress}
                            disabled={deployed}
                            size="md"
                        />
                        <NumberInput
                            {...form.getInputProps("log2LeavesPerAccount")}
                            label="log2 leaves per account"
                            min={0}
                            max={255}
                            allowDecimal={false}
                            disabled={deployed}
                            size="md"
                        />
                        <NumberInput
                            {...form.getInputProps("log2MaxNumOfAccounts")}
                            label="log2 max number of accounts"
                            min={0}
                            max={255}
                            allowDecimal={false}
                            disabled={deployed}
                            size="md"
                        />
                        <NumberInput
                            {...form.getInputProps("accountsDriveStartIndex")}
                            label="Accounts drive start index"
                            min={0}
                            allowDecimal={false}
                            disabled={deployed}
                            size="md"
                        />
                    </SimpleGrid>
                    <WithdrawalOutputBuilder
                        disabled={deployed}
                        inputProps={form.getInputProps(
                            "withdrawalOutputBuilder",
                        )}
                        onChange={(value) =>
                            form.setFieldValue("withdrawalOutputBuilder", value)
                        }
                    />
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
                            onClick={() => {
                                if (simulate.data) {
                                    execute.writeContract(
                                        simulate.data.request,
                                    );
                                }
                            }}
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
                                Your application has been deployed. Use the
                                application address below to register it with a
                                Cartesi node.
                            </Alert>
                            <TextInput
                                label="Application address"
                                value={applicationAddress ?? ""}
                                readOnly
                                size="md"
                                ff="mono"
                                rightSection={
                                    <CopyButton
                                        value={applicationAddress ?? ""}
                                    >
                                        {({ copied, copy }) => (
                                            <Tooltip
                                                label={
                                                    copied ? "Copied" : "Copy"
                                                }
                                                withArrow
                                            >
                                                <ActionIcon
                                                    color={
                                                        copied ? "teal" : "gray"
                                                    }
                                                    variant="subtle"
                                                    onClick={copy}
                                                >
                                                    {copied ? (
                                                        <IconCheck size={16} />
                                                    ) : (
                                                        <IconCopy size={16} />
                                                    )}
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </CopyButton>
                                }
                            />
                        </Stack>
                    )}
                </Stack>
            </Timeline.Item>
        </Timeline>
    );
};

export default DeploySelfHosted;
