import { Command, Flags } from "@oclif/core";
import bytes from "bytes";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import semver from "semver";
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
const SUNODO_DEFAULT_SDK_VERSION = "0.3.0";

const SUNODO_PATH = path.join(".sunodo");
const SUNODO_DEFAULT_MACHINE_SNAPSHOT_PATH = path.join(SUNODO_PATH, "image");
const SUNODO_DEFAULT_TAR_PATH = path.join(SUNODO_PATH, "image.tar");
const SUNODO_DEFAULT_RETAR_TAR_PATH = path.join(SUNODO_PATH, "image-retar.tar");
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
            throw new Error(`Unsupported sunodo sdk version.

Make sure you defined \`io.sunodo.sdk_version\` label at your Dockerfile.

It shoud be >= ${SUNODO_DEFAULT_SDK_VERSION}.

Eg.:

LABEL io.sunodo.sdk_version=${SUNODO_DEFAULT_SDK_VERSION}
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

    private async startBuildContainer(
        appImage: string,
        builderImage: string,
    ): Promise<string> {
        // create docker tarball from app image
        const { stdout: appCid } = await execa("docker", [
            "container",
            "create",
            "--platform",
            "linux/riscv64",
            appImage,
        ]);

        await execa("docker", [
            "container",
            "export",
            "-o",
            SUNODO_DEFAULT_TAR_PATH,
            appCid,
        ]);

        // start build container
        const { stdout: cid } = await execa("docker", [
            "container",
            "run",
            "--detach",
            "--init",
            `--volume=./${SUNODO_DEFAULT_TAR_PATH}:/tmp/${SUNODO_DEFAULT_TAR_PATH}`,
            builderImage,
            "sleep",
            "infinity",
        ]);

        return cid;
    }

    private async stopBuildContainer(container: string): Promise<void> {
        await execa("docker", ["container", "stop", container]);
        await execa("docker", ["container", "rm", container]);
        // delete image.tar (if exists)
        await fs.remove(SUNODO_DEFAULT_TAR_PATH);
    }

    // creates the rootfs tyar from the image
    private async createRootfsTar(container: string): Promise<void> {
        // ensure tar reproducibility
        await execa("docker", [
            "container",
            "exec",
            container,
            "retar",
            `/tmp/${SUNODO_DEFAULT_TAR_PATH}`,
            `/tmp/${SUNODO_DEFAULT_RETAR_TAR_PATH}`,
        ]);
    }

    private async createExt2(
        info: ImageInfo,
        container: string,
    ): Promise<void> {
        // calculate extra size
        const blockSize = 4096;
        const extraBytes = bytes.parse(info.dataSize);
        const extraBlocks = Math.ceil(extraBytes / blockSize);
        const extraSize = `+${extraBlocks}`;

        // create ext2
        await execa(
            "docker",
            [
                "container",
                "exec",
                container,
                "genext2fs",
                "--tarball",
                `/tmp/${SUNODO_DEFAULT_RETAR_TAR_PATH}`,
                "--block-size",
                blockSize.toString(),
                "--faketime",
                "-r",
                extraSize,
                `/tmp/${SUNODO_DEFAULT_EXT2_PATH}`,
            ],
            { stdio: "inherit" },
        );

        // export ext2 to host filesystem
        await execa(
            "docker",
            [
                "container",
                "cp",
                `${container}:/tmp/${SUNODO_DEFAULT_EXT2_PATH}`,
                SUNODO_DEFAULT_EXT2_PATH,
            ],
            { stdio: "inherit" },
        );
    }

    private async createMachineSnapshot(
        info: ImageInfo,
        container: string,
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

        // change snapshot directory permission to read for all
        await execa("docker", [
            "container",
            "exec",
            container,
            "chmod",
            "755",
            `/tmp/${SUNODO_DEFAULT_MACHINE_SNAPSHOT_PATH}`,
        ]);

        // export machine snapshot to host filesystem
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

        // XXX: should we delete image.ext2, or leave there for shell?
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

        // get SDK build container
        const container = await this.startBuildContainer(appImage, sdkImage);

        try {
            // create rootfs tar
            await this.createRootfsTar(container);

            // create ext2
            await this.createExt2(imageInfo, container);

            // create machine snapshot
            await this.createMachineSnapshot(imageInfo, container);
        } finally {
            // stop build container
            await this.stopBuildContainer(container);
        }
    }
}
