import { FC, useState } from "react";
import {
    Button,
    Collapse,
    Group,
    Radio,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import { Address } from "abitype";
import { isAddress } from "viem";

export type ConsensusType =
    | "authority"
    | "multisig"
    | "quorum"
    | "unpermissioned";

export type ConsensusConfigProps = {
    owner?: string;
    onBack?: () => void;
    onNext?: (owner: Address, authority: Address) => void;
};

const ConsensusConfig: FC<ConsensusConfigProps> = (props) => {
    const [consensusType, setConsensusType] =
        useState<ConsensusType>("authority");

    const [owner, setOwner] = useState<string>(props.owner ?? "");
    const [authority, setAuthority] = useState<string>("");

    const canProceed =
        owner && isAddress(owner) && authority && isAddress(authority);

    return (
        <Stack>
            <TextInput
                label="Application Owner"
                id="owner"
                description="The application owner has the power to change the consensus at any time."
                required
                value={owner}
                onChange={(e) => setOwner(e.currentTarget.value)}
                error={
                    owner ? !isAddress(owner) && "Invalid address" : undefined
                }
            />
            <Radio.Group
                value={consensusType}
                label="Consensus Type"
                required
                onChange={(e) => setConsensusType(e as ConsensusType)}
            >
                <Radio
                    value="authority"
                    label="Authority"
                    m={10}
                    description={
                        <Text>
                            An Authority has the power to submit any claims of
                            the state of the machine, and cannot be challenged
                        </Text>
                    }
                />
                <Collapse in={consensusType === "authority"}>
                    <TextInput
                        ml={40}
                        label="Contract Address"
                        required
                        value={authority}
                        onChange={(e) => setAuthority(e.currentTarget.value)}
                        error={
                            authority
                                ? !isAddress(authority) && "Invalid address"
                                : undefined
                        }
                        description={
                            <Text>
                                The address of an{" "}
                                <a href="https://docs.cartesi.io">Authority</a>{" "}
                                contract deployed to the blockchain
                            </Text>
                        }
                    />
                </Collapse>
                <Radio
                    value="multisig"
                    label="Multisig (not yet available)"
                    description={
                        <Text>
                            The multisig is still an Authority validator, where
                            a set of validators who are part of a{" "}
                            <a href="https://safe.global">Safe</a> multisig must
                            agree on the state of the machine. If there is no
                            agreement the application will be no longer
                            validated, there is still no consensus protocol.
                        </Text>
                    }
                    disabled
                    m={10}
                />
                <Radio
                    value="quorum"
                    label="Quorum (not yet available)"
                    disabled
                    description={
                        <Text>
                            The application is validated by a quorum of
                            validators, who must agree on the state of the
                            machine. If there is any disagreement a challenge is
                            initiated and the verification protocol is
                            initiated.
                        </Text>
                    }
                    m={10}
                />
                <Radio
                    value="unpermissioned"
                    label="Unpermissioned (not yet available)"
                    disabled
                    description={
                        <Text>
                            The application can be validated by any party in an
                            unpermissioned way. If there is any disagreement a
                            challenge is initiated and the verification protocol
                            is initiated.
                        </Text>
                    }
                    m={10}
                />
            </Radio.Group>
            <Group>
                <Button onClick={props.onBack}>Back</Button>
                <Button
                    disabled={!canProceed}
                    onClick={() =>
                        props.onNext &&
                        props.onNext(owner as Address, authority as Address)
                    }
                >
                    Next
                </Button>
            </Group>
        </Stack>
    );
};

export default ConsensusConfig;
