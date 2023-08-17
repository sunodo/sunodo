import { Command, Flags } from "@oclif/core";
import fs from "fs-extra";
import os from "os";
import path from "path";
import { execa } from "execa";
import tmp from "tmp";
import bytes from "bytes";

type ImageBuildOptions = {
    network: string;
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
const SUNODO_DEFAULT_SDK_VERSION = "0.2.0";

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
        network: Flags.string({
            summary: "target network name of application.",
            description:
                "the specified network name is injected as build-arg of the application Dockerfile. It's up to the developer to use that depending on the application needs.",
            default: "localhost",
        }),
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
    private async buildDAppImage(options: ImageBuildOptions): Promise<string> {
        const buildResult = tmp.tmpNameSync();
        this.debug(
            `building docker image and writing result to ${buildResult}`,
        );
        const args = [
            "buildx",
            "build",
            "--load",
            "--build-arg",
            `NETWORK=${options.network}`,
            "--iidfile",
            buildResult,
        ];
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

    private async exportImageTar(
        image: string,
        tarPath: string,
    ): Promise<void> {
        // create container
        const { stdout: cid } = await execa("docker", [
            "container",
            "create",
            "--platform",
            "linux/riscv64",
            image,
        ]);

        // export container rootfs to tar
        await execa("docker", ["export", "-o", tarPath, cid]);

        // remove container
        await execa("docker", ["rm", cid]);
    }

    private async createExt2(
        sdkImage: string,
        info: ImageInfo,
        tarPath: string,
    ): Promise<string> {
        // extract base name of tar file
        const tarName = path.basename(tarPath, path.extname(tarPath));

        const containerDir = "/mnt";
        const bind = `${path.resolve(path.dirname(tarPath))}:${containerDir}`;
        const tar = path.join(containerDir, tarName + ".tar");
        const ext2 = path.join(containerDir, tarName + ".ext2");

        // su, variables to run container as current user
        const user = os.userInfo();
        const su = [
            "--env",
            `USER=${user.username}`,
            "--env",
            `GROUP=container-group-${user.gid}`,
            "--env",
            `UID=${user.uid}`,
            "--env",
            `GID=${user.gid}`,
        ];

        // re-tar as gnu format, issue with locale
        await execa("docker", [
            "container",
            "run",
            "--rm",
            ...su,
            "--volume",
            bind,
            sdkImage,
            "retar",
            tar,
        ]);

        // calculate extra size
        const blockSize = 4096;
        const extraBytes = bytes.parse(info.dataSize);
        const extraBlocks = Math.ceil(extraBytes / blockSize);
        const extraSize = `+${extraBlocks}`;

        await execa(
            "docker",
            [
                "container",
                "run",
                "--rm",
                ...su,
                "--volume",
                bind,
                sdkImage,
                "genext2fs",
                "--tarball",
                tar,
                "--block-size",
                blockSize.toString(),
                "--faketime",
                "-r",
                extraSize,
                ext2,
            ],
            { stdio: "inherit" },
        );
        return path.join(path.dirname(tarPath), tarName + ".ext2");
    }

    private async createMachineSnapshot(
        sdkImage: string,
        info: ImageInfo,
        ext2Path: string,
    ): Promise<void> {
        // extract base name of tar file
        const name = path.basename(ext2Path, path.extname(ext2Path));

        const containerDir = "/mnt";
        const absolutePath = path.resolve(path.dirname(ext2Path));
        const bind = `${absolutePath}:${containerDir}`;
        const ext2 = path.join(containerDir, name + ".ext2");
        const ramSize = info.ramSize;
        const driveLabel = "root"; // XXX: does this need to be customizable?
        const outDir = path.join(containerDir, name);

        // su, variables to run container as current user
        const user = os.userInfo();
        const su = [
            "--env",
            `USER=${user.username}`,
            "--env",
            `GROUP=container-group-${user.gid}`,
            "--env",
            `UID=${user.uid}`,
            "--env",
            `GID=${user.gid}`,
        ];

        // list of environment variables of docker image
        // XXX: we can't include all of them because cartesi-machine command has length limits
        const envs = info.env.filter((variable) => {
            if (variable.startsWith("ROLLUP_HTTP_SERVER_URL=")) {
                return true;
            } else if (variable.startsWith("PATH=")) {
                return true;
            } else {
                this.warn(`ommiting environment variable ${variable}`);
                return false;
            }
        });
        const env = envs.join(" ");

        // ENTRYPOINT and CMD as a space separated string
        const entrypoint_cmd = [...info.entrypoint, ...info.cmd].join(" ");

        // command to change working directory if WORKDIR is defined
        const cwd = info.workdir ? `cd ${info.workdir}` : "";

        // join everything
        const bootargs = [cwd, [env, entrypoint_cmd].join(" ")].join(";");
        this.log(bootargs);

        await execa(
            "docker",
            [
                "container",
                "run",
                "--rm",
                ...su,
                "--volume",
                bind,
                sdkImage,
                "cartesi-machine",
                "--assert-rolling-template",
                `--ram-length=${ramSize}`,
                "--rollup",
                `--flash-drive=label:${driveLabel},filename:${ext2}`,
                "--final-hash",
                `--store=${outDir}`,
                "--",
                bootargs,
            ],
            { stdio: "inherit" },
        );

        // change image directory permission to 755
        await fs.chmod(path.join(absolutePath, name), 0o755);
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(BuildApplication);

        // clean up temp files we create along the process
        tmp.setGracefulCleanup();

        // use pre-existing image or build dapp image
        const image = flags["from-image"] || (await this.buildDAppImage(flags));

        // get and validate image info
        const imageInfo = await this.getImageInfo(image);

        // resolve sdk version
        const sdkImage = `sunodo/sdk:${imageInfo.sdkVersion}`;

        // export dapp image as rootfs tar
        await fs.emptyDir(".sunodo"); // XXX: make it less error prone
        const tarPath = path.join(".sunodo", `image.tar`);
        await this.exportImageTar(image, tarPath);

        // create ext2 drive
        const ext2Path = await this.createExt2(sdkImage, imageInfo, tarPath);

        // execute the machine and save snapshot
        await this.createMachineSnapshot(sdkImage, imageInfo, ext2Path);
    }
}
