import { CARFS, text } from "@sunodo/car-download";
import { CID } from "multiformats/cid";
import path from "node:path";
import ora from "ora";

export interface MachineRepository {
    // download a Cartesi machine snapshot, return its location on disk
    download(location: string): Promise<string>;
}

export class IPFSMachineRepository implements MachineRepository {
    // local directory to store all downloaded snapshots
    public readonly destination: string;

    // communication with IPFS through helia
    private carfs: CARFS;

    constructor(carfs: CARFS, destination: string) {
        this.carfs = carfs;
        this.destination = destination;
    }

    async download(location: string): Promise<string> {
        // assume location is a CID
        const cid = CID.parse(location);

        for await (const file of this.carfs.ls(cid)) {
            // download CID and link to file path
            const spinner = ora(file.path).start();
            try {
                for await (const progress of this.carfs.save(
                    file,
                    this.destination,
                )) {
                    spinner.text = text(progress);
                    switch (progress.status) {
                        case "cached":
                        case "downloaded": {
                            spinner.succeed();
                            break;
                        }

                        case "error": {
                            spinner.fail(progress.error);
                            break;
                        }
                    }
                }

                spinner.succeed();
            } catch (error) {
                spinner.fail(
                    error instanceof Error ? error.message : undefined,
                );
                throw error;
            }
        }

        return path.join(this.destination, cid.toString());
    }
}
