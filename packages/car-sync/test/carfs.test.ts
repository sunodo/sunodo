import { globSource, unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-core/memory";
import type { CID } from "multiformats/cid";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { carfs, type FileProgress } from "../src/index.js";

const DATA = path.join(import.meta.dirname, "data");

// files under test/data, relative to it
const dataFiles = (fs.readdirSync(DATA, { recursive: true }) as string[])
    .filter((f) => fs.statSync(path.join(DATA, f)).isFile())
    .sort();

// import test/data into an in-memory blockstore, returning the root directory CID
const importData = async () => {
    const blockstore = new MemoryBlockstore();
    const ufs = unixfs({ blockstore });
    let root: CID | undefined;
    for await (const entry of ufs.addAll(globSource(DATA, "**/*"), {
        wrapWithDirectory: true,
    })) {
        root = entry.cid;
    }
    if (!root) throw new Error("nothing imported");
    return { car: carfs(ufs), root };
};

// entry paths are prefixed by the root CID, strip it to get the data-relative path
const relative = (filePath: string) => filePath.split("/").slice(1).join("/");

// download every file under root, returning the final progress of each one
const sync = async (
    car: ReturnType<typeof carfs>,
    root: CID,
    output: string,
) => {
    const results: FileProgress[] = [];
    for await (const file of car.ls(root)) {
        let last: FileProgress | undefined;
        for await (const progress of car.save(file, output)) {
            last = progress;
        }
        if (last) results.push(last);
    }
    return results;
};

describe("carfs", () => {
    let output: string;

    beforeEach(() => {
        output = fs.mkdtempSync(path.join(os.tmpdir(), "car-sync-"));
    });

    afterEach(() => {
        fs.rmSync(output, { recursive: true, force: true });
    });

    test("lists every file in the directory tree", async () => {
        const { car, root } = await importData();
        const paths: string[] = [];
        for await (const file of car.ls(root)) {
            paths.push(relative(file.path));
        }
        expect(paths.sort()).toEqual(dataFiles);
    });

    test("downloads files and links paths to CID files", async () => {
        const { car, root } = await importData();
        const results = await sync(car, root, output);

        expect(results).toHaveLength(dataFiles.length);
        const seen = new Set<string>();
        for (const { file, status, transferred, total } of results) {
            // files with the same content share a CID, so only the first is downloaded
            const cid = file.cid.toString();
            if (seen.has(cid)) {
                expect(status).toBe("cached");
            } else {
                expect(status).toBe("downloaded");
                expect(transferred).toBe(total);
            }
            seen.add(cid);

            // file path is a symlink to the CID file, with the original content
            const target = path.join(output, file.path);
            expect(fs.lstatSync(target).isSymbolicLink()).toBe(true);
            expect(fs.readFileSync(target)).toEqual(
                fs.readFileSync(path.join(DATA, relative(file.path))),
            );
            expect(fs.existsSync(path.join(output, file.cid.toString()))).toBe(
                true,
            );
        }
    });

    test("stores duplicate content once", async () => {
        const { car, root } = await importData();
        const results = await sync(car, root, output);

        // test/data/dir1/file1 and dir1/file2 have identical content
        const [file1, file2] = ["dir1/file1", "dir1/file2"].map(
            (p) => results.find((r) => relative(r.file.path) === p)?.file,
        );
        expect(file1?.cid.equals(file2?.cid)).toBe(true);
        expect(fs.realpathSync(path.join(output, file1?.path ?? ""))).toBe(
            fs.realpathSync(path.join(output, file2?.path ?? "")),
        );
    });

    test("skips files already downloaded", async () => {
        const { car, root } = await importData();
        await sync(car, root, output);

        const results = await sync(car, root, output);
        expect(results.map((r) => r.status)).toEqual(
            dataFiles.map(() => "cached"),
        );
    });

    test("downloads again a corrupted CID file", async () => {
        const { car, root } = await importData();
        const [first] = await sync(car, root, output);
        const cidFile = path.join(output, first.file.cid.toString());
        fs.writeFileSync(cidFile, "corrupted");

        const results = await sync(car, root, output);
        const redownloaded = results.find((r) =>
            r.file.cid.equals(first.file.cid),
        );
        expect(redownloaded?.status).toBe("downloaded");
        expect(fs.readFileSync(cidFile)).toEqual(
            fs.readFileSync(path.join(DATA, relative(first.file.path))),
        );
    });
});
