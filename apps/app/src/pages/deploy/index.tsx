import { FC, useState } from "react";
import { List, Stack, Stepper, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import Network from "../../components/deploy/network";
import MachineLocation from "../../components/deploy/machine";
import ConsensusConfig from "../../components/deploy/consensus";
import Financial from "../../components/deploy/financial";

const Deploy: FC = () => {
    const [active, setActive] = useState(0);
    const router = useRouter();
    const cid = router.query.cid as string;

    const [owner, setOwner] = useState("");

    return (
        <Layout>
            <Stack spacing={20}>
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
                        A <code>CartesiDApp</code> smart contract deployed to an
                        EVM network;
                    </List.Item>
                </List>

                <Text>Follow the steps below:</Text>

                <Stepper
                    active={active}
                    onStepClick={setActive}
                    breakpoint="sm"
                >
                    <Stepper.Step
                        label="Cartesi machine"
                        description="Location of cartesi machine snapshot"
                    >
                        <MachineLocation
                            cid={cid}
                            onNext={(protocol, cid) => setActive(active + 1)}
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
                            onNext={() => setActive(active + 1)}
                        />
                    </Stepper.Step>
                    <Stepper.Step
                        label="Validator rewards"
                        description="Cartesi nodes financial incentive mechanism"
                    >
                        <Financial />
                    </Stepper.Step>
                    <Stepper.Step
                        label="Review and deploy"
                        description="Review configuration and deploy to the blockchain"
                    ></Stepper.Step>
                </Stepper>
            </Stack>
        </Layout>
    );
};

export default Deploy;
