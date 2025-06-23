import { execa } from "execa";
import { Address } from "viem";

export const register = async (options: {
    address: Address;
    name: string;
    templatePath: string;
}) => {
    const { address, name, templatePath } = options;
    console.log(`registering application ${name}`);

    return execa("cartesi-rollups-cli", [
        "app",
        "register",
        "--name",
        name,
        "--address",
        address,
        "--template-path",
        templatePath,
    ]);
};

export const remove = async (options: { name: string }) => {
    const { name } = options;
    console.log(`removing application ${name}`);

    // first disable it
    await execa("cartesi-rollups-cli", ["app", "status", name, "disabled"]);

    // then remove it
    return execa("cartesi-rollups-cli", ["app", "remove", name, "--force"]);
};
