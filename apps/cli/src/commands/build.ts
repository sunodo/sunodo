import { Command, Flags } from "@oclif/core";
import bytes from "bytes";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import tmp from "tmp";

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
const SUNODO_DEFAULT_SDK_VERSION = "0.2.1";

const SUNODO_DEFAULT_MACHINE_SNAPSHOT_PATH = path.join(".sunodo", `image`);
const SUNODO_DEFAULT_DOCKER_TAR_PATH = path.join(".sunodo", `docker-image.tar`);;
const SUNODO_DEFAULT_TAR_PATH = path.join(".sunodo", `image.tar`);
const SUNODO_DEFAULT_EXT2_PATH = path.join(".sunodo", `image.ext2`);

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
    private async buildDAppImage(options: ImageBuildOptions): Promise<string> {
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

    // creates docker image tar
    private async exportImageTar(
        image: string,
        path: string,
    ): Promise<void> {
        // delete tar if exists
        if (fs.existsSync(path))
            fs.unlinkSync(path);

        // save container image tar
        await execa("docker", [
            "image",
            "save",
            image,
            "--output",
            path,
        ], { stdio: "inherit" });
    }

    // creates the rootfs tyar from the image
    private async createRootfsTar(
        image: string,
        container: string,
    ): Promise<void> {
        //create rootfs tar
        await execa(
            "docker",
            [
                "container",
                "exec",
                container,
                "undocker",
                `/tmp/${SUNODO_DEFAULT_DOCKER_TAR_PATH}`,
                `/tmp/${SUNODO_DEFAULT_TAR_PATH}`
            ],
            { stdio: "inherit" },
        );

        // delete tar if exists
        if (fs.existsSync(SUNODO_DEFAULT_DOCKER_TAR_PATH))
            fs.unlinkSync(SUNODO_DEFAULT_DOCKER_TAR_PATH);
    }

    private async exportRootfsTar(
        container: string,
        path: string,
    ): Promise<void> {
        await execa(
            "docker",
            [
                "container",
                "cp",
                `${container}:/tmp/${SUNODO_DEFAULT_TAR_PATH}`,
                path,
            ],
            { stdio: "inherit" },
        );
    }

    private async getBuildContainer(
        image: string
    ): Promise<string> {
        const { stdout: cid } = await execa("docker", [
            "container",
            "run",
            "--detach",
            "--init",
            `--volume=./${SUNODO_DEFAULT_DOCKER_TAR_PATH}:/tmp/${SUNODO_DEFAULT_DOCKER_TAR_PATH}`,
            image,
            "sleep",
            "infinity"
        ]);

        return cid;
    }

    private async stopBuildContainer(container: string): Promise<void> {
        await execa("docker", ["container", "stop", container]);
        await execa("docker", ["container", "rm", container]);
    }

    private async createExt2(
        info: ImageInfo,
        container: string,
    ): Promise<void> {
        // re-tar as gnu format, issue with locale
        await execa("docker", [
            "container",
            "exec",
            container,
            "retar",
            `/tmp/${SUNODO_DEFAULT_TAR_PATH}`,
        ]);

        // calculate extra size
        const blockSize = 4096;
        const extraBytes = bytes.parse(info.dataSize);
        const extraBlocks = Math.ceil(extraBytes / blockSize);
        const extraSize = `+${extraBlocks}`;

        //create ext2
        await execa(
            "docker",
            [
                "container",
                "exec",
                container,
                "genext2fs",
                "--tarball",
                `/tmp/${SUNODO_DEFAULT_TAR_PATH}`,
                "--block-size",
                blockSize.toString(),
                "--faketime",
                "-r",
                extraSize,
                `/tmp/${SUNODO_DEFAULT_EXT2_PATH}`,
            ],
            { stdio: "inherit" },
        );
    }

    private async createMachineSnapshot(
        info: ImageInfo,
        container: string
    ): Promise<void> {
        const ramSize = info.ramSize;
        const driveLabel = "root"; // XXX: does this need to be customizable?

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

        // create machine snapshot
        await execa(
            "docker",
            [
                "container",
                "exec",
                container,
                "cartesi-machine",
                "--assert-rolling-template",
                `--ram-length=${ramSize}`,
                "--rollup",
                `--flash-drive=label:${driveLabel},filename:/tmp/${SUNODO_DEFAULT_EXT2_PATH}`,
                "--final-hash",
                `--store=/tmp/${SUNODO_DEFAULT_MACHINE_SNAPSHOT_PATH}`,
                "--",
                bootargs,
            ],
            { stdio: "inherit" },
        );
    }

    private async exportExt2(
        container: string,
        path: string,
    ): Promise<void> {
        await execa(
            "docker",
            [
                "container",
                "cp",
                `${container}:/tmp/${SUNODO_DEFAULT_EXT2_PATH}`,
                path,
            ],
            { stdio: "inherit" },
        );
    }

    private async exportMachineSnapshot(
        container: string,
        path: string,
    ): Promise<void> {
        await execa(
            "docker",
            [
                "container",
                "cp",
                `${container}:/tmp/${SUNODO_DEFAULT_MACHINE_SNAPSHOT_PATH}`,
                SUNODO_DEFAULT_MACHINE_SNAPSHOT_PATH,
            ],
            { stdio: "inherit" },
        );
    }

    public async run(): Promise<void> {
        const { flags } = await this.parse(BuildApplication);

        // clean up temp files we create along the process
        tmp.setGracefulCleanup();

        // use pre-existing image or build dapp image
        const image = flags["from-image"] || (await this.buildDAppImage(flags));

        // prapare .sunodo directory
        await fs.emptyDir(".sunodo"); // XXX: make it less error prone
        await this.exportImageTar(image, SUNODO_DEFAULT_DOCKER_TAR_PATH);

        // get and validate image info
        const imageInfo = await this.getImageInfo(image);
        // resolve sdk version
        const sdkImage = `sunodo/sdk:${imageInfo.sdkVersion}`;

        // get SDK build container
        const container = await this.getBuildContainer(sdkImage);

        try {
            // create rootfs tar
            await this.createRootfsTar(image, container);
            await this.exportRootfsTar(container, SUNODO_DEFAULT_TAR_PATH);
            // create ext2
            await this.createExt2(imageInfo, container);
            await this.exportExt2(container, SUNODO_DEFAULT_EXT2_PATH);
            // create machine snapshot
            await this.createMachineSnapshot(imageInfo, container);
            await this.exportMachineSnapshot(container, SUNODO_DEFAULT_MACHINE_SNAPSHOT_PATH);
        } catch (e) {
            throw e;
        } finally {
            // stop build container
            await this.stopBuildContainer(container);
        }
    }
}
