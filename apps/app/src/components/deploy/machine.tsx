import { FC, useState } from "react";
import { Button, Group, Radio, Stack, Text, TextInput } from "@mantine/core";
import { Hash, isHash } from "viem";
import * as isIPFS from "is-ipfs";

export type MachineLocationProtocol = "ipfs" | "url" | "private";

export type MachineLocationProps = {
    hash?: Hash;
    cid: string;
    onNext?: (
        hash: Hash,
        protocol: MachineLocationProtocol,
        value: string
    ) => void;
};

const MachineLocation: FC<MachineLocationProps> = (props) => {
    const [hash, setHash] = useState<string>(props.hash ?? "");
    const [method, setMethod] = useState<MachineLocationProtocol>("ipfs");
    const [cid, setCid] = useState(props.cid);
    const error = cid && !isIPFS.cid(cid) && "Invalid CID";
    const hashError = hash ? !isHash(hash) && "Invalid hash" : undefined;
    return (
        <Stack>
            <Text>
                A Cartesi machine snapshot is a stored state of a Cartesi
                machine, with Linux already booted and the application started,
                ready to receive inputs from the blockchain through a Cartesi
                node. It is tipically built using a build system like the ones
                documented in the{" "}
                <a href="https://github.com/cartesi/rollups-examples">
                    Cartesi Rollups examples repository
                </a>
                , or by using <a href="https://docs.sunodo.io">sunodo build</a>.
            </Text>
            <Text>
                The Cartesi machine snapshot must be available to the Cartesi
                node that will validate the application. Select below the method
                used to make it available:
            </Text>
            <Radio.Group
                value={method}
                onChange={(e) => setMethod(e as MachineLocationProtocol)}
            >
                <Radio
                    value="ipfs"
                    m={10}
                    label={
                        <TextInput
                            label="IPFS"
                            value={cid}
                            w={420}
                            onChange={(e) => setCid(e.target.value)}
                            error={error}
                            description="IPFS CID of the Cartesi machine snapshot"
                            required={method === "ipfs"}
                            disabled={!(method === "ipfs")}
                        />
                    }
                />
                <Radio
                    value="url"
                    m={10}
                    label="Public URL (not availabe yet)"
                    disabled
                />
                <Radio
                    value="private"
                    m={10}
                    label="Privately (not availabe yet)"
                    disabled
                />
            </Radio.Group>
            <Text>
                In addition to making the machine available, the machine hash
                must be informed below:
            </Text>
            <TextInput
                value={hash}
                error={hashError}
                onChange={(event) => setHash(event.target.value)}
            />
            <Group>
                <Button
                    disabled={!isHash(hash) || !cid || !!error || !!hashError}
                    onClick={() =>
                        props.onNext &&
                        hash &&
                        props.onNext(hash as Hash, method, cid)
                    }
                >
                    Next
                </Button>
            </Group>
        </Stack>
    );
};

export default MachineLocation;
