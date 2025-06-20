import fs from "fs-extra";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { download } from "../src/download";

describe("download", () => {
    it("should download honeypot machine", async () => {
        const templateHash =
            "0x615acc9fb8ae058d0e45c0d12fa10e1a6c9e645222c6fd94dfeda194ee427c14";
        const remotePath =
            "https://github.com/cartesi/honeypot/releases/download/v2.0.0/honeypot-snapshot-mainnet.tar.gz";
        const localPath = `${path.join(__dirname)}/${templateHash}`;
        await download({
            localPath,
            remotePath,
            templateHash,
        });

        // check if the file exists
        expect(fs.existsSync(localPath)).toBe(true);
        fs.removeSync(localPath);
    });
});
