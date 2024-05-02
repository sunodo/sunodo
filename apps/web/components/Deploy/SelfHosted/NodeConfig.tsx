"use client";

import arbitrumInputBox from "@cartesi/rollups/deployments/arbitrum/InputBox.json";
import arbitrumSepoliaInputBox from "@cartesi/rollups/deployments/arbitrum_sepolia/InputBox.json";
import baseInputBox from "@cartesi/rollups/deployments/base/InputBox.json";
import baseSepoliaInputBox from "@cartesi/rollups/deployments/base_sepolia/InputBox.json";
import mainnetInputBox from "@cartesi/rollups/deployments/mainnet/InputBox.json";
import optimismInputBox from "@cartesi/rollups/deployments/optimism/InputBox.json";
import optimismSepoliaInputBox from "@cartesi/rollups/deployments/optimism_sepolia/InputBox.json";
import sepoliaInputBox from "@cartesi/rollups/deployments/sepolia/InputBox.json";
import { CodeHighlightTabs } from "@mantine/code-highlight";
import { Button, Group, Stack } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { FC, useState } from "react";
import { Address, Hash } from "viem";
import {
    arbitrum,
    arbitrumSepolia,
    base,
    baseSepolia,
    foundry,
    mainnet,
    optimism,
    optimismSepolia,
    sepolia,
} from "viem/chains";

import { inputBoxAddress } from "../../../src/contracts";

const inputBoxDeploymentBlockNumber: Record<number, number> = {
    [arbitrum.id]: arbitrumInputBox.receipt.blockNumber,
    [arbitrumSepolia.id]: arbitrumSepoliaInputBox.receipt.blockNumber,
    [base.id]: baseInputBox.receipt.blockNumber,
    [baseSepolia.id]: baseSepoliaInputBox.receipt.blockNumber,
    [foundry.id]: 1, // devnet
    [mainnet.id]: mainnetInputBox.receipt.blockNumber,
    [optimism.id]: optimismInputBox.receipt.blockNumber,
    [optimismSepolia.id]: optimismSepoliaInputBox.receipt.blockNumber,
    [sepolia.id]: sepoliaInputBox.receipt.blockNumber,
};

type NodeConfigProps = {
    blockNumber?: bigint;
    chainId?: number;
    applicationAddress?: Address;
    authorityAddress?: Address;
    historyAddress?: Address;
    templateHash: Hash;
};

const NodeConfig: FC<NodeConfigProps> = (props) => {
    const {
        blockNumber,
        chainId,
        historyAddress,
        applicationAddress,
        authorityAddress,
        templateHash,
    } = props;

    // get InputBox deployment block from deployment artifact
    const inputBoxBlockNumber = chainId
        ? inputBoxDeploymentBlockNumber[chainId]
        : undefined;

    // mainnet should wait for finalized blocks
    const finality = chainId === mainnet.id ? 64 : 1;

    const env = {
        CARTESI_BLOCKCHAIN_FINALITY_OFFSET: finality,
        CARTESI_BLOCKCHAIN_ID: chainId,
        CARTESI_CONTRACTS_APPLICATION_ADDRESS: applicationAddress,
        CARTESI_CONTRACTS_AUTHORITY_ADDRESS: authorityAddress,
        CARTESI_CONTRACTS_HISTORY_ADDRESS: historyAddress,
        CARTESI_CONTRACTS_APPLICATION_DEPLOYMENT_BLOCK_NUMBER: blockNumber,
        CARTESI_CONTRACTS_INPUT_BOX_ADDRESS: inputBoxAddress,
        CARTESI_CONTRACTS_INPUT_BOX_DEPLOYMENT_BLOCK_NUMBER:
            inputBoxBlockNumber,
        CARTESI_EPOCH_DURATION: 86400,
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
            } else if (value1 === undefined && value2 === undefined) {
                return key1.localeCompare(key2);
            } else if (value1 === undefined) {
                return 1;
            } else if (value2 === undefined) {
                return -1;
            } else {
                // should not reach here
                return 0;
            }
        },
    );

    // concatenate key-value pairs into a string
    const dotenv = entries.reduce<string>(
        (str, [key, value]) =>
            str.concat(`${key}=${value !== undefined ? value : ""}\n`),
        "",
    );

    // Add YAML generation logic
    const yaml = entries.reduce<string>(
        (str, [key, value]) =>
            str.concat(
                value !== undefined ? `${key}: ${value}\n` : `${key}: \n`,
            ),
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

    const valuesYaml = `
validator:
  config:
    ${yaml}
`;

    const codes = [
        { fileName: `${templateHash}.env`, code: dotenv, language: "shell" },
        { fileName: "fly.toml", code: flyToml, language: "toml" },
        { fileName: "values.yaml", code: valuesYaml, language: "yaml" },
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
