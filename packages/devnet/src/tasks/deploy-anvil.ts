import { spawn } from "child_process";
import fs from "fs";
import { ContractExport, Export } from "hardhat-deploy/dist/types";
import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import path from "path";
import { Address } from "viem";

export interface DeployOptions {
    dumpFile: string;
    exportFile?: string;
    silent: boolean;
}

/**
 * Utility function to export contracts address and ABI to a (potentially existing) json file.
 */
export const exportContracts = async (
    name: string,
    chainId: number,
    filename: string,
    contracts: { [name: string]: ContractExport },
) => {
    if (fs.existsSync(filename)) {
        // load file, add contracts, and write back
        const str = fs.readFileSync(filename, "utf-8");
        const existingExport = JSON.parse(str) as Export;

        // validate if we are talking about the same chainId
        if (existingExport.chainId !== chainId.toString()) {
            throw new Error(
                `Export file ${filename} is from a different chainId: ${existingExport.chainId}`,
            );
        }

        // import the contracts from the file, throwing if there is any conflict
        Object.entries(existingExport.contracts).forEach(([name, contract]) => {
            if (contracts[name]) {
                throw new Error(`Conflicting contract ${name}`);
            }
            contracts[name] = contract;
        });
    }

    // create file
    fs.writeFileSync(
        filename,
        JSON.stringify({ name, chainId, contracts }, null, 4),
    );
};

const deploy = async (
    taskArgs: DeployOptions,
    hre: HardhatRuntimeEnvironment,
) => {
    const { deployments, network, run, viem } = hre;
    const { dumpFile, silent } = taskArgs;
    const exportFile = taskArgs.exportFile ?? `export/abi/${network.name}.json`;

    // make sure directories exist
    fs.mkdirSync(path.dirname(dumpFile), { recursive: true });
    fs.mkdirSync(path.dirname(exportFile), { recursive: true });

    // run anvil
    const anvil = spawn("anvil", ["--dump-state", dumpFile], {
        stdio: silent ? "pipe" : "inherit",
    });

    try {
        // run deployment
        console.log(`deploying to anvil and dumping state to ${dumpFile}`);
        await run("deploy", {
            export: exportFile,
            reset: true,
            silent,
        });

        // get deployed contracts (by project "contracts" and "token")
        const { AuthorityHistoryPairFactory, Marketplace, SunodoToken } =
            await deployments.all();

        // deploy Devnet, which deploys authority, history and provider
        const contract = await viem.deployContract("Devnet", [
            AuthorityHistoryPairFactory.address as Address,
            Marketplace.address as Address,
            SunodoToken.address as Address,
        ]);
        const authority = await contract.read.authority();
        const provider = await contract.read.provider();
        const history = await contract.read.history();

        // get chain id from provider
        const publicClient = await viem.getPublicClient();
        const chainId = await publicClient.getChainId();

        // write additional contracts to deployment file
        const Authority = await hre.artifacts.readArtifact("Authority");
        const History = await hre.artifacts.readArtifact("History");
        const ValidatorNodeProvider = await hre.artifacts.readArtifact(
            "IValidatorNodeProvider",
        );
        exportContracts(network.name, chainId, exportFile, {
            DevnetAuthority: { abi: Authority.abi, address: authority },
            DevnetHistory: { abi: History.abi, address: history },
            DevnetValidatorNodeProvider: {
                abi: ValidatorNodeProvider.abi,
                address: provider,
            },
        });
    } finally {
        // kill anvil
        anvil.kill();
    }
};

task("deploy-anvil", "Deploys to anvil and dump state")
    .addParam<string>(
        "dumpFile",
        "anvil state dump file",
        "build/anvil_state.json",
        types.string,
    )
    .addOptionalParam<string>(
        "exportFile",
        "hardhat-deploy export file",
        undefined,
        types.string,
    )
    .addFlag("silent", "do not print any log")
    .setAction(deploy);
