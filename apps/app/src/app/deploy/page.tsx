"use client";
import { FC, useState } from "react";
import { List, Stack, Stepper, Text, Title } from "@mantine/core";
import { Address } from "abitype";
import { Hash, isHash } from "viem";
import { useSearchParams } from "next/navigation";

import Network from "../../components/deploy/network";
import MachineLocation from "../../components/deploy/machine";
import ConsensusConfig from "../../components/deploy/consensus";
import Financial from "../../components/deploy/financial";
import Review from "../../components/deploy/review";

const Deploy: FC = () => {
    const [active, setActive] = useState(0);
    const searchParams = useSearchParams();

    const [authority, setAuthority] = useState<Address | undefined>();
    const [owner, setOwner] = useState<Address | undefined>();
    const hashParam = isHash(searchParams.get("hash") as string)
        ? (searchParams.get("hash") as string as Hash)
        : undefined;
    const [hash, setHash] = useState<Hash | undefined>(hashParam);
    const [cid, setCid] = useState<string>(searchParams.get("cid") as string);

    return (
        <Stack>
            <Title>Deploy</Title>
            <Text>
                We will guide you through the process of deploying a Cartesi
                application. An application is composed of two parts:
            </Text>

            <List>
                <List.Item>
                    A Cartesi machine snapshot, ready to receive inputs;
                </List.Item>
                <List.Item>
                    A <code>CartesiDApp</code> smart contract deployed to an EVM
                    network;
                </List.Item>
            </List>

            <Text>Follow the steps below:</Text>

            <Stepper active={active} onStepClick={setActive}>
                <Stepper.Step
                    label="Cartesi machine"
                    description="Location of cartesi machine snapshot"
                >
                    <MachineLocation
                        hash={hash}
                        cid={cid}
                        onNext={(hash, protocol, cid) => {
                            setCid(cid);
                            setHash(hash);
                            setActive(active + 1);
                        }}
                    />
                </Stepper.Step>
                <Stepper.Step
                    label="Network"
                    description="EVM network selection"
                >
                    <Network
                        onBack={() => setActive(active - 1)}
                        onNext={(chainId, address) => {
                            setOwner(address);
                            setActive(active + 1);
                        }}
                    />
                </Stepper.Step>
                <Stepper.Step
                    label="Consensus"
                    description="Application consensus configuration"
                >
                    <ConsensusConfig
                        owner={owner}
                        onBack={() => setActive(active - 1)}
                        onNext={(owner, authority) => {
                            setOwner(owner);
                            setAuthority(authority);
                            setActive(active + 1);
                        }}
                    />
                </Stepper.Step>
                <Stepper.Step
                    label="Validator rewards"
                    description="Cartesi nodes financial incentive mechanism"
                >
                    <Financial
                        onBack={() => setActive(active - 1)}
                        onNext={() => setActive(active + 1)}
                    />
                </Stepper.Step>
                <Stepper.Step
                    label="Review and deploy"
                    description="Review configuration and deploy to the blockchain"
                >
                    {authority && owner && hash && cid && (
                        <Review
                            onBack={() => setActive(active - 1)}
                            authority={authority}
                            owner={owner}
                            hash={hash}
                            cid={cid}
                        />
                    )}
                </Stepper.Step>
            </Stepper>
        </Stack>
    );
};

export default Deploy;
