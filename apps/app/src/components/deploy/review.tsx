import { Alert, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { FC } from "react";
import { Address } from "abitype";
import { Hash } from "viem";
import { useWaitForTransaction } from "wagmi";
import {
    useControlledDAppFactoryNewApplication,
    usePrepareControlledDAppFactoryNewApplication,
} from "../../contracts";

export type ReviewProps = {
    onBack?: () => void;
    authority: Address;
    owner: Address;
    hash: Hash;
    cid: string;
};

const Review: FC<ReviewProps> = (props) => {
    const { config, error } = usePrepareControlledDAppFactoryNewApplication({
        args: [props.authority, props.owner, props.hash, props.cid],
    });

    const { data, write } = useControlledDAppFactoryNewApplication(config);
    const { isLoading } = useWaitForTransaction(data);

    return (
        <Stack>
            <Text>Review the deployment configuration below</Text>
            <TextInput
                label="Machine template hash"
                value={props.hash}
                readOnly
            />
            <TextInput
                label="Machine IPFS location"
                value={props.cid}
                readOnly
            />
            <TextInput label="Application Owner" value={props.owner} readOnly />
            <TextInput
                label="Authority Validator"
                value={props.authority}
                readOnly
            />
            {error && (
                <Alert title={error.name} color="red">
                    {error.message}
                </Alert>
            )}
            <Group>
                <Button onClick={props.onBack}>Back</Button>
                <Button disabled={!write} onClick={write} loading={isLoading}>
                    Deploy
                </Button>
            </Group>
        </Stack>
    );
};

export default Review;
