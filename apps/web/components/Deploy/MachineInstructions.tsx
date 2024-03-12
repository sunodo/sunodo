import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import Link from "next/link";
import { FC } from "react";

const MachineInstructions: FC = () => {
    return (
        <Alert variant="light" icon={<IconInfoCircle />}>
            Before launching a Cartesi dapp-chain you need to{" "}
            <Link href="https://docs.sunodo.io/guide/creating/creating-application">
                create
            </Link>
            ,{" "}
            <Link href="https://docs.sunodo.io/guide/building/building-application">
                build
            </Link>{" "}
            and{" "}
            <Link href="https://docs.sunodo.io/guide/deploying/deploying-application">
                deploy
            </Link>{" "}
            an application. If you have deployed an application to IPFS using
            `sunodo deploy` enter the information below.
        </Alert>
    );
};

export default MachineInstructions;
