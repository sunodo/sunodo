import { CarWriter } from "@ipld/car/writer";
import cliProgress from "cli-progress";
import { filesFromPaths } from "files-from-path";
import fs from "fs-extra";
import {
    createDirectoryEncoderStream,
    CAREncoderStream,
    FileLike,
} from "ipfs-car";
import { create } from "kubo-rpc-client";
import { CID } from "multiformats/cid";
import path from "path";
import progress from "progress-stream";
import { Readable, Writable } from "stream";
import zlib from "zlib";

import { IPFSOptions } from "./deploy.js";
export type IPFSTestResult = "success" | "unauthorized" | "failed";

export const testConnection = async (
    options: IPFSOptions,
): Promise<IPFSTestResult> => {
    try {
        const headers: Record<string, string> = {};
        if (options.username && options.password) {
            headers["authorization"] = `Basic ${Buffer.from(
                `${options.username}:${options.password}`,
            ).toString("base64")}`;
        }
        const client = create({ url: options.url, headers: headers });
        await client.version();
        return "success";
    } catch (err: any) {
        if (err.response?.status === 401) {
            return "unauthorized";
        } else {
            return "failed";
        }
    }
};

export const packageDirectory = async (
    directory: string,
    output: string,
): Promise<string> => {
    const files = await filesFromPaths(directory);

    // Root CID written in CAR file header before it is updated with the real root CID.
    const placeholderCID = CID.parse(
        "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
    );
    let rootCID: CID;
    await createDirectoryEncoderStream(files)
        .pipeThrough(
            new TransformStream({
                transform: (block, controller) => {
                    rootCID = block.cid as CID;
                    controller.enqueue(block);
                },
            }),
        )
        .pipeThrough(new CAREncoderStream([placeholderCID]))
        .pipeTo(Writable.toWeb(fs.createWriteStream(output)));

    // update roots in CAR header
    const fd = await fs.promises.open(output, "r+");
    await CarWriter.updateRootsInFile(fd, [rootCID!]);
    await fd.close();

    return rootCID!.toString();
};

export const importDirectory = async (
    directory: string,
    options: IPFSOptions,
): Promise<string> => {
    // progress bar for each file
    const multibar = new cliProgress.MultiBar({
        clearOnComplete: true,
        autopadding: true,
        format: "{bar} | {filename} | {value}/{total}",
    });

    // @ts-expect-error node web stream not type compatible with web stream
    const files: FileLike[] = fs.readdirSync(directory).map((name) => {
        // get size of file
        const { size } = fs.statSync(path.join(directory, name));

        // create progress bar for this filse
        const bar = multibar.create(size, 0, { filename: name });

        // create stream progress
        const p = progress({ length: size, time: 100 }, (progress) =>
            bar.update(progress.transferred, { filename: name }),
        );

        // create stream, passing through progress counter based of raw file size
        let stream: Readable = fs
            .createReadStream(path.join(directory, name))
            .pipe(p);

        // optional gzip compression
        const compress = false; // XXX: make an option?
        stream = compress ? stream.pipe(zlib.createGzip()) : stream;

        return {
            name,
            stream: () => Readable.toWeb(stream),
        };
    });

    // create CAR stream
    let cid: string = "";
    const stream = createDirectoryEncoderStream(files)
        .pipeThrough(
            new TransformStream({
                transform: (block, controller) => {
                    // track last CID, which is the root CID
                    cid = block.cid.toString();
                    controller.enqueue(block);
                },
            }),
        )
        .pipeThrough(new CAREncoderStream());

    // connect to remote IPFS node
    const headers: Record<string, string> = {};
    if (options.username && options.password) {
        headers["Authorization"] = `Basic ${Buffer.from(
            `${options.username}:${options.password}`,
        ).toString("base64")}`;
    }
    const client = create({ url: options.url, headers });

    // upload tar to IPFS, getting the CID
    // @ts-expect-error node web stream not type compatible with web stream
    const results = client.dag.import([Readable.fromWeb(stream)]);
    for await (const result of results) {
        const error = result.root.pinErrorMsg;
        if (error) {
            throw new Error(error);
        }
    }

    // XXX: import above should be pinning, but it doesn't seem to be
    await client.pin.add(cid);

    // hide completed progress bar
    multibar.stop();

    return cid;
};
