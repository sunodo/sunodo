import { Stack, Title } from "@mantine/core";
import type { FC } from "react";
import { useState } from "react";

import type { HostingMethod } from "./Hosting";
import Hosting from "./Hosting";
import DeploySelfHosted from "./SelfHosted/DeploySelfHosted";
import DeployThirdParty from "./ThirdParty/DeployThirdParty";

type DeployProps = {
    cid?: string;
    provider?: string;
    templateHash?: string;
};

const Deploy: FC<DeployProps> = (props) => {
    const defaultMethod = props.templateHash
        ? "self-hosted"
        : props.cid
          ? "third-party"
          : undefined;
    const [method, setMethod] = useState<HostingMethod | undefined>(
        defaultMethod,
    );

    return (
        <Stack maw={960} gap="xl" pb="xl">
            <Title order={3}>Deploy</Title>
            <Hosting method={method} onChange={setMethod} />
            {method === "self-hosted" && (
                <DeploySelfHosted templateHash={props.templateHash} />
            )}
            {method === "third-party" && (
                <DeployThirdParty
                    cid={props.cid ?? ""}
                    provider={props.provider ?? ""}
                />
            )}
        </Stack>
    );
};

export default Deploy;
