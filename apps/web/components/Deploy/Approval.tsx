import {
    Alert,
    Button,
    Collapse,
    Group,
    ScrollArea,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";
import { FC } from "react";
import { Address, formatUnits } from "viem";
import { Token } from "../../src/hooks/token";

type ApprovalProps = {
    allowance: bigint;
    amount: bigint;
    approving: boolean;
    balance: bigint;
    ethBalance: bigint;
    error?: string;
    spender: Address;
    token: Token;
    nativeCurrency: Omit<Token, "address">;
    onApprove?: () => void;
};

export const Approval: FC<ApprovalProps> = (props) => {
    const {
        amount,
        allowance,
        approving,
        balance,
        ethBalance,
        error,
        nativeCurrency,
        spender,
        token,
    } = props;
    const { decimals, symbol } = token;

    const formatValue = (value: bigint) =>
        `${formatUnits(value, decimals)} ${symbol}`;

    const allowanceStr = formatValue(allowance);
    const amountStr = formatValue(amount);
    const balanceStr = formatValue(balance);

    const spenderStr = spender.toString();

    // XXX: should we allow to approve even if he doesn't have enough balance? because the contract allows it
    const disabled = balance < amount || ethBalance == 0n;
    const visible = allowance < amount;
    const completed = balance >= amount && allowance >= amount;

    return (
        <Collapse in={!completed}>
            <Stack gap={0}>
                <Title order={5}>Approve ERC-20 spending</Title>
                {visible && (
                    <Text size="sm">
                        You need to approve a spending of {amountStr} by{" "}
                        <Text
                            style={{
                                wordBreak: "break-all",
                            }}
                            component="span"
                        >
                            {spenderStr}
                        </Text>
                    </Text>
                )}
                <Text size="sm">
                    Your current balance is {balanceStr}. Your current allowance
                    is {allowanceStr}
                </Text>
                {ethBalance == 0n && (
                    <Text c="red">
                        You need {nativeCurrency.symbol} to submit a transaction
                    </Text>
                )}
                {balance < amount && (
                    <Text size="sm" c="red">
                        Your balance of {balanceStr} is lower than the required
                        amount of {amountStr}
                    </Text>
                )}
                {error && (
                    <ScrollArea>
                        <Alert
                            mt={10}
                            variant="light"
                            color="red"
                            icon={<IconExclamationCircle />}
                            ff="mono"
                        >
                            {error}
                        </Alert>
                    </ScrollArea>
                )}
                <Group>
                    {visible && (
                        <Button
                            mt={10}
                            size="md"
                            disabled={disabled}
                            onClick={props.onApprove}
                            loading={approving}
                        >
                            Approve
                        </Button>
                    )}
                </Group>
            </Stack>
        </Collapse>
    );
};
