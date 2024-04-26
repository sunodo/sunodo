import { Args, Flags } from "@oclif/core";
import { execa } from "execa";
import fs from "fs-extra";
import { lookpath } from "lookpath";
import path from "path";
import { BaseCommand } from "../baseCommand";

export default class Shell extends BaseCommand<typeof Shell> {
    static description = "Start a shell in cartesi machine of application";

    static examples = ["<%= config.bin %> <%= command.id %>"];

    static args = {
        image: Args.string({
            description: "image ID|name",
            required: false,
        }),
    };

    static flags = {
        "run-as-root": Flags.boolean({
            description: "run as root user",
            default: false,
        }),
    };

    private async startShell(
        ext2Path: string,
        runAsRoot: boolean,
    ): Promise<void> {
        const containerDir = "/mnt";
        const bind = `${path.resolve(path.dirname(ext2Path))}:${containerDir}`;
        const ext2 = path.join(containerDir, path.basename(ext2Path));
        const ramSize = "128Mi";
        const driveLabel = "root";
        const sdkImage = "sunodo/sdk:0.4.0"; // XXX: how to resolve sdk version?
        const args = [
            "run",
            "--interactive",
            "--tty",
            "--volume",
            bind,
            sdkImage,
            "cartesi-machine",
            `--ram-length=${ramSize}`,
            "--append-bootargs=no4lvl",
            `--flash-drive=label:${driveLabel},filename:${ext2}`,
        ];

        if (runAsRoot) {
            args.push("--append-init=USER=root");
        }

        if (!(await lookpath("stty"))) {
            args.push("-i");
        } else {
            args.push("-it");
        }

        await execa("docker", [...args, "--", "/bin/bash"], {
            stdio: "inherit",
        });
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(Shell);

        // use pre-existing image or build dapp image
        const ext2Path = this.getContextPath("image.ext2");
        if (!fs.existsSync(ext2Path)) {
            throw new Error(
                `machine not built, run '${this.config.bin} build'`,
            );
        }

        // execute the machine and save snapshot
        await this.startShell(ext2Path, flags["run-as-root"]);
    }
}
