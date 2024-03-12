import { DeployFunction, DeployOptions } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { zeroAddress } from "viem";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, viem } = hre;
    const { deployer } = await getNamedAccounts();

    const opts: DeployOptions = {
        deterministicDeployment: true,
        from: deployer,
        log: true,
    };

    const publicClient = await viem.getPublicClient();
    const ensAddress =
        publicClient.chain.contracts?.ensRegistry?.address || zeroAddress;

    // deploy the wrapper around the CartesiDAppFactory that includes machine IPFS hash
    const { CartesiDAppFactory } = await deployments.all();

    // deploy the factory of of payable deploys using ERC-20
    await deployments.deploy("Marketplace", {
        ...opts,
        args: [ensAddress, CartesiDAppFactory.address],
    });
};
export default func;
