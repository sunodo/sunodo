import { UnixFS } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-core/memory";
import chalk from "chalk";
import fs from "fs-extra";
import { RawNode, UnixFSEntry, UnixFSFile } from "ipfs-unixfs-exporter";
import { importer } from "ipfs-unixfs-importer";
import { CID } from "multiformats/cid";
import { once } from "node:events";
import path from "node:path";

export type FileProgress = {
    file: UnixFSFile | RawNode;
    total: bigint;
    transferred: bigint;
    status: "cached" | "downloading" | "downloaded" | "error";
    error?: string;
};

export const text = (progress: FileProgress): string => {
    const { file, error, status, transferred, total } = progress;
    const text = file.path;

    const percent =
        total > 0 ? (Number(transferred) / Number(total)) * 100 : undefined;

    let suffixText = undefined;
    if (error) {
        suffixText = error;
    } else if (status === "cached") {
        suffixText = "cached";
    } else if (percent !== undefined) {
        suffixText = `${percent.toFixed(2)}% ${transferred}/${total}`;
    } else if (percent === undefined) {
        suffixText = `${transferred}/?`;
    }

    return `${text} ${chalk.dim(suffixText)}`;
};

const calculateCID = async (filename: string): Promise<CID | undefined> => {
    const stream = fs.createReadStream(filename);
    const blockstore = new MemoryBlockstore();
    let firstCid: CID | undefined = undefined;
    for await (const { cid } of importer(
        [{ path: filename, content: stream }],
        blockstore,
    )) {
        firstCid = firstCid || cid;
    }
    stream.close();
    return firstCid;
};

const link = (filename: string, cid: CID, output: string) => {
    const source = path.join(output, cid.toString());
    const target = path.join(output, filename);
    fs.ensureSymlinkSync(source, target);
};

async function* download(
    file: UnixFSFile | RawNode,
    output: string,
): AsyncGenerator<FileProgress, void> {
    // location of CID file
    const filename = path.join(output, file.cid.toString());

    if (fs.existsSync(filename)) {
        // verify file integrity
        const cid = await calculateCID(filename);
        if (!file.cid.equals(cid)) {
            // file is corrupted, delete it before continuing
            fs.rmSync(filename);
        } else {
            // file exists and it's not corrupted, don't need to download again
            yield { file, status: "cached", transferred: 0n, total: 0n };
            return;
        }
    }

    // create a file stream and read all content from entry into the stream
    const stream = fs.createWriteStream(filename, { autoClose: false });
    await once(stream, "open");

    let transferred = 0n;
    const total = file.size;
    try {
        for await (const chunk of file.content()) {
            stream.write(chunk);
            transferred += BigInt(chunk.length);

            // yield download progress
            yield { file, status: "downloading", total, transferred };
        }
        stream.close();
    } catch (e: any) {
        yield { file, error: e.message, status: "error", total, transferred };
    }
    yield { file, status: "downloaded", total, transferred };
}

async function* recursive(
    entry: UnixFSEntry,
): AsyncGenerator<UnixFSFile | RawNode> {
    switch (entry.type) {
        case "file":
        case "raw":
            yield entry;
            break;
        case "directory":
            for await (const child of entry.content()) {
                yield* recursive(child);
            }
            break;
        case "object":
        case "identity":
            // do nothing
            break;
    }
}

export const carfs = (ipfs: UnixFS) => ({
    ls: async function* (cid: CID): AsyncGenerator<UnixFSFile | RawNode> {
        for await (const entry of ipfs.ls(cid)) {
            yield* recursive(entry);
        }
    },

    save: async function* (
        file: UnixFSFile | RawNode,
        output: string,
    ): AsyncGenerator<FileProgress> {
        // download entry to CID file (if doesn't exist yet)
        yield* download(file, output);

        // link path to CID file
        link(file.path, file.cid, output);
    },
});
