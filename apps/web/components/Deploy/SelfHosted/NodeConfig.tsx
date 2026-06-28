"use client";

import { CodeHighlightTabs } from "@mantine/code-highlight";
import { Button, Group, Stack } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import type { FC } from "react";
import { useState } from "react";
import type { Address, Hash } from "viem";
import { mainnet } from "viem/chains";

import { inputBoxAddress } from "../../../src/contracts";

type NodeConfigProps = {
    chainId?: number;
    applicationAddress?: Address;
    authorityAddress?: Address;
    epochLength: number;
    templateHash: Hash;
};

const NodeConfig: FC<NodeConfigProps> = (props) => {
    const {
        chainId,
        applicationAddress,
        authorityAddress,
        epochLength,
        templateHash,
    } = props;

    // mainnet should wait for finalized blocks
    const finality = chainId === mainnet.id ? 64 : 1;

    // TODO: confirm the exact CARTESI_* variable names expected by the v2
    // cartesi-rollups-node. The InputBox deployment block is now derived on-chain
    // by the node via InputBox.getDeploymentBlockNumber().
    const env = {
        CARTESI_BLOCKCHAIN_FINALITY_OFFSET: finality,
        CARTESI_BLOCKCHAIN_ID: chainId,
        CARTESI_CONTRACTS_APPLICATION_ADDRESS: applicationAddress,
        CARTESI_CONTRACTS_AUTHORITY_ADDRESS: authorityAddress,
        CARTESI_CONTRACTS_INPUT_BOX_ADDRESS: inputBoxAddress,
        CARTESI_EPOCH_LENGTH: epochLength,
        CARTESI_BLOCKCHAIN_HTTP_ENDPOINT: undefined,
        CARTESI_BLOCKCHAIN_WS_ENDPOINT: undefined,
        CARTESI_AUTH_MNEMONIC: undefined,
        CARTESI_POSTGRES_ENDPOINT: undefined,
    };

    // sort keys alphabetically, putting those with undefined value at the end, for better readability
    const entries = Object.entries(env).sort(
        ([key1, value1], [key2, value2]) => {
            if (value1 !== undefined && value2 !== undefined) {
                return key1.localeCompare(key2);
            }
            if (value1 === undefined && value2 === undefined) {
                return key1.localeCompare(key2);
            }
            if (value1 === undefined) {
                return 1;
            }
            if (value2 === undefined) {
                return -1;
            }
            // should not reach here
            return 0;
        },
    );

    // concatenate key-value pairs into a string
    const dotenv = entries.reduce<string>(
        (str, [key, value]) =>
            str.concat(`${key}=${value !== undefined ? value : ""}\n`),
        "",
    );
    const toml = entries.reduce<string>(
        (str, [key, value]) =>
            str.concat(value !== undefined ? `${key} = "${value}"\n` : ""),
        "",
    );

    const [tab, setTab] = useState(0);

    const download = (str: string, filename: string) => {
        const element = document.createElement("a");
        const file = new Blob([str], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
    };

    const flyToml = `app = "<app-name>"

[build]
image = "registry.fly.io/<app-name>"

[http_service]
internal_port = 10000
force_https = true

[http_service.concurrency]
type = "requests"
soft_limit = 200
hard_limit = 250

[[http_service.checks]]
grace_period = "10s"
interval = "30s"
method = "GET"
timeout = "5s"
path = "/healthz"

[[vm]]
size = "shared-cpu-1x"
memory = "2gb"

[env]
${toml}
`;

    const codes = [
        { fileName: `${templateHash}.env`, code: dotenv, language: "shell" },
        { fileName: "fly.toml", code: flyToml, language: "toml" },
    ];
    return (
        <Stack>
            <CodeHighlightTabs
                onTabChange={setTab}
                withExpandButton
                code={codes}
            />
            <Group>
                <Button
                    rightSection={
                        <IconDownload
                            style={{ width: "70%", height: "70%" }}
                            stroke={1.5}
                        />
                    }
                    onClick={() =>
                        download(codes[tab].code, codes[tab].fileName)
                    }
                >
                    Download
                </Button>
            </Group>
        </Stack>
    );
};

export default NodeConfig;
