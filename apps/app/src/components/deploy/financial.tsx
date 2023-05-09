import { FC, forwardRef, useState } from "react";
import {
    Avatar,
    Button,
    Collapse,
    Group,
    NumberInput,
    Radio,
    Select,
    Stack,
    Text,
} from "@mantine/core";

export type FinancialIncentiveType = "controlled" | "erc20";
export type Token = {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    icon?: string;
};

type ItemProps = React.ComponentPropsWithoutRef<"div"> & Token;

export type FinancialProps = {
    onBack?: () => void;
    onNext?: () => void;
};

const Financial: FC<FinancialProps> = (props) => {
    const [type, setType] = useState<FinancialIncentiveType>();
    const [salary, setSalary] = useState<string | number>(1);
    const [deposit, setDeposit] = useState<string | number>(1);
    const tokens: Token[] = [
        {
            address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
            symbol: "USDC",
            name: "USD Coin",
            decimals: 18,
            icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
        },
        {
            address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
            symbol: "USDT",
            name: "Tether",
            decimals: 18,
            icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
        },
        {
            address: "0x6d662f2322Bb460F8FC41666CB374eCB127E3913",
            symbol: "SUND",
            name: "Sunodo",
            decimals: 18,
        },
        {
            address: "0x491604c0fdf08347dd1fa4ee062a822a5dd06b5d",
            symbol: "CTSI",
            name: "Cartesi",
            decimals: 18,
            icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5444.png",
        },
        {
            address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            symbol: "WETH",
            name: "WETH",
            decimals: 18,
            icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png",
        },
        {
            address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
            symbol: "WBTC",
            name: "Wrapped Bitcoin",
            decimals: 18,
            icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
        },
    ];
    const tokenItems = tokens.map((token) => ({
        label: `${token.name} (${token.symbol})`,
        value: token.address,
        ...token,
    }));

    const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
        function TokenSelect(
            { icon, name, symbol, address, ...others }: ItemProps,
            ref,
        ) {
            return (
                <div ref={ref} {...others}>
                    <Group>
                        <Avatar src={icon} size="sm">
                            {symbol}
                        </Avatar>
                        <div>
                            <Text size="sm">
                                {name} ({symbol})
                            </Text>
                            <Text size="xs" opacity={0.65}>
                                {address}
                            </Text>
                        </div>
                    </Group>
                </div>
            );
        },
    );

    const canProceed =
        type === "controlled" || (type === "erc20" && salary && deposit);

    return (
        <Stack>
            <Radio.Group
                name="financial"
                value={type}
                onChange={(e) => setType(e as FinancialIncentiveType)}
                label="Reward mechanism"
                description={
                    <Text>
                        Cartesi nodes must be incentivized somehow to execute.
                        This incentive can happen outside of the blockchain, or
                        through smart contracts designed to reward through the
                        blockchain.
                    </Text>
                }
            >
                <Radio
                    value="controlled"
                    label="No onchain financial incentives"
                    m={10}
                    description={
                        <Text>
                            The Cartesi node execution will be controlled by a
                            smart contract owned by the chosen Consensus. Select
                            this option if you plan to run your own node.
                        </Text>
                    }
                />
                <Radio
                    value="erc20"
                    label="Financial incentive through ERC-20 tokens"
                    m={10}
                    description={
                        <Text>
                            The Cartesi node execution will be payed through the
                            deposit of ERC-20 tokens.
                        </Text>
                    }
                />
                <Collapse in={type === "erc20"}>
                    <Stack>
                        <Select
                            label="ERC-20 Token"
                            placeholder="Select Token"
                            required={type === "erc20"}
                            data={tokenItems}
                            // itemComponent={SelectItem}
                            searchable
                            ml={40}
                        />
                        <NumberInput
                            label="Salary"
                            required={type === "erc20"}
                            description={
                                <Text>
                                    Amount of tokens per week you are willing to
                                    pay for the validator. If the salary is
                                    below the value required by the validator to
                                    execute other parties must contribute to the
                                    salary.
                                </Text>
                            }
                            value={salary}
                            onChange={setSalary}
                            min={0}
                            ml={40}
                        />
                        <NumberInput
                            label="Deposit"
                            required={type === "erc20"}
                            description={
                                <Text>
                                    Initial amount of tokens deposited to the
                                    validator.
                                </Text>
                            }
                            value={deposit}
                            onChange={setDeposit}
                            min={0}
                            ml={40}
                        />
                    </Stack>
                </Collapse>
            </Radio.Group>
            <Group>
                <Button onClick={props.onBack}>Back</Button>
                <Button disabled={!canProceed} onClick={props.onNext}>
                    Next
                </Button>
            </Group>
        </Stack>
    );
};

export default Financial;
