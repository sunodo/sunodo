import { globSource, unixfs } from "@helia/unixfs";
import { MemoryBlockstore } from "blockstore-core/memory";
import { type ImporterOptions, importer } from "ipfs-unixfs-importer";
import type { CID } from "multiformats/cid";
import { randomBytes } from "node:crypto";
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

// import a directory into an in-memory blockstore, returning the root directory CID.
// Without options it uses the @helia/unixfs defaults, otherwise the importer with
// the given options (@helia/unixfs defaults would take precedence over a profile).
const importData = async (dir = DATA, options?: ImporterOptions) => {
    const blockstore = new MemoryBlockstore();
    const ufs = unixfs({ blockstore });
    const entries = options
        ? importer(globSource(dir, "**/*"), blockstore, {
              ...options,
              wrapWithDirectory: true,
          })
        : ufs.addAll(globSource(dir, "**/*"), { wrapWithDirectory: true });
    let root: CID | undefined;
    for await (const entry of entries) {
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

// content imported with @helia/unixfs or importer defaults, or a CID profile
// (IPIP-499), including a 3 MB file that spans multiple chunks in every case
describe.each<[string, ImporterOptions | undefined, number]>([
    ["@helia/unixfs defaults", undefined, 1],
    ["importer defaults", {}, 1],
    ["unixfs-v0-2015 profile", { profile: "unixfs-v0-2015" }, 0],
    ["unixfs-v1-2025 profile", { profile: "unixfs-v1-2025" }, 1],
])("cache of content imported with %s", (_, options, cidVersion) => {
    let source: string;
    let output: string;

    beforeEach(() => {
        source = fs.mkdtempSync(path.join(os.tmpdir(), "car-sync-src-"));
        output = fs.mkdtempSync(path.join(os.tmpdir(), "car-sync-"));
        fs.cpSync(DATA, source, { recursive: true });
        fs.writeFileSync(path.join(source, "large"), randomBytes(3_000_000));
    });

    afterEach(() => {
        fs.rmSync(source, { recursive: true, force: true });
        fs.rmSync(output, { recursive: true, force: true });
    });

    test("skips files already downloaded", async () => {
        const { car, root } = await importData(source, options);
        expect(root.version).toBe(cidVersion);
        await sync(car, root, output);

        const results = await sync(car, root, output);
        expect(results).toHaveLength(dataFiles.length + 1);
        for (const { file, status } of results) {
            expect(file.cid.version).toBe(cidVersion);
            expect(status).toBe("cached");
        }
    });
});
