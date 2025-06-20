import { execa } from "execa";
import fs from "fs-extra";
import got from "got";
import { pipeline } from "stream/promises";
import * as tar from "tar";
import tmp from "tmp";

// Automatically remove temp dir on process exit
tmp.setGracefulCleanup();

const downloadTmp = async (remotePath: string): Promise<string> => {
    // Use fetch to download the file from remotePath and write it to tempPath
    const tmpDir = tmp.dirSync({ unsafeCleanup: true });
    const extractPath = tmpDir.name;

    try {
        const responseStream = got.stream(remotePath);
        await pipeline(responseStream, tar.x({ cwd: extractPath }));
        return extractPath;
    } catch (err) {
        tmpDir.removeCallback(); // cleanup on error
        throw err;
    }
};

export const download = async (options: {
    localPath: string;
    remotePath: string;
    templateHash: string;
}) => {
    console.log(`downloading ${options.remotePath} to ${options.localPath}`);

    // download from remote path to temp dir first
    const { remotePath, localPath, templateHash } = options;

    // extract first to temp dir
    const extractPath = await downloadTmp(remotePath);

    // execute cartesi machine to check the hash
    const { stderr } = await execa("cartesi-machine", [
        `--load=${extractPath}`,
        "--max-mcycle=0",
        "--final-hash",
    ]);

    // load hash from stderr
    const m = stderr.match(/\b([a-fA-F0-9]{64})\b/g);
    if (!m) {
        throw new Error("Failed to get hash from cartesi-machine");
    }
    const machineHash = `0x${m[0]}`;

    // check if the hash is the same
    if (machineHash !== templateHash) {
        throw new Error("Hash mismatch");
    }

    // move all files from extractPath to the final destination
    fs.moveSync(extractPath, localPath);
};
