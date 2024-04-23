import { Command, Flags } from "@oclif/core";
import bytes from "bytes";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import semver from "semver";
import tmp from "tmp";

import { DEFAULT_TEMPLATES_BRANCH } from "./create.js";

type ImageBuildOptions = {
    target?: string;
};

type ImageInfo = {
    cmd: string[];
    dataSize: string;
    entrypoint: string[];
    env: string[];
    ramSize: string;
    sdkVersion: string;
    workdir: string;
};

const CARTESI_LABEL_PREFIX = "io.cartesi.rollups";
const CARTESI_LABEL_RAM_SIZE = `${CARTESI_LABEL_PREFIX}.ram_size`;
const CARTESI_LABEL_DATA_SIZE = `${CARTESI_LABEL_PREFIX}.data_size`;
const CARTESI_DEFAULT_RAM_SIZE = "128Mi";

const SUNODO_LABEL_PREFIX = "io.sunodo";
const SUNODO_LABEL_SDK_VERSION = `${SUNODO_LABEL_PREFIX}.sdk_version`;
const SUNODO_DEFAULT_SDK_VERSION = "0.4.0";

const SUNODO_PATH = path.join(".sunodo");
const SUNODO_DEFAULT_MACHINE_SNAPSHOT_PATH = path.join(SUNODO_PATH, "image");
const SUNODO_DEFAULT_TAR_PATH = path.join(SUNODO_PATH, "image.tar");
const SUNODO_DEFAULT_RETAR_TAR_PATH = path.join(SUNODO_PATH, "image.gnutar");
const SUNODO_DEFAULT_EXT2_PATH = path.join(SUNODO_PATH, "image.ext2");

export default class BuildApplication extends Command {
    static summary = "Build application.";

    static description =
        "Build application starting from a Dockerfile and ending with a snapshot of the corresponding Cartesi Machine already booted and yielded for the first time. This snapshot can be used to start a Cartesi node for the application using `sunodo run`. The process can also start from a Docker image built by the developer using `docker build` using the option `--from-image`";

    static examples = [
        "<%= config.bin %> <%= command.id %>",
        "<%= config.bin %> <%= command.id %> --from-image my-app",
    ];

    static args = {};

    static flags = {
        "from-image": Flags.string({
            summary: "skip docker build and start from this image.",
            description:
                "if the build process of the application Dockerfile needs more control the developer can build the image using the `docker build` command, and then start the build process of the Cartesi machine starting from that image.",
        }),
        target: Flags.string({
            summary: "target of docker multi-stage build.",
            description:
                "if the application Dockerfile uses a multi-stage strategy, and stage of the image to be exported as a Cartesi machine is not the last stage, use this parameter to specify the target stage.",
        }),
    };

    /**
     * Build DApp image (linux/riscv64). Returns image id.
     * @param directory path of context containing Dockerfile
     */
    private async buildImage(options: ImageBuildOptions): Promise<string> {
        const buildResult = tmp.tmpNameSync();
        this.debug(
            `building docker image and writing result to ${buildResult}`,
        );
        const args = ["buildx", "build", "--load", "--iidfile", buildResult];
        if (options.target) {
            args.push("--target", options.target);
        }

        await execa("docker", [...args, process.cwd()], { stdio: "inherit" });
        return fs.readFileSync(buildResult, "utf8");
    }

    private async getImageInfo(image: string): Promise<ImageInfo> {
        const { stdout: jsonStr } = await execa("docker", [
            "image",
            "inspect",
            image,
        ]);
        // parse image info from docker inspect output
        const [imageInfo] = JSON.parse(jsonStr);

        // validate image architecture (must be riscv64)
        if (imageInfo["Architecture"] !== "riscv64") {
            throw new Error(
                `Invalid image Architecture: ${imageInfo["Architecture"]}. Expected riscv64`,
            );
        }

        const labels = imageInfo["Config"]["Labels"] || {};
        const info: ImageInfo = {
            cmd: imageInfo["Config"]["Cmd"] ?? [],
            dataSize: labels[CARTESI_LABEL_DATA_SIZE] ?? "10Mb",
            entrypoint: imageInfo["Config"]["Entrypoint"] ?? [],
            env: imageInfo["Config"]["Env"] || [],
            ramSize: labels[CARTESI_LABEL_RAM_SIZE] ?? CARTESI_DEFAULT_RAM_SIZE,
            sdkVersion:
                labels[SUNODO_LABEL_SDK_VERSION] ?? SUNODO_DEFAULT_SDK_VERSION,
            workdir: imageInfo["Config"]["WorkingDir"],
        };

        if (!info.entrypoint && !info.cmd) {
            throw new Error("Undefined image ENTRYPOINT or CMD");
        }

        // fail if using unsupported sdk version
        if (!semver.valid(info.sdkVersion)) {
            this.warn("sunodo sdk version is not a valid semver");
        } else if (semver.lt(info.sdkVersion, SUNODO_DEFAULT_SDK_VERSION)) {
            throw new Error(`Unsupported sunodo sdk version: ${info.sdkVersion} (used) < ${SUNODO_DEFAULT_SDK_VERSION} (minimum).
Update your application Dockerfile using one of the templates at https://github.com/sunodo/sunodo-templates/tree/${DEFAULT_TEMPLATES_BRANCH}
`);
        }

        // warn for using default values
        info.sdkVersion ||
            this.warn(
                `Undefined ${SUNODO_LABEL_SDK_VERSION} label, defaulting to ${SUNODO_DEFAULT_SDK_VERSION}`,
            );

        info.ramSize ||
            this.warn(
                `Undefined ${CARTESI_LABEL_RAM_SIZE} label, defaulting to ${CARTESI_DEFAULT_RAM_SIZE}`,
            );

        // validate data size value
        if (bytes(info.dataSize) === null) {
            throw new Error(
                `Invalid ${CARTESI_LABEL_DATA_SIZE} value: ${info.dataSize}`,
            );
        }

        // XXX: validate other values

        return info;
    }

    // creates a rootfs tarball from the image
    // this process is not always fully reproducible
    // FIXME: we could use the image and create a flat rootfs without
    //        `docker container create` (use undocker, umoci, a native typescript implementation, etc.)
    private async createTarball(
        image: string,
        outputFilePath: string,
    ): Promise<void> {
        // create docker tarball from app image
        const { stdout: appCid } = await execa("docker", [
            "container",
            "create",
            "--platform",
            "linux/riscv64",
            image,
        ]);

        await execa("docker", [
            "container",
            "export",
            "-o",
            outputFilePath,
            appCid,
        ]);

        await execa("docker", ["container", "rm", appCid]);
    }

    // this wraps the call to the sdk image with a one-shot approach
    // the (inputPath, outputPath) signature will mount the input as a volume and copy the output with docker cp
    private async sdkRun(
        sdkImage: string,
        cmd: string[],
        inputPath: string,
        outputPath: string,
    ): Promise<void> {
        const { stdout: cid } = await execa("docker", [
            "container",
            "create",
            "--volume",
            `./${inputPath}:/tmp/input`,
            sdkImage,
            ...cmd,
        ]);

        await execa("docker", ["container", "start", "-a", cid], {
            stdio: "inherit",
        });

        await execa("docker", [
            "container",
            "cp",
            `${cid}:/tmp/output`,
            outputPath,
        ]);

        await execa("docker", ["container", "stop", cid]);
        await execa("docker", ["container", "rm", cid]);
    }

    private createMachineSnapshotCommand(info: ImageInfo): string[] {
        const ramSize = info.ramSize;
        const driveLabel = "root"; // XXX: does this need to be customizable?

        // list of environment variables of docker image
        const envs = info.env.map(
            (variable) => `--append-entrypoint=export ${variable}`,
        );

        // ENTRYPOINT and CMD as a space separated string
        const entrypoint = [...info.entrypoint, ...info.cmd].join(" ");

        // command to change working directory if WORKDIR is defined
        const cwd = info.workdir ? `--append-init=WORKDIR=${info.workdir}` : "";
        return [
            "cartesi-machine",
            "--assert-rolling-template",
            `--ram-length=${ramSize}`,
            `--flash-drive=label:${driveLabel},filename:/tmp/input`,
            "--final-hash",
            `--store=/tmp/output`,
            "--append-bootargs=no4lvl",
            cwd,
            ...envs,
            `--append-entrypoint=${entrypoint}`,
        ];
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(BuildApplication);

        // clean up temp files we create along the process
        tmp.setGracefulCleanup();

        // use pre-existing image or build dapp image
        const appImage = flags["from-image"] || (await this.buildImage(flags));

        // prapare .sunodo directory
        await fs.emptyDir(SUNODO_PATH); // XXX: make it less error prone

        // get and validate image info
        const imageInfo = await this.getImageInfo(appImage);

        // resolve sdk version
        const sdkImage = `sunodo/sdk:${imageInfo.sdkVersion}`;

        try {
            // create docker tarball for image specified
            await this.createTarball(appImage, SUNODO_DEFAULT_TAR_PATH);

            // create rootfs tar
            await this.sdkRun(
                sdkImage,
                [
                    "bsdtar",
                    "-cf",
                    "/tmp/output",
                    "--format=gnutar",
                    "@/tmp/input",
                ],
                SUNODO_DEFAULT_TAR_PATH,
                SUNODO_DEFAULT_RETAR_TAR_PATH,
            );

            // create ext2
            await this.sdkRun(
                sdkImage,
                [
                    "xgenext2fs",
                    "--tarball",
                    "/tmp/input",
                    "--block-size",
                    "4096",
                    "--faketime",
                    "-r",
                    "+1",
                    "/tmp/output",
                ],
                SUNODO_DEFAULT_RETAR_TAR_PATH,
                SUNODO_DEFAULT_EXT2_PATH,
            );

            // create machine snapshot
            if (!flags["skip-snapshot"]) {
                await this.sdkRun(
                    sdkImage,
                    this.createMachineSnapshotCommand(imageInfo),
                    SUNODO_DEFAULT_EXT2_PATH,
                    SUNODO_DEFAULT_MACHINE_SNAPSHOT_PATH,
                );
                await fs.chmod(SUNODO_DEFAULT_MACHINE_SNAPSHOT_PATH, 0o755);
            }
        } finally {
            await fs.remove(SUNODO_DEFAULT_RETAR_TAR_PATH);
            await fs.remove(SUNODO_DEFAULT_TAR_PATH);
        }
    }
}
