import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployOptions } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();

    const opts: DeployOptions = {
        deterministicDeployment: true,
        from: deployer,
        log: true,
    };

    // deploy the wrapper around the CartesiDAppFactory that includes machine IPFS hash
    const { CartesiDAppFactory } = await deployments.all();

    // deploy the factory of of payable deploys using ERC-20
    await deployments.deploy("PayableDAppSystem", {
        ...opts,
        args: [CartesiDAppFactory.address],
    });
};
export default func;
