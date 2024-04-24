import { Args, Command, Flags } from "@oclif/core";
import { execa } from "execa";
import fs from "fs-extra";
import { lookpath } from "lookpath";
import path from "path";

export default class Exec extends Command {
    static description = "Execute command in cartesi machine of application";

    static examples = ["<%= config.bin %> <%= command.id %> /bin/bash"];

    static args = {
        image: Args.string({
            description: "image ID|name",
            required: false,
        }),
        command: Args.string({
            description: "Command to execute",
            required: false,
        }),
    };

    static flags = {
        "run-as-root": Flags.boolean({
            description: "run as root user",
            default: false,
        }),
    };

    private async startExec(
        ext2Path: string,
        runAsRoot: boolean,
        command: string[],
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

        await execa("docker", [...args, "--", ...command], {
            stdio: "inherit",
        });
    }

    public async run(): Promise<void> {
        const { argv, flags } = (await this.parse(Exec)) as {
            argv: string[];
            flags: { "run-as-root": boolean };
        };

        // use pre-existing image or build dapp image
        const ext2Path = path.join(".sunodo", "image.ext2");
        if (!fs.existsSync(ext2Path)) {
            throw new Error(`machine not build, run \`sunodo build\``);
        }

        // Execute the command in the shell
        await this.startExec(ext2Path, flags["run-as-root"], argv);
    }
}
