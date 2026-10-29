// Copies the ABI and bytecode of every contract in src/ from the forge build
// output (out/) to export/artifacts/<ContractName>.json, which is published
// with the npm package.
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = "out";
const exportDir = path.join("export", "artifacts");

type ForgeArtifact = {
    abi: unknown[];
    bytecode: { object: string };
    deployedBytecode: { object: string };
    metadata: { settings: { compilationTarget: Record<string, string> } };
};

await rm(exportDir, { recursive: true, force: true });
await mkdir(exportDir, { recursive: true });

for (const dir of await readdir(outDir)) {
    if (!dir.endsWith(".sol")) continue;
    for (const file of await readdir(path.join(outDir, dir))) {
        const artifact: ForgeArtifact = JSON.parse(
            await readFile(path.join(outDir, dir, file), "utf-8"),
        );
        const [[sourceName, contractName]] = Object.entries(
            artifact.metadata.settings.compilationTarget,
        );
        if (!sourceName.startsWith("src/")) continue;

        await writeFile(
            path.join(exportDir, `${contractName}.json`),
            `${JSON.stringify(
                {
                    contractName,
                    sourceName,
                    abi: artifact.abi,
                    bytecode: artifact.bytecode.object,
                    deployedBytecode: artifact.deployedBytecode.object,
                },
                null,
                4,
            )}\n`,
        );
        console.log(`exported ${sourceName}:${contractName}`);
    }
}
