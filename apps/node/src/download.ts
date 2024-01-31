import download from "download";
import fs from "fs-extra";

export const downloadMachine = async (
    snapshotUri: string,
    destination: string,
) => {
    console.log(`downloading ${snapshotUri}`);
    const url = new URL(snapshotUri);
    switch (url.protocol) {
        case "http:":
        case "https:":
            return download(snapshotUri, destination, { extract: true });
        case "file:":
            await fs.copy(url.pathname, destination);
        case "ipfs":
            return download(
                `https://ipfs.io/ipfs/${url.pathname}`,
                destination,
            );
        default:
            throw new Error(`Unsupported protocol: ${url.protocol}`);
    }
};
