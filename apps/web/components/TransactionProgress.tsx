"use client";
import {
    Center,
    Code,
    Collapse,
    Group,
    Progress,
    Stack,
    Text,
    useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
    IconCheck,
    IconChevronDown,
    IconChevronUp,
    IconExclamationCircle,
} from "@tabler/icons-react";
import { FC } from "react";
import { BaseError } from "viem";

export type TransactionStageStatus = {
    status: "error" | "loading" | "success" | "idle";
    error: Error | null;
};

export type TransactionProgressProps = {
    prepare: TransactionStageStatus;
    execute: TransactionStageStatus;
    wait: TransactionStageStatus;
    confirmationMessage?: string;
    defaultErrorMessage?: string;
};

const getShortErrorMessage = (error: Error | null): string | undefined => {
    if (error != null) {
        if (error instanceof BaseError) {
            return error.shortMessage;
        }
        if (error.cause instanceof BaseError) {
            return error.cause.shortMessage;
        }
        const be = error as BaseError;
        return be.shortMessage;
    }
    return undefined;
};

const getErrorMessage = (error: Error | null): string | undefined => {
    if (error != null) {
        return error.message;
    }
    return undefined;
};

export const TransactionProgress: FC<TransactionProgressProps> = ({
    prepare,
    execute,
    wait,
    confirmationMessage,
    defaultErrorMessage,
}) => {
    const theme = useMantineTheme();
    const successColor = theme.colors.teal[5];
    const errorColor = theme.colors.red[5];

    // customizable confirmation message
    confirmationMessage = confirmationMessage || "Transaction confirmed";

    // customizable default error message
    defaultErrorMessage = defaultErrorMessage || "Transaction failed";

    const [showError, { toggle: toggleError }] = useDisclosure(false);
    const isSuccess = wait.status == "success";
    const isError = !!prepare.error || !!execute.error || !!wait.error;
    const isMining = wait.status == "loading";
    const shortErrorMessage =
        getShortErrorMessage(prepare.error) ||
        getShortErrorMessage(execute.error) ||
        getShortErrorMessage(wait.error);
    const errorMessage =
        getErrorMessage(prepare.error) ||
        getErrorMessage(execute.error) ||
        getErrorMessage(wait.error);
    const isLoading = execute.status == "loading";

    return (
        <Stack gap={5}>
            <Center>
                {isLoading && <Text size="xs">Check wallet...</Text>}
                {isMining && <Text size="xs">Waiting for confirmation...</Text>}
                {isSuccess && (
                    <Group gap={5}>
                        <IconCheck color={successColor} />
                        <Text size="xs" c={successColor}>
                            {confirmationMessage}
                        </Text>
                    </Group>
                )}
                {isError && (
                    <Group gap={5}>
                        <IconExclamationCircle color={errorColor} />
                        <Text size="xs" c={errorColor}>
                            {shortErrorMessage || defaultErrorMessage}
                        </Text>
                        {errorMessage &&
                            (showError ? (
                                <IconChevronUp
                                    color={errorColor}
                                    onClick={toggleError}
                                />
                            ) : (
                                <IconChevronDown
                                    color={errorColor}
                                    onClick={toggleError}
                                />
                            ))}
                    </Group>
                )}
            </Center>
            <Collapse in={showError}>
                <Code block variant="transparent" c={errorColor}>
                    {errorMessage}
                </Code>
            </Collapse>
            {(isLoading || isMining) && (
                <Progress value={100} striped animated size="sm" />
            )}
            {isSuccess && (
                <Progress value={100} size="sm" color={successColor} />
            )}
            {isError && <Progress value={100} size="sm" color={errorColor} />}
        </Stack>
    );
};
