"use client";

import { CodeHighlightTabs } from "@mantine/code-highlight";
import { Button, Group, Stack } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { type FC, useState } from "react";
import type { Address, Hash } from "viem";

type NodeConfigProps = {
    applicationAddress?: Address;
    chainId?: number;
    templateHash: Hash;
};

const NodeConfig: FC<NodeConfigProps> = (props) => {
    const { chainId, applicationAddress, templateHash } = props;

    const env = {
        CARTESI_AUTH_MNEMONIC: undefined,
        CARTESI_BLOCKCHAIN_ID: chainId,
        CARTESI_BLOCKCHAIN_WS_ENDPOINT: undefined,
        CARTESI_BLOCKCHAIN_HTTP_ENDPOINT: undefined,
        CARTESI_DATABASE_CONNECTION: undefined,
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

    // TODO: use the template path from inside node environment
    const templatePath = `${templateHash}`;

    const flyToml = `app = "cartesi-rollups-node-${chainId}"

[build]
image = "cartesi/rollups-runtime:2.0.0"

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

    const registration = `
cartesi-rollups-cli app register
    --address ${applicationAddress}
    --name ${applicationAddress}
    --template-path ${templatePath}
`;

    const codes = [
        { fileName: "node.env", code: dotenv, language: "shell" },
        { fileName: "fly.toml", code: flyToml, language: "toml" },
        { fileName: "register.sh", code: registration, language: "shell" },
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
