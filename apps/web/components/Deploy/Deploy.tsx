import { Stack, Title } from "@mantine/core";
import type { FC } from "react";
import { useState } from "react";

import DeployV1 from "./DeployV1";
import DeployV2 from "./DeployV2";
import RollupsVersionSelector from "./RollupsVersionSelector";

type DeployProps = {
    cid?: string;
    provider?: string;
    templateHash?: string;
    version?: "v1" | "v2";
};

const Deploy: FC<DeployProps> = (props) => {
    const [version, setVersion] = useState<"v1" | "v2" | undefined>(
        props.version,
    );

    return (
        <Stack maw={960} gap="xl" pb="xl">
            <Title order={3}>Deploy</Title>
            <RollupsVersionSelector value={version} onChange={setVersion} />
            {version === "v1" && <DeployV1 {...props} />}
            {version === "v2" && <DeployV2 {...props} />}
        </Stack>
    );
};

export default Deploy;
