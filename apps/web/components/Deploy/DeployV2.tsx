import { Stack } from "@mantine/core";
import type { FC } from "react";
import { useState } from "react";

import type { HostingMethod } from "./Hosting";
import Hosting from "./Hosting";
import DeploySelfHostedV2 from "./SelfHosted/DeploySelfHostedV2";
import DeployThirdParty from "./ThirdParty/DeployThirdParty";

type DeployV2Props = {
    cid?: string;
    provider?: string;
    templateHash?: string;
};

const DeployV2: FC<DeployV2Props> = (props) => {
    const defaultMethod = props.templateHash
        ? "self-hosted"
        : props.cid
          ? "third-party"
          : undefined;
    const [method, setMethod] = useState<HostingMethod | undefined>(
        defaultMethod,
    );

    return (
        <Stack>
            <Hosting method={method} onChange={setMethod} />
            {method === "self-hosted" && (
                <DeploySelfHostedV2 templateHash={props.templateHash} />
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

export default DeployV2;
